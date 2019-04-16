define(["knockout", "searchUtils"],
    function (ko, searchUtils) {
        function viewModel() {
            var self = this;
            var $url = $(".search-layout").data("url");
            var currentPage = searchUtils.storageLocationKeyPrefix();
            var priceStorageKey = currentPage + "-selected-price";
            var sortStorageKey = currentPage + "-selected-sort-field";
            var savedFilters = searchUtils.getSessionStorageValue(currentPage, "[]");

            self.vehicles = ko.observableArray([]);
            self.makeFilter = ko.observableArray([]);
            self.dealerError = ko.observable("");
            self.selectedFilters = ko.observableArray(JSON.parse(savedFilters));
            self.filters = ko.observableArray([]);
            self.isLoading = ko.observable(false);
            self.totalResults = ko.observable("");
            self.postCode = ko.observable(Cookies.get("userPostCode") || "");
            self.showLoadMore = ko.observable(false);
            self.priceFilters = ko.observable({});
            self.filterKey = ko.observable("monthlycost");
            self.activeFilter = ko.observable(undefined);
            self.selectedPriceFilter = ko.observable(undefined);
            self.selectedMax = ko.observable(undefined);
            self.selectedMin = ko.observable(undefined);
            self.currentPage = ko.observable(0);
            self.stats = ko.observable({});
            self.isFiltersFromUrlParameters = ko.observable(false);
            self.promoDetailsArray = ko.observableArray([]);
            self.promoDetailsLength = 0;
            self.valuation_UID = ko.observable();
            self.valuation = ko.observable();
            self.priceFilterFromStorage = ko.observable(undefined);
            self.promoDetail = {};
            self.invalidPostCode = ko.observable(false);
            self.showDistanceDropDown = ko.observable(false);
            self.showPromoText = ko.observable(false);

            self.sortFields = ko.observable({
                priceAsc: [{
                    display: "One-Off Payment (Low to high)",
                    field: "price",
                    order: 1
                }],
                priceDesc: [{
                    display: "One-Off Payment (High to low)",
                    field: "price",
                    order: 2
                }],
                monthlypaymentAsc: [{
                    display: "Monthly Payment (Low to high)",
                    field: "monthlycost",
                    order: 1
                }],
                monthlypaymentDesc: [{
                    display: "Monthly Payment (High to low)",
                    field: "monthlycost",
                    order: 2
                }],
                distance: [{
                    display: "Distance",
                    field: "geodist()",
                    order: 1
                }]
            });

            self.sort = ko.observable(undefined);
            self.priceSortValueAsc = ko.observable(self.sortFields().priceAsc);
            self.priceSortValueDesc = ko.observable(self.sortFields().priceDesc);
            self.sortDisplayText = ko.observable("");

            var excludePriceFiltersByTerm = ["price", "monthlycost"];
            var statFields = ["price", "monthlycost"];

            self.showDistance = ko.computed(function(o) {
                var status = utilities.isPostcodeValid(self.postCode()) && !self.invalidPostCode();

                if (!status) {
                    self.sortDisplayText("");
                }

                self.showDistanceDropDown(status);
            });

            self.sortComputed = ko.computed(function () {
                self.sortDisplayText("");
                if (self.sort() !== undefined && self.sort().length > 0) {
                    self.sortDisplayText(self.sort()[0].display);
                }
            });

            self.sortDisplayLabels = ko.observable({});

            self.onSort = function (sortValue) {
                self.currentPage(0);
                self.sort(sortValue);
                self.load();
                var $functionBarActive = $(".function-bar__select-menu--active");
                if ($functionBarActive.length) {
                    $(".function-bar__select-menu--active").removeClass("function-bar__select-menu--active");
                }

                searchUtils.setSessionStorage(sortStorageKey, JSON.stringify(sortValue));
            };

            self.filterKey.subscribe(function (newValue) {
                var fromStorage = searchUtils.getSessionStorageValue(priceStorageKey);

                if (fromStorage !== undefined) {
                    var parsedJson = JSON.parse(fromStorage);

                    if (parsedJson !== undefined && parsedJson !== null && parsedJson.key !== newValue) {
                        self.clearAllSelectedPrices();
                    }

                } else {
                    self.clearAllSelectedPrices();
                }

                self.toggleFilter(newValue);

                self.load({
                    completeHandler: function () {
                        self.activeFilter(self.priceFilters()[newValue]);
                    }
                });
            });

            self.clearAll = function () {
                self.clearAllSelectedPrices();
                self.selectedFilters([]);
                var url = window.location.href.split("?")[0];

                window.history.pushState({}, "", url);

                if (self.filterKey() === "monthlycost") {
                    self.toggleFilter(self.filterKey());
                } else {
                    self.filterKey("monthlycost");
                }
            };

            self.clearAllSelectedPrices = function () {
                searchUtils.removeSessionItem(priceStorageKey);
                searchUtils.removeSessionItem(sortStorageKey);
                self.sortDisplayText("");
                self.selectedPriceFilter(undefined);
                self.activeFilter(undefined);
                self.selectedMax(undefined);
                self.selectedMin(undefined);
                self.priceFilterFromStorage(undefined);
                setDefaultSortOrder();
            };

            self.toggleFilter = function (key) {
                var selectedFilter = self.priceFilters()[key];
                
                if (selectedFilter !== undefined) {
                    self.activeFilter(selectedFilter);

                    if (key === "price") {
                        self.priceSortValueAsc(self.sortFields().priceAsc);
                        self.priceSortValueDesc(self.sortFields().priceDesc);
                        self.sortDisplayLabels({
                            low: self.sortFields().priceAsc[0].display,
                            high: self.sortFields().priceDesc[0].display
                        });
                    }

                    if (key === "monthlycost") {
                        self.priceSortValueAsc(self.sortFields().monthlypaymentAsc);
                        self.priceSortValueDesc(self.sortFields().monthlypaymentDesc);

                        self.sortDisplayLabels({
                            low: self.sortFields().monthlypaymentAsc[0].display,
                            high: self.sortFields().monthlypaymentDesc[0].display
                        });
                    }
                }

                setDefaultSortOrder();
            };

            self.onLoadMore = function () {

                var totalVehicles = self.totalResults();
                self.currentPage(self.vehicles().length);

                var parameters = {
                    responseHandler: function (data) {

                        var vehicles = self.vehicles();

                        vehicles = vehicles.concat(data.vehicles);

                        self.vehicles(vehicles);

                        self.showLoadMore(totalVehicles > self.vehicles().length);

                        self.isLoading(false);
                    }
                };

                self.load(parameters);
            };

            self.buildFilters = function (filters) {
                var filter = [];

                if (!self.isFiltersFromUrlParameters()) {
                    searchUtils.setSessionStorage(currentPage, JSON.stringify(self.selectedFilters()));
                }

                filters = filters !== undefined ? filters : self.selectedFilters();

                filters.forEach(function (obj) {

                    var filterObject = JSON.parse(obj);

                    filter.push(filterObject);
                });

                var priceFilters = [];

                if (self.selectedPriceFilter() !== undefined) {
                    priceFilters = self.selectedPriceFilter().filters;
                } else if (self.priceFilterFromStorage() !== undefined) {
                    priceFilters = self.priceFilterFromStorage().filters;
                }

                priceFilters.forEach(function (obj) {
                    filter.push(obj);
                });

                return filter;
            };

            self.load = function (parameters) {
                self.getPromoText();
                self.promoTextAdd();
                self.isLoading(true);
                var resultPerPage = 31;

                var searchNav = searchUtils.getSessionStorageValue("search_nav", null, true);

                if (searchNav !== null && searchNav !== undefined) {
                    resultPerPage = searchNav.currentTotal;
                }

                var defaultParameters = {
                    data: {
                        resultPerPage: resultPerPage,
                        currentPage: self.currentPage(),
                        sortFields: self.sort(),
                        postCode: self.postCode(),
                        filters: self.buildFilters(),
                        statFields: statFields,
                        distanceField: "distance",
                        locationField: "vehiclelocation"
                    },
                    completeHandler: function() {},
                    responseHandler: defaultResponseHandler,
                    url: $url
                };

                defaultParameters = $.extend(defaultParameters, parameters);

                $.ajax({
                    url: defaultParameters.url,
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    success: defaultParameters.responseHandler,
                    complete: defaultParameters.completeHandler,
                    data: JSON.stringify(defaultParameters.data)
                });
            };

            self.onLoadPreSelectedFilters = function () {
                var values = $("#defaultFilterValues").val();
                var newFilters = [];

                if (values.length > 0) {
                    var filters = JSON.parse(values);

                    filters.forEach(function (o) {
                        newFilters.push(JSON.stringify(o));
                    });

                    self.isFiltersFromUrlParameters(true);
                    self.selectedFilters(newFilters);
                }
            };

            self.priceOptionsParameters = {
                selectedPriceFilter: self.selectedPriceFilter,
                filterKey: self.filterKey,
                postCode: self.postCode,
                load: self.load,
                priceList: self.activeFilter,
                selectedMin: self.selectedMin,
                selectedMax: self.selectedMax,
                priceFilterFromStorage: self.priceFilterFromStorage,
                stats: self.stats,
                currentPage: self.currentPage,
                priceFilters: self.priceFilters
            };
            
            self.filterOptionsParameters = {
                selectedFilters: self.selectedFilters,
                postCode: self.postCode,
                load: self.load,
                filters: self.filters,
                currentPage: self.currentPage
            };

            self.postCodeFilterParameters = {
                postCode: self.postCode,
                load: self.load,
                sort: self.sort,
                invalidPostCode: self.invalidPostCode,
                sortDistance: ko.observable(self.sortFields().distance),
                heading: "You can move any car to a store near you.",
                subHeading: "Enter your postcode to get started."
            };

            self.loadSlider = function () {
                form.slider();
            };

            self.vehicleValuationModalParameter = {
                load: self.loadSlider,
                valuation_UID: self.valuation_UID,
                valuation: self.valuation,
                expiryDays: null
            };

            self.vehicleValuationPopupParameter = {
                load: self.loadSlider,
                valuation_UID: self.valuation_UID,
                valuation: self.valuation
            };

            self.vehicleListingParameters = {
                vehicleValuationPopupParameter: self.vehicleValuationPopupParameter,
                vehicles: self.vehicles
            };

            self.getPromoText = function () {
                $.ajax({
                    url: "/api/content/promotional",
                    cache: false,
                    type: "GET",
                    datatype: "json",
                    contenttype: "application/json;utf8"
                }).done(function (data) {
                    if (data) {
                        self.showPromoText(true);
                        data.forEach(function (promo, index) {
                            promo.id = index + 1;
                            promo.is_displayed = 0;
                        });
                        self.promoDetailsArray(data);
                        self.promoDetailsLength = data.length - 1;
                    }                    
                });
            };

            self.promoTextAdd = function () {

                self.promoDetail = {
                    promo_header: '',
                    promo_text: '',
                    promo_button: '',
                    promo_lightbox_header: '',
                    promo_lightbox_description: ''
                }; 

                if (self.promoDetailsArray()) {
                    var promoDetails = ko.unwrap(self.promoDetailsArray());
                    var promo = undefined;

                    for (var i = 0; i < promoDetails.length; i++) {
                        if (promoDetails[i].is_displayed === 0) {
                            promo = promoDetails[i];
                            break;
                        }
                    }

                    var index = promoDetails.indexOf(promo);

                    if (promo !== undefined && promo !== null && index !== -1) {

                        index !== self.promoDetailsLength ? promoDetails[index].is_displayed = 1 : updateIsDisplayed();

                        self.promoDetail = {
                            promo_header: promo.promo_header,
                            promo_text: promo.promo_text,
                            promo_button: promo.promo_button,
                            promo_lightbox_header: promo.promo_lightbox_header,
                            promo_lightbox_description: promo.promo_lightbox_description
                        };                        
                    }
                }                

                return self.promoDetail;
            };

            function updateIsDisplayed() {
                if (self.promoDetailsArray()) {
                    self.promoDetailsArray().forEach(function (promo) {
                        promo.is_displayed = 0;
                    });
                }                
            }

            function defaultResponseHandler(data) {

                var vehicles = data.vehicles;

                self.vehicles(vehicles);
                self.totalResults(data.totalResult);
                self.currentPage(0);
                self.showLoadMore(data.totalResult > data.vehicles.length);

                var filters = [];
                var priceFilters = {};

                Object.getOwnPropertyNames(data.filters).forEach(function (key) {

                    var obj = data.filters[key];

                    if (excludePriceFiltersByTerm.indexOf(obj.term) < 0) {
                        filters.push(obj);
                    } else {
                        priceFilters[obj.term] = obj;
                    }
                });

                self.isLoading(false);

                self.filters(filters);
                self.stats(data.stats);

                if (self.selectedPriceFilter() === undefined) {
                    self.priceFilters(priceFilters);
                }

                if (self.filterKey() === "monthlycost" && data.filters.monthlyPrice.values.length === 0) {
                    self.filterKey("price");
                }

                searchFilter.expand();
            }

            function setPriceFilterFromStorage() {
                var fromStorage = searchUtils.getSessionStorageValue(priceStorageKey, undefined);

                if (fromStorage !== undefined && fromStorage !== null) {

                    var parsedJson = JSON.parse(fromStorage);

                    if (parsedJson !== undefined && parsedJson !== null && parsedJson.query !== undefined) {

                        self.priceFilterFromStorage(parsedJson.query);
                    }
                }
            }

            function setDefaultSortOrder() {

                var defaultField = self.sortFields().monthlypaymentAsc;

                if (self.filterKey() === "price") {
                    defaultField = self.sortFields().priceAsc;
                }

                var savedSort = searchUtils.getSessionStorageValue(sortStorageKey, defaultField, true);
                
                self.sort(savedSort);
            }

            setDefaultSortOrder();
            setPriceFilterFromStorage();
            self.onLoadPreSelectedFilters();
            self.load({
                completeHandler: function() {
                    self.toggleFilter(self.filterKey());
                }
            });
        }

        return viewModel;
    });