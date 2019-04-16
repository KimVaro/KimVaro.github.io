var nearestStore = function () {
    var nearestStoreViewModel = function () {
        var self = this;

        self.closingTime = ko.observable("");
        self.dealer = ko.observable("");
        self.dealerError = ko.observable(false);
        self.dealerName = ko.observable(null);
        self.domain = GlobalUtilities.getDomain();
        self.getNearestDealerBaseRequestURL = "https://shop.carstore.com/api/DealerSearch/GetNearestDealer";
        self.getNearestDealerClosingTimeBaseRequestURL = "https://shop.carstore.com/api/Dealer";
        self.invalidPostcode = ko.observable(false);
        self.invalidPostcodeMessage = ko.observable("");
        self.openingTimesError = ko.observable(false);
        self.postcode = ko.observable(Cookies.get("userPostCode"));
        self.showDealerDetails = ko.observable(!self.postcode() && self.postcode() !== undefined && self.postcode() !== null && self.postcode().length > 0);
        self.url = ko.observable(null);

        self.getNearestDealer = function () {
            var nearestDealerUrl = self.getNearestDealerBaseRequestURL,
                dealerSearchPage = "https://www.carstore.com/near-me/";

            if (self.postcode() && self.postcode() !== "") {
                nearestDealerUrl = nearestDealerUrl + '/' + self.postcode();
                $.ajax({
                    url: nearestDealerUrl,
                    cache: false,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json"
                }).done(function (data) {
                    if (data) {
                        self.dealerError(false);
                        self.dealerName(data.name.replace('Car Store', '').trim());
                        self.url(dealerSearchPage + self.dealerName().toLowerCase().replace('car store', '').trim().replace(/\s+/g, '-'));

                        self.dealer(data);
                        self.getDealerClosingTime();
                    }
                }).fail(function () {
                    self.dealerError(true);
                    self.dealerName("Find a Store");
                    self.url(dealerSearchPage);
                });
            }
        };

        self.getDealerClosingTime = function () {
            var nearestDealerClosingTimeUrl = self.getNearestDealerClosingTimeBaseRequestURL;

            if (self.postcode() && self.postcode() !== "") {
                nearestDealerClosingTimeUrl = nearestDealerClosingTimeUrl + "/" + self.dealer().dealer_UID + "/" + self.dealer().postcode;
                $.ajax({
                    url: nearestDealerClosingTimeUrl,
                    cache: false,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json"
                }).done(function (data) {
                    self.openingTimesError(false);

                    var date = new Date();
                    var day = date.getDay();

                    $.each(data.departmentOpeningTimes, function (index, element) {
                        if (element.name === 'Main') {
                            var openingTimes = element.openingTimes;
                            $.each(openingTimes, function (index, element) {
                                if (element.dayOfWeek === day) {
                                    var hour = Number(element.closingHours.substring(0, 2));
                                    var minutes = element.closingHours.substring(3, 5) === 0 ? '' : ':' + element.closingHours.substring(3, 5);
                                    var time = hour > 12 ? hour - 12 + minutes + "pm" : hour === 0 ? "midnight" : hour + minutes + "am";
                                    self.closingTime(time);
                                }
                            });
                        }
                    });
                }).fail(function () {
                    self.openingTimesError(true);
                });
            }
        };

        self.toggleSearch = function () {
            self.showDealerDetails(!self.showDealerDetails());
        };

        self.nearestDealerPostCodeSearch = function () {
            if (self.postcode() && self.postcode().length > 0) {
                self.toggleSearch();

                if (GlobalUtilities.isPostcodeValid(self.postcode())) {
                    self.invalidPostcode(false);
                    self.invalidPostcodeMessage("");

                    var postcode = self.postcode().replace(/\s/g, "").toUpperCase();
                    self.postcode(postcode);
                    Cookies.set("userPostCode", postcode, { domain: self.domain, expires: GlobalUtilities.getPostcodeExpiryDate() });

                    self.getNearestDealer();
                }
                else {
                    self.invalidPostcode(true);
                    self.invalidPostcodeMessage("Please enter a valid postcode");
                }
            }
            else {
                self.invalidPostcode(true);
                self.invalidPostcodeMessage("Please enter a postcode");
            }
        };

        self.dealerPostcodeSearchByEnter = function (data, event) {
            if (event.keyCode === 13) {
                self.nearestDealerPostCodeSearch();
            }
        };
    };

    var nearestStoreElement = $('.nearest-store')[0];
    if (nearestStoreElement !== undefined && nearestStoreElement !== null) {
        ko.applyBindings(new nearestStoreViewModel(), nearestStoreElement);
    }

    return {
        nearestStoreViewModel: nearestStoreViewModel
    };
}();