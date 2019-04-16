define(["knockout", "koMapping", "valuationutils"],
    function (ko, mapping, valuationutils) {
        function viewModel(self, params) {

            self.load = params.options.load;
            self.valuation_UID = params.options.valuation_UID;
            self.valuation = params.options.valuation;
            self.expiryDays = params.options.expiryDays;
            self.isValidRegistrationNumber = ko.observable(false);
            self.processingData = ko.observable(false);
            self.error = ko.observable(false);
            self.vehicleDetails = ko.observable({});
            self.valuationDetails = ko.observable(null);
            self.outstandingFinanceValue = ko.observable(0);
            self.enableContinueWithThisValuation = ko.observable(true);
            self.reset = ko.observable();
            self.dynamicContent = ko.observable();
            self.resetEmailForm = ko.observable();
            self.prePopulateVehicleDetails = ko.observable(null);
            self.featuresEnabled = ko.observable({
                "isValuationEnabled": true,
                "isPartExEnabled": true,
                "isBookingEnabled": true,
                "offered_Valuation": 3
            });
            var vehicle = {};
            vehicle.colour = null;
            vehicle.mechanicalSpend = 0;
            vehicle.cosmicSpend = 0;
            vehicle.keysPresnet = true;
            vehicle.v5Present = true;
            vehicle.vehicleDescription = "";
            vehicle.serviceHistory = "";
            vehicle.registrationNumber = "";
            vehicle.registrationDate = "";
            vehicle.previousOwners = 0;
            vehicle.nextMOTDate = "";
            vehicle.model = "";
            vehicle.mileage = "";
            vehicle.make = "";
            vehicle.range = "";
            vehicle.capCode = "";
            vehicle.capID = 0;
            vehicle.colourType = 2;

            self.vehicleDetails(mapping.fromJS(vehicle));

            self.initObservables = function (callback) {
                getFeatures(callback);
                initVehicleDetails();
                self.isValidRegistrationNumber(false);
                self.valuationDetails(null);
                self.outstandingFinanceValue(0);
                self.enableContinueWithThisValuation(true);
                self.error(false);
                self.processingData(false);

                self.reset(new Date());
            };

            function initVehicleDetails() {
                self.vehicleDetails().colour();
                self.vehicleDetails().mechanicalSpend(0);
                self.vehicleDetails().cosmicSpend(0);
                self.vehicleDetails().keysPresnet(true);
                self.vehicleDetails().v5Present(true);
                self.vehicleDetails().vehicleDescription("");
                self.vehicleDetails().serviceHistory("");
                self.vehicleDetails().registrationNumber("");
                self.vehicleDetails().registrationDate("");
                self.vehicleDetails().previousOwners(0);
                self.vehicleDetails().nextMOTDate("");
                self.vehicleDetails().model("");
                self.vehicleDetails().mileage("");
                self.vehicleDetails().make("");
                self.vehicleDetails().range("");
                self.vehicleDetails().capCode("");
                self.vehicleDetails().capID(0);
                self.vehicleDetails().colourType(2);
            }

            function ConvertKeysToLowerCase(obj) {
                var output = {};
                for (i in obj) {
                    if (Object.prototype.toString.apply(obj[i]) === '[object Object]') {
                        output[i.toLowerCase()] = ConvertKeysToLowerCase(obj[i]);
                    } else if (Object.prototype.toString.apply(obj[i]) === '[object Array]') {
                        output[i.toLowerCase()] = [];
                        output[i.toLowerCase()].push(ConvertKeysToLowerCase(obj[i][0]));
                    } else {
                        output[i.toLowerCase()] = obj[i];
                    }
                }
                return output;
            }

            self.PopulateDynamicContent = function () {

                $.ajax({
                    url: "/api/VehicleValuation/GetContent",
                    method: "GET",
                    cache: false,
                    datatype: "json",
                    contenttype: "application/json;utf8"
                }).done(function (data) {

                    data = ConvertKeysToLowerCase(data);
                    self.dynamicContent(data);
                    self.processingData(false);
                }).fail(function () {

                    self.error(true);
                });
            };

            self.dynamicData = function (key) {
                if (self.dynamicContent() && self.dynamicContent()[key]) {

                    return self.dynamicContent()[key].content;
                } else {
                    return "";
                }
            };

            self.updateFinance = function (returnFunction) {

                if (self.outstandingFinanceValue() != self.valuationDetails().outstandingFinance) {

                    self.processingData(true);

                    var updateRequest = {
                        Valuation_UID: self.valuationDetails().valuation_UID,
                        OutstandingFinance: self.outstandingFinanceValue()
                    };

                    $.ajax({
                        url: "/api/VehicleValuation/UpdateOutstandingFinance",
                        method: "POST",
                        data: JSON.stringify(updateRequest),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }).done(function (response) {
                        if (response) {

                            self.valuationDetails().outstandingFinance = self.outstandingFinanceValue();

                            self.valuation(self.valuationDetails().valuationValue - self.valuationDetails().outstandingFinance);

                            self.processingData(false);

                            if (typeof returnFunction == 'function') {
                                returnFunction();
                            }
                        }
                    }).fail(function () {

                        self.error(true);
                    });
                } else {

                    self.valuation(self.valuationDetails().valuationValue - self.valuationDetails().outstandingFinance);

                    if (typeof returnFunction == 'function') {
                        returnFunction();
                    }
                }

            };

            function getFeatures(callback) {
                $.ajax({
                    url: "/api/VehicleValuation/Features/",
                    method: "GET",
                    cache: false,
                    datatype: "json",
                    contenttype: "application/json;utf8"
                }).done(function (data) {
                    if (data) {
                        self.featuresEnabled(data);
                    }
                    if (typeof callback == 'function') {
                        callback();
                    }
                    }).fail(function () {

                        self.error(true);
                    });
            }

            self.getValuationDetails = function (valuation_UID, returnFunction) {

                self.processingData(true);

                if (valuation_UID) {

                    $.ajax({
                        url: "/api/VehicleValuation/GetValuation/" + valuation_UID,
                        method: "GET",
                        cache: false,
                        datatype: "json",
                        contenttype: "application/json;utf8"
                    }).done(function (valuation) {

                        self.valuationDetails(valuation);

                        self.valuation(self.valuationDetails().valuationValue - self.valuationDetails().outstandingFinance);
                        self.isValidRegistrationNumber(true);

                        if (typeof returnFunction == 'function') {
                            returnFunction();
                        }

                        self.processingData(false);

                    }).fail(function () {
                        self.onChangeClickToRegNo();
                        self.SetStepOne();
                    });
                }
            };

            self.outstandingFinanceValue.subscribe(function (outstandingFinanceValue) {

                function isEmptyOrSpaces(str) {
                    str = str.toString();
                    return str === null || str.match(/^ *$/) !== null;
                }

                if (!self.valuationDetails() || !self.valuationDetails().valuationValue || isEmptyOrSpaces(outstandingFinanceValue) || self.valuationDetails().valuationValue <= outstandingFinanceValue) {
                    self.enableContinueWithThisValuation(false);

                } else {

                    self.enableContinueWithThisValuation(true);
                }
            });

            self.onClickContinueWithValuation = function () {

                self.valuation_UID(self.valuationDetails().valuation_UID);

                self.updateFinance();

                valuationutils.setValuation_UID(self.valuationDetails().valuation_UID, self.valuationDetails().expiryTimeStamp);
            };



            self.onNewValuation = function (valuation) {

                self.initObservables(function(){

                    self.valuationDetails(valuation);
                    self.isValidRegistrationNumber(true);
                    if(self.valuationDetails().valuationValue <= 0) {

                    self.enableContinueWithThisValuation(false);

                } else {

                    self.enableContinueWithThisValuation(true);
                }
                });
            };

            self.onChangeClickToRegNo = function () {
                self.initObservables(function () {
                    self.valuation_UID("");
                    self.valuation(0);
                    self.prePopulateVehicleDetails(null);
                    valuationutils.deleteValuation_UID();
                });
            };

            self.onChangeClickToVehicleDetails = function () {
                if (self.valuationDetails()) {
                    var _valuation = self.valuationDetails();

                    self.initObservables(function () {
                        self.valuation(null);
                        self.isValidRegistrationNumber(true);
                        self.vehicleDetails().registrationNumber(_valuation.vehicleDetails.registrationNumber);
                        self.prePopulateVehicleDetails(_valuation);
                    });
                }
            };


            self.vehicleValuationModalRegnumberParameter = {
                load: self.load,
                registrationNumber: self.vehicleDetails().registrationNumber,
                reset: self.reset
             };

            self.vehicleValuationVehicleDetailsParameter = {
                load: self.load,
                vehicleDetails: self.vehicleDetails,
                onNewValuation: self.onNewValuation,
                dynamicData: self.dynamicData,
                isValidRegistrationNumber: self.isValidRegistrationNumber,
                onChangeClick: self.onChangeClickToRegNo,
                processingData: self.processingData,
                expiryDays: self.expiryDays,
                error: self.error,
                prePopulateVehicleDetails: self.prePopulateVehicleDetails,
                featuresEnabled: self.featuresEnabled
            };

            self.vehicleValuationDisplayValuationdetailsParameter = {
                load: self.load,
                valuationDetails: self.valuationDetails,
                onChangeClick: self.onChangeClickToVehicleDetails,
                outstandingFinanceValue: self.outstandingFinanceValue,
                dynamicData: self.dynamicData,
                reset: self.resetEmailForm,
                updateFinance: self.updateFinance,
                enableEmail: self.enableContinueWithThisValuation
            };
        }
        return viewModel;

    });