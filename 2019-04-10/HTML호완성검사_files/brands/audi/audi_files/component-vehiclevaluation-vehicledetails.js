define(["knockout", "koMapping", "vehicleValuationDisplayVehicleDetails", "knockoutvalidation", "text!valuationVehicleDetailsTemplate"],
    function (ko, mapping, vehicleValuationDisplayVehicleDetails, knockoutvalidation, template) {

        function componentViewModel() {

            vehicleValuationDisplayVehicleDetails.register();

            ko.components.register("vehiclevaluation-vehicledetails",
                {
                    viewModel: function (params) {

                        var errorMesageString = {
                            "mileage": "Invalid Mileage!",
                            "serviceHistory": "Invalid Service History!",
                            "nextMOTDate": "Invalid MOT Date!",
                            "colour": "Invalid Colour!",
                            "previousOwners": "Invalid Previous Owners",
                            "selectedMake": "Invalid Make",
                            "selectedModel": "Invalid Model",
                            "selectedYearOrReg": "Invalid Year or Reg",
                            "selectedVariant": "Invalid Variant",
                            "selectedDerivative": "Invalid Derivative",
                            "selectedDateofRegistration": "Invalid Date of Registration"

                        };

                        var self = this;

                        self.load = params.options.load;
                        self.vehicleDetails = params.options.vehicleDetails;
                        self.onNewValuation = params.options.onNewValuation;
                        self.isValidRegistrationNumber = params.options.isValidRegistrationNumber;
                        self.onChangeClick = params.options.onChangeClick;
                        self.processingData = params.options.processingData;
                        self.expiryDays = params.options.expiryDays;
                        self.error = params.options.error;
                        self.dynamicData = params.options.dynamicData;
                        self.prePopulateVehicleDetails = params.options.prePopulateVehicleDetails;
                        self.featuresEnabled = params.options.featuresEnabled;
                        self.previousOwnersData = ko.observable();
                        self.makes = ko.observable();
                        self.models = ko.observable();
                        self.yearOrReg = ko.observable();
                        self.variants = ko.observable();
                        self.derivatives = ko.observable();
                        self.dateofRegistrations = ko.observable();
                        self.previousOwnersIndex = ko.observable(0);
                        self.selectedMake = ko.observable();
                        self.selectedModel = ko.observable();
                        self.selectedYearOrReg = ko.observable();
                        self.selectedVariant = ko.observable();
                        self.selectedDerivative = ko.observable();
                        self.selectedDateofRegistration = ko.observable();
                        self.gradeData = ko.observable([]);
                        self.gradeSliderData = ko.observable();
                        self.processingVehicleData = ko.observable(false);
                        self.manualVehicleDetailFound = ko.observable(true);
                        self.vehicleDetails().previousOwners(self.previousOwnersIndex());
                        self.gradeSliderLongDesc = ko.observable();
                        self.vehicleDetails().mileage.extend({
                            required: {
                                message: errorMesageString["mileage"],
                                params: true
                            },
                            number: {
                                message: errorMesageString["mileage"],
                                params: true
                            },
                            min: {
                                message: errorMesageString["mileage"],
                                params: 1
                            },
                            max: {
                                message: errorMesageString["mileage"],
                                params: 999999
                            }
                        });

                        self.vehicleDetails().serviceHistory.extend({
                            required: {
                                message: errorMesageString["serviceHistory"],
                                params: true
                            }
                        });

                        self.vehicleDetails().colour.extend({
                            required: {
                                message: errorMesageString["colour"],
                                params: true
                            },
                        });

                        self.vehicleDetails().nextMOTDate.extend({
                            required: {
                                message: errorMesageString["nextMOTDate"],
                                params: true
                            }
                        });
                        self.selectedMake.extend({
                            required: {
                                message: errorMesageString["selectedMake"],
                                params: true
                            }
                        });
                        self.selectedModel.extend({
                            required: {
                                message: errorMesageString["selectedModel"],
                                params: true
                            }
                        });
                        self.selectedYearOrReg.extend({
                            required: {
                                message: errorMesageString["selectedYearOrReg"],
                                params: true
                            }
                        });
                        self.selectedVariant.extend({
                            required: {
                                message: errorMesageString["selectedVariant"],
                                params: true
                            }
                        });
                        self.selectedDerivative.extend({
                            required: {
                                message: errorMesageString["selectedDerivative"],
                                params: true
                            }
                        });
                        self.selectedDateofRegistration.extend({
                            required: {
                                message: errorMesageString["selectedDateofRegistration"],
                                params: true
                            }
                        });
                        self.colours = ko.observable();
                        self.serviceHistories = ko.observable();
                        self.gradeIndex = ko.observable();

                        initComponent();

                        if (self.vehicleDetails().registrationNumber()) {
                            if (self.prePopulateVehicleDetails()) {
                                doPrepopulate();
                            } else {
                                processRegNumber(self.vehicleDetails().registrationNumber());
                                self.previousOwnersData({ data: ["0", "1", "2", "3", "4", "5", "6+"], selectedIndex: 0 });
                            }
                        }

                        self.previousOwnersIndex.subscribe(function (index) {
                            self.vehicleDetails().previousOwners(index);
                        });

                        self.gradeIndex.subscribe(function (index) {

                            self.gradeSliderLongDesc(self.gradeData()[index].longDescription);

                        });

                        function doPrepopulate() {
                            GetValuationDropDownData();

                            var _previousOwners = self.prePopulateVehicleDetails().vehicleDetails.previousOwners;
                            var _milage = self.prePopulateVehicleDetails().vehicleDetails.mileage;

                            self.vehicleDetails().vehicleDescription(self.prePopulateVehicleDetails().vehicleDetails.vehicleDescription);
                            self.vehicleDetails().colour(self.prePopulateVehicleDetails().vehicleDetails.colour);
                            self.vehicleDetails().registrationDate(moment(self.prePopulateVehicleDetails().vehicleDetails.registrationDate).format("DD/MM/YYYY"));
                            self.vehicleDetails().nextMOTDate(moment(self.prePopulateVehicleDetails().vehicleDetails.nextMOTDate).format("DD/MM/YYYY"));
                            self.vehicleDetails().model(self.prePopulateVehicleDetails().vehicleDetails.model);
                            self.vehicleDetails().make(self.prePopulateVehicleDetails().vehicleDetails.make);
                            self.vehicleDetails().capCode(self.prePopulateVehicleDetails().vehicleDetails.capCode);
                            self.vehicleDetails().colourType(self.prePopulateVehicleDetails().vehicleDetails.colourType);
                            self.vehicleDetails().range(self.prePopulateVehicleDetails().vehicleDetails.range);
                            self.vehicleDetails().serviceHistory(self.prePopulateVehicleDetails().vehicleDetails.serviceHistory);
                            self.vehicleDetails().mileage(_milage);
                            self.vehicleDetails().previousOwners(_previousOwners);
                            self.previousOwnersIndex(_previousOwners);
                            self.previousOwnersData({ data: ["0", "1", "2", "3", "4", "5", "6+"], selectedIndex: self.previousOwnersIndex() });

                            self.vehicleErrors = ko.validation.group(
                                [
                                    self.vehicleDetails().nextMOTDate,
                                    self.vehicleDetails().colour,
                                    self.vehicleDetails().serviceHistory,
                                    self.vehicleDetails().mileage
                                ]);

                            self.vehicleErrors.showAllMessages(false);
                        }

                        function initComponent() {

                            self.makes([]);
                            self.models([]);
                            self.yearOrReg([]);
                            self.variants([]);
                            self.derivatives([]);
                            self.dateofRegistrations([]);

                            self.colours([]);
                            self.serviceHistories([]);
                            self.gradeIndex(0);
                            setGrade();
                        }

                        function setGrade() {
                            if (self.featuresEnabled().offered_Valuation == 3) {
                                $.ajax({
                                    url: "/api/VehicleValuation/GetGrade",
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (gradeData) {

                                    self.gradeData(gradeData.grades);

                                    var defaultGradeIndex = 0;
                                    var grades = [];
                                    for (var gradeIndex in gradeData.grades) {

                                        var gradeItem = [];
                                        gradeItem[0] = gradeData.grades[gradeIndex].name;
                                        gradeItem[1] = gradeData.grades[gradeIndex].shortDescription;
                                        grades[gradeIndex] = gradeItem;

                                        if (self.prePopulateVehicleDetails() && self.prePopulateVehicleDetails().grade) {
                                            if (gradeData.grades[gradeIndex].grade == self.prePopulateVehicleDetails().grade.grade) {
                                                defaultGradeIndex = gradeIndex;
                                            }
                                        } else {
                                            if (gradeData.grades[gradeIndex].grade == gradeData.defaultGrade) {
                                                defaultGradeIndex = gradeIndex;
                                            }
                                        }
                                    }

                                    self.gradeIndex(defaultGradeIndex);

                                    self.gradeSliderData({ data: grades, selectedIndex: self.gradeIndex() });

                                    self.gradeSliderLongDesc(self.gradeData()[self.gradeIndex()].longDescription);


                                }).fail(function () {

                                    self.error(true);
                                });
                            }
                        }

                        self.onClickConfirmVehicleDetails = function () {


                            if (self.vehicleErrors().length > 0) {

                                self.vehicleErrors.showAllMessages();

                            } else {
                                var valuationResponse = {};

                                self.processingData(true);

                                if (self.featuresEnabled().offered_Valuation == 3) {
                                    valuationResponse.grade = parseInt(self.gradeData()[self.gradeIndex()].grade);
                                }
                                valuationResponse.outstandingFinance = 0;
                                valuationResponse.expiresInDays = self.expiryDays;
                                valuationResponse.VehicleDetais = mapping.toJS(self.vehicleDetails());
                                valuationResponse.VehicleDetais.nextMOTDate = moment(valuationResponse.VehicleDetais.nextMOTDate, "DD/MM/YYYY").format();
                                valuationResponse.VehicleDetais.registrationDate = moment(valuationResponse.VehicleDetais.registrationDate, "DD/MM/YYYY").format();

                                $.ajax({
                                    url: "/api/VehicleValuation/Valuation",
                                    method: "POST",
                                    data: JSON.stringify(valuationResponse),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }).done(function (valuation) {

                                    if (valuation) {

                                        self.onNewValuation(valuation);
                                        self.processingData(false);
                                    }

                                }).fail(function () {
                                    self.error(true);
                                });
                            }
                        };

                        function processRegNumber(regnumber) {

                            self.processingData(true);

                            if (regnumber) {
                                $.ajax({
                                    url: "/api/VehicleValuation/VehicleDetails/" + regnumber,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (vehicleDetails) {
                                    if (vehicleDetails && self.prePopulateVehicleDetails() == null) {

                                        if (vehicleDetails.vehicleDescription) {
                                            self.vehicleDetails().vehicleDescription(vehicleDetails.vehicleDescription);
                                        }

                                        self.vehicleDetails().colour("");

                                        if (vehicleDetails.colour) {

                                            var colour = parseInt(vehicleDetails.colour);
                                            if (typeof colour == 'number' && colour > 0) {

                                                self.vehicleDetails().colour(colour);
                                            }                                          
                                        } 

                                        if (vehicleDetails.registrationDate) {
                                            self.vehicleDetails().registrationDate(moment(vehicleDetails.registrationDate).format("DD/MM/YYYY"));
                                        }

                                        if (vehicleDetails.nextMOTDate) {
                                            self.vehicleDetails().nextMOTDate(moment(vehicleDetails.nextMOTDate).format("DD/MM/YYYY"));
                                        }

                                        if (vehicleDetails.model) {
                                            self.vehicleDetails().model(vehicleDetails.model);
                                        }

                                        if (vehicleDetails.make) {
                                            self.vehicleDetails().make(vehicleDetails.make);
                                        }

                                        if (vehicleDetails.capCode) {
                                            self.vehicleDetails().capCode(vehicleDetails.capCode);
                                        }

                                        if (vehicleDetails.colourType) {
                                            self.vehicleDetails().colourType(vehicleDetails.colourType);
                                        }

                                        if (vehicleDetails.range) {
                                            self.vehicleDetails().range(vehicleDetails.range);
                                        }

                                        self.vehicleErrors = ko.validation.group(
                                            [
                                                self.vehicleDetails().nextMOTDate,
                                                self.vehicleDetails().colour,
                                                self.vehicleDetails().serviceHistory,
                                                self.vehicleDetails().mileage
                                            ]);

                                        self.vehicleErrors.showAllMessages(false);

                                        self.isValidRegistrationNumber(true);
                                    } else {

                                        ManualVehicleSelection();
                                        self.isValidRegistrationNumber(false);
                                    }
                                    self.processingData(false);
                                    GetValuationDropDownData();

                                }).fail(function (data) {
                                    self.isValidRegistrationNumber(false);

                                    if (data.status === 404) {
                                        ManualVehicleSelection();
                                        GetValuationDropDownData();
                                        self.processingData(false);
                                    } else {
                                        self.error(true);
                                    }

                                });
                            }
                        }

                        function GetValuationDropDownData() {

                            $.ajax({
                                url: "/api/VehicleValuation/GetColour/" + self.vehicleDetails().colourType(),
                                method: "GET",
                                cache: false,
                                datatype: "json",
                                contenttype: "application/json;utf8"
                            }).done(function (data) {

                                self.colours(data);

                                if (self.prePopulateVehicleDetails()) {
                                    self.vehicleDetails().colour(self.prePopulateVehicleDetails().vehicleDetails.colour);

                                }

                            }).fail(function () {

                                self.error(true);
                            });

                            $.ajax({
                                url: "/api/VehicleValuation/GetServiceHistory/",
                                method: "GET",
                                cache: false,
                                datatype: "json",
                                contenttype: "application/json;utf8"
                            }).done(function (data) {

                                self.serviceHistories(data);

                            }).fail(function () {

                                self.error(true);
                            });
                        }

                        function ManualVehicleSelection() {

                            self.vehicleDetails().colour("");
                            self.vehicleDetails().nextMOTDate("");

                            self.isValidRegistrationNumber(false);

                            self.VehicleDropDownErrors = ko.validation.group([
                                self.selectedDateofRegistration,
                                self.selectedDerivative,
                                self.selectedVariant,
                                self.selectedYearOrReg,
                                self.selectedModel,
                                self.selectedMake
                            ]);

                            self.vehicleErrors = ko.validation.group(
                                [
                                    self.selectedDateofRegistration,
                                    self.selectedDerivative,
                                    self.selectedVariant,
                                    self.selectedYearOrReg,
                                    self.selectedModel,
                                    self.selectedMake,
                                    self.vehicleDetails().nextMOTDate,
                                    self.vehicleDetails().colour,
                                    self.vehicleDetails().serviceHistory,
                                    self.vehicleDetails().mileage
                                ]);

                            self.vehicleErrors.showAllMessages(false);

                            self.processingVehicleData(true);

                            $.ajax({
                                url: "/api/VehicleValuation/makes",
                                method: "GET",
                                cache: false,
                                datatype: "json",
                                contenttype: "application/json;utf8"
                            }).done(function (data) {
                                if (data) {

                                    self.makes(data);
                                }

                                self.processingVehicleData(false);

                            }).fail(function () {

                                self.error(true);
                            });


                        }

                        self.selectedDateofRegistration.subscribe(function (dateofRegistration) {

                            if (dateofRegistration) {
                                var _selectedMake = GetCAPData(self.makes(), self.selectedMake());
                                var _selectedModel = GetCAPData(self.models(), self.selectedModel());
                                var _selectedCAPCode = GetCAPData(self.derivatives(), self.selectedDerivative());
                                var _selectedRange = GetCAPData(self.variants(), self.selectedVariant());
                                var _registerationDate = moment(dateofRegistration, "MMMM YYYY").format("DD/MM/YYYY");

                                self.vehicleDetails().model(_selectedModel.key);
                                self.vehicleDetails().make(_selectedMake.key);
                                self.vehicleDetails().capCode(_selectedCAPCode.value);
                                self.vehicleDetails().range(_selectedRange.key);
                                self.vehicleDetails().registrationDate(_registerationDate);
                                self.vehicleDetails().vehicleDescription(_selectedMake.key + " " + _selectedModel.key);
                            } else {
                                resetCAPObservable("");
                            }
                        });

                        self.selectedDerivative.subscribe(function (SequenceNumber) {

                            if (SequenceNumber && self.selectedYearOrReg()) {

                                self.processingVehicleData(true);

                                var key = self.selectedYearOrReg().split(",")[0];

                                $.ajax({
                                    url: "/api/VehicleValuation/DateOfRegistrations/" + key,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (data) {
                                    if (data && data.length > 0) {

                                        self.dateofRegistrations(data);
                                        self.manualVehicleDetailFound(true);
                                    } else {
                                        self.dateofRegistrations([]);
                                        self.manualVehicleDetailFound(false);
                                    }
                                    resetCAPObservable("derivatives");

                                }).fail(function () {

                                    self.error(true);
                                });
                            } else {
                                self.dateofRegistrations([]);
                                resetCAPObservable("derivatives");
                            }
                        });

                        self.selectedVariant.subscribe(function (trimCode) {

                            if (trimCode) {

                                self.processingVehicleData(true);

                                $.ajax({
                                    url: "/api/VehicleValuation/DerivativesWithYears/" + trimCode,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (data) {
                                    if (data && data.length > 0) {

                                        self.derivatives(data);
                                        self.manualVehicleDetailFound(true);
                                    } else {
                                        self.derivatives([]);
                                        self.manualVehicleDetailFound(false);
                                    }

                                    resetCAPObservable("variants");

                                }).fail(function () {

                                    self.error(true);
                                });

                            } else {
                                self.derivatives([]);
                                resetCAPObservable("variants");
                            }
                        });

                        self.selectedYearOrReg.subscribe(function (fromYearAndRangeCode) {
                            if (fromYearAndRangeCode) {

                                self.processingVehicleData(true);

                                var key = fromYearAndRangeCode.split(",");
                                var year = key[1];
                                $.ajax({
                                    url: "/api/VehicleValuation/Variants/" + self.selectedModel() + "/" + year,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (data) {
                                    if (data && data.length > 0) {

                                        self.variants(data);
                                        self.manualVehicleDetailFound(true);
                                    } else {
                                        self.variants([]);
                                        self.manualVehicleDetailFound(false);
                                    }

                                    resetCAPObservable("yearOrReg");
                                }).fail(function () {

                                    self.error(true);
                                });
                            } else {
                                self.variants([]);
                                resetCAPObservable("yearOrReg");
                            }
                        });

                        self.selectedModel.subscribe(function (rangeCode) {
                            if (rangeCode) {

                                self.processingVehicleData(true);

                                $.ajax({
                                    url: "/api/VehicleValuation/ModelYears/" + rangeCode,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (data) {
                                    if (data && data.length > 0) {

                                        self.yearOrReg(data);
                                        self.manualVehicleDetailFound(true);
                                    } else {
                                        self.yearOrReg([]);
                                        self.manualVehicleDetailFound(false);
                                    }

                                    resetCAPObservable("model");
                                }).fail(function () {

                                    self.error(true);
                                });
                            } else {
                                self.yearOrReg([]);
                                resetCAPObservable("model");
                            }
                        });

                        self.selectedMake.subscribe(function (manufacturerCode) {

                            if (manufacturerCode) {

                                self.processingVehicleData(true);

                                $.ajax({
                                    url: "/api/VehicleValuation/models/" + manufacturerCode,
                                    method: "GET",
                                    cache: false,
                                    datatype: "json",
                                    contenttype: "application/json;utf8"
                                }).done(function (data) {
                                    if (data && data.length > 0) {

                                        self.models(data);
                                        self.manualVehicleDetailFound(true);
                                    } else {
                                        self.models([]);
                                        self.manualVehicleDetailFound(false);
                                    }

                                    resetCAPObservable("make");

                                }).fail(function () {

                                    self.error(true);
                                });
                            } else {
                                self.models([]);
                                resetCAPObservable("make");
                            }
                        });

                        function resetCAPObservable(currentObservable) {
                            switch (currentObservable) {
                                case "make":
                                    self.selectedModel();
                                    self.selectedYearOrReg();
                                    self.yearOrReg([]);
                                case "model":
                                    self.selectedYearOrReg();
                                    self.selectedVariant();
                                    self.variants([]);
                                case "yearOrReg":
                                    self.selectedVariant();
                                    self.selectedDerivative();
                                    self.derivatives([]);
                                case "variants":
                                    self.selectedDerivative();
                                    self.selectedDateofRegistration();
                                    self.dateofRegistrations([]);
                            }
                            self.processingVehicleData(false);
                            self.VehicleDropDownErrors.showAllMessages(false);

                        }

                        function GetCAPData(data, value) {

                            var result;
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].value == value) {
                                    result = data[i];
                                    break;
                                }
                            }
                            return result;
                        }

                        self.vehicleValuationDisplayVehicleDetailsParameters = {
                            load: self.init,
                            vehicleDetails: self.vehicleDetails,
                            showAll: ko.observable(false),
                            onChangeClick: ko.observable(self.onChangeClick)
                        };

                        self.load();

                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });