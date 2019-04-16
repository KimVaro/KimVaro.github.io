define(["knockout", "koMapping", "searchUtils", "text!componentVehicleSearchPriceFilterTemplate"],
    function (ko, mapping, searchUtils, template) {

        function componentViewModel() {
            ko.components.register("filter-price-options", {
                viewModel: function (params) {

                    var self = this;
                    var $url = $(".search-layout").data("url");
                    var priceStorageKey = searchUtils.storageLocationKeyPrefix() + "-selected-price";

                    self.priceFilters = params.options.priceFilters;
                    self.priceList = params.options.priceList;
                    self.buildFilters = params.options.buildFilters;
                    self.load = params.options.load;
                    self.postCode = params.options.postCode;
                    self.filterKey = params.options.filterKey;
                    self.selectedPriceFilter = params.options.selectedPriceFilter;
                    self.selectedMax = params.options.selectedMax;
                    self.selectedMin = params.options.selectedMin;
                    self.currentPage = params.options.currentPage;
                    self.disableMonthlyFilter = ko.observable(false);
                    self.disablePriceFilter = ko.observable(false);

                    self.min = ko.observableArray([]);
                    self.max = ko.observableArray([]);
                    self.stats = params.options.stats;
                    self.priceValues = ko.observableArray([]);

                    self.filterKey.subscribe(function(o) {
                        saveFilterState(o, false);
                    });


                    self.priceFilters.subscribe(function (o) {
                        self.disableMonthlyFilter(o.monthlycost.values.length === 0);
                        self.disablePriceFilter(o.price.values.length === 0);
                    });

                    self.priceList.subscribe(function (o) {
                        var priceList = o;
                        var values = [];

                        if (priceList !== null && priceList !== undefined) {
                            values = priceList.values;
                        }

                        self.priceValues(values);
                    });

                    self.loadMinValues = ko.computed(function () {
                        var filterValues = buildFilterDropDownValues("max", self.priceValues());
                        self.min(filterValues);

                        if (self.filterKey() === "monthlycost") {
                            var monthlyPayment = self.stats().monthlycost;
                            
                            if (monthlyPayment !== undefined && monthlyPayment !== null) {
                                var minimumMonthlyPayment = validNumber(monthlyPayment.max);
                                var monthlyPrices = self.min().filter(function(o) {
                                    return o.value < minimumMonthlyPayment;
                                });

                                self.min(monthlyPrices);
                            }
                        } else {
                            var totalPrice = self.stats().price;

                            if (totalPrice !== undefined && totalPrice !== null) {
                                var minimumTotalPrice = validNumber(totalPrice.max);

                                var totalPriceList = self.min().filter(function (o) {
                                    return o.value < minimumTotalPrice;
                                });

                                self.min(totalPriceList);
                            }
                        }

                        preSelectFilter(self.min(), "min", self.selectedMin);
                    });

                    self.loadMaxValues = ko.computed(function () {
                        var filterValues = buildFilterDropDownValues("min", self.priceValues());
                        self.max(filterValues);

                        if (self.filterKey() === "monthlycost") {

                            var monthlyPayment = self.stats().monthlycost;

                            if (monthlyPayment !== undefined && monthlyPayment !== null) {
                                var minimumMonthlyPayment = validNumber(monthlyPayment.min);
                                var monthlyPrices = self.max().filter(function (o) {
                                    return o.value >= minimumMonthlyPayment;
                                });

                                self.max(monthlyPrices);
                            }
                        } else {
                            var totalPrice = self.stats().price;

                            if (totalPrice !== undefined && totalPrice !== null) {
                                var minimumTotalPrice = validNumber(totalPrice.min);

                                var totalPriceList = self.max().filter(function (o) {
                                    return o.value >= minimumTotalPrice;
                                });

                                self.max(totalPriceList);
                            }
                        }

                        preSelectFilter(self.max(), "max", self.selectedMax);
                    });

                    self.onPricefilter = function () {
                        buildPriceQuery();
                    };

                    function validNumber(value) {

                        if (value !== undefined && value !== null && isNaN(value)) {
                            return 0;
                        }

                        return value;
                    }

                    function buildPriceQuery() {
                        var activeFilter = self.priceList();

                        var minPrice = self.selectedMin() === undefined ? "*" : self.selectedMin();
                        var maxPrice = self.selectedMax() === undefined ? "*" : self.selectedMax();

                        if (activeFilter === undefined || activeFilter === null) {
                            return;
                        }

                        if (self.selectedMin() === undefined && self.selectedMax() === undefined) {
                            searchUtils.removeSessionItem(priceStorageKey);
                            self.selectedPriceFilter(undefined);
                            self.load();

                            return;
                        }

                        var filterData = {
                            filters: []
                        };

                        if (activeFilter.term === "monthlycost") {
                            filterData = {
                                filters: [{
                                    value: "monthlycost:[" + minPrice + " TO " + maxPrice + "]",
                                    field: "monthlycost",
                                    parentValue: activeFilter.title
                                }]
                            };
                        } else if (activeFilter.term === "price") {
                            filterData = {
                                filters: [{
                                    value: activeFilter.term + ":[" + minPrice + " TO " + maxPrice + "]",
                                    field: activeFilter.term,
                                    parentValue: activeFilter.title
                                }]
                            };
                        }

                        if (filterData.filters.length > 0) {
                            self.selectedPriceFilter(filterData);
                            saveFilterState(activeFilter.term, true, self.selectedMin(), self.selectedMax());
                            self.currentPage(0);
                            self.load();
                        }
                    }

                    function saveFilterState(term, updateValues, min, max) {

                        var fromStorage = searchUtils.getSessionStorageValue(priceStorageKey);
                        var value = {};

                        if (fromStorage !== undefined) {
                            value = JSON.parse(fromStorage);
                        }

                        value["key"] = term;

                        if (updateValues !== undefined && updateValues) {
                            if (min !== undefined || max !== undefined) {
                                value[term] = {
                                    min: min,
                                    max: max
                                };

                                value["query"] = self.selectedPriceFilter();
                            }
                        }

                        searchUtils.setSessionStorage(priceStorageKey, JSON.stringify(value));
                    }
                    
                    function buildFilterDropDownValues(excludeMinOrMaxValue, filterValues) {
                        var values = filterValues.map(function (o) {
                            return o.value;
                        });

                        var value;
                        switch (excludeMinOrMaxValue) {
                            case "min":
                                {
                                    value = Math.min.apply(this, values);
                                    if (!isNaN(value)) {
                                        filterValues = filterValues.filter(function (o) {
                                            return o.value > value && removeFilter(self.selectedMin(), o, "max");
                                        });

                                        return filterValues;
                                    }
                                }
                                break;
                            case "max":
                                {
                                    value = Math.max.apply(this, values);
                                    if (!isNaN(value)) {
                                        filterValues = filterValues.filter(function (o) {
                                            return o.value <= value && removeFilter(self.selectedMax(), o, "min");
                                        });

                                        return filterValues;
                                    }
                                }
                                break;
                        }
                        return filterValues;
                    }

                    function removeFilter(selected, o, type) {

                        if (selected === undefined) {
                            return true;
                        }

                        var selectedValue = parseInt(selected);
                        var innerValue = parseInt(o.value);

                        var isSame = selectedValue === innerValue;

                        return type === "max" && selectedValue < innerValue && !isSame || type === "min" && selectedValue > innerValue && !isSame;

                    }

                    function setFilterKey() {
                        var fromStorage = searchUtils.getSessionStorageValue(priceStorageKey, undefined);

                        if (fromStorage !== undefined && fromStorage !== null) {

                            var parsedJson = JSON.parse(fromStorage);
                            self.filterKey(parsedJson.key);
                        }
                    }

                    function preSelectFilter(prices, key, item) {
                        var savedPrice = searchUtils.getSessionStorageValue(priceStorageKey, undefined);
                        if (savedPrice !== undefined) {

                            var parsedJson = JSON.parse(savedPrice);
                            var term = self.filterKey();
                            var price = parsedJson[term];

                            if (price !== undefined) {
                                prices.forEach(function (o) {
                                    if (parseInt(price[key]) === o.value) {
                                        item(o.value);
                                    }
                                });
                            }
                        }
                    }
                    
                    setFilterKey();

                },
                template: template
            });
        }

        return {
            register: componentViewModel
        };
    });