define(["knockout", "koMapping", "valuationutils", "text!valuationPopupTemplate"],
    function (ko, mapping, valuationutils, template) {

        function componentViewModel() {
            ko.components.register("vehiclevaluation-popup",
                {
                    viewModel: function (params) {

                        var self = this;

                        self.load = params.options.load;
                        self.valuation_UID = params.options.valuation_UID;
                        self.valuation = params.options.valuation;

                        self.error = ko.observable(false);
                        self.processingData = ko.observable(false);
                        self.partalValuationDetail = ko.observable(null);
                        self.description = ko.observable("");
                        self.registrationNumber = ko.observable("");
                        self.partalValuationDetail = ko.observable("");
                        self.partExEnabled = ko.observable(true);
                        processValuation(self.valuation_UID());

                        $.ajax({
                            url: "/api/VehicleValuation/Features/" ,
                            method: "GET",
                            cache: false,
                            datatype: "json",
                            contenttype: "application/json;utf8"
                        }).done(function (data) {
                            if (data) {
                                self.partExEnabled(data.isPartExEnabled);
                            }
                            });

                        self.valuation.subscribe(function (valuation) {

                            if (self.valuation_UID()) {
                                processValuation(self.valuation_UID());
                            }
                        });

                        function processValuation(valuation_UID) {

                            if (valuation_UID) {

                                self.processingData(true);

                                $.ajax({
                                    url: "/api/VehicleValuation/GetPartialValuationAsync/" + valuation_UID,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (vehicle) {

                                    if (vehicle) {

                                        self.description(vehicle.make + " " + vehicle.model);

                                        self.valuation(vehicle.valuationValue - vehicle.outstandingFinance);

                                        self.registrationNumber(vehicle.registrationNumber);
                                    }
                                    self.processingData(false);
                                }).fail(function (msg) {
                                    self.removeValuation();
                                    self.processingData(false);
                                });
                            }
                        }

                        var valuationCookie = Cookies.get("__valuation");

                        if (valuationCookie) {
                            self.valuation_UID(valuationCookie);
                            processValuation(valuationCookie);
                        }

                        self.removeValuation = function () {
                            self.valuation_UID("");
                            self.valuation(0);

                            valuationutils.deleteValuation_UID();
                        };
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });