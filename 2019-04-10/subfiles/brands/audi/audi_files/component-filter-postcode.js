define(["knockout", "searchUtils", "koMapping", "text!componentVehicleSearchPostcodeTemplate"],
    function (ko, searchUtils, mapping, template) {

        function componentViewModel() {
            ko.components.register("filter-postcode",
                {
                    viewModel: function (params) {

                        var self = this;
                        var postcodeInvalidMessage = "Postcode invalid";

                        self.domain = utilities.getDomain();
                        self.load = params.options.load;
                        self.sort = params.options.sort;
                        self.sortDistance = params.options.sortDistance;
                        self.postCode = params.options.postCode;
                        self.postCodeMandatory = params.options.postCodeMandatory || ko.observable(true);
                        self.heading = params.options.heading;
                        self.subHeading = params.options.subHeading;

                        self.invalidPostCode = params.options.invalidPostCode || ko.observable(false);
                        self.invalidPostCodeMessage = ko.observable(postcodeInvalidMessage);

                        self.onPostCodeSort = function () {

                            var postCode = self.postCode();

                            if (self.postCodeMandatory()) {
                                if (postCode.length === 0) {
                                    self.invalidPostCode(true);
                                    self.invalidPostCodeMessage("Please enter your postcode");
                                    return;
                                }
                            }

                            if (self.postCodeMandatory() || postCode.length > 0) {
                                if (!utilities.isPostcodeValid(postCode)) {
                                    self.invalidPostCode(true);
                                    self.invalidPostCodeMessage(postcodeInvalidMessage);
                                    return;
                                }
                            }

                            self.invalidPostCode(false);

                            if (self.sort && self.sortDistance) {
                                self.sort(self.sortDistance());
                            }

                            Cookies.set("userPostCode", postCode, { domain: self.domain, expires: utilities.getPostcodeExpiryDate() });

                            self.change();
                        };

                        self.onPostCodeSortByEnter = function (data, event) {
                            if (event.keyCode === 13) {
                                self.onPostCodeSort();
                                event.currentTarget.blur();
                            }
                        };

                        self.onPostCodeClear = function () {
                            self.invalidPostCode(false);
                            self.postCode("");
                            Cookies.set("userPostCode", "", { domain: self.domain, expires: utilities.getPostcodeExpiryDate() });
                        };

                        self.change = function () {
                            self.load();
                        };
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });