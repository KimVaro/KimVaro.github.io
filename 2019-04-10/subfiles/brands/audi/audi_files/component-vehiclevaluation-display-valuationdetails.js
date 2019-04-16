define(["knockout", "koMapping", "text!componentValuationDetailsTemplate", "knockoutvalidation"],
    function (ko, mapping, template) {
        function componentViewModel() {

            ko.components.register("vehiclevaluation-display-valuationdetails",
                {
                    viewModel: function (params) {

                        var errorMesageString = {
                            "firstName": "First Name Required!",
                            "lastName": "Last Name Required!",
                            "email": "Invalid Email Address!",
                            "emailRequired": "Email Address Required!"

                        };

                        var self = this;
                        self.load = params.options.load;
                        self.valuationDetails = params.options.valuationDetails;
                        self.onChangeClick = params.options.onChangeClick;
                        self.outstandingFinanceValue = params.options.outstandingFinanceValue;
                        self.tempOutstandingFinanceValue = ko.observable(self.outstandingFinanceValue());
                        self.dynamicData = params.options.dynamicData;
                        self.updateFinance = params.options.updateFinance;
                        self.reset = params.options.reset;
                        self.enableEmail = params.options.enableEmail;
                        self.invalidOutstandingFinanceValue = ko.observable("");
                        self.grade = ko.observable(null);
                        self.vehicleDetails = ko.observable({});
                        self.expiryDate = ko.observable();
                        self.termsAndConditions = ko.observable();
                        self.emailSendingMessage = ko.observable(false);
                        self.emailSent = ko.observable(false);
                        self.emailError = ko.observable(false);
                        self.showOutstandingFinance = ko.observable(false);
                        self.showEmailForm = ko.observable(false);
                        self.hasValue = ko.observable();

                        self.tempOutstandingFinanceValue.subscribe(function (tempOutstandingFinance) {

                            function isEmptyOrSpaces(str) {
                                str = str.toString();

                                return str === null || str.match(/^ *$/) !== null;
                            }

                            if (isEmptyOrSpaces(tempOutstandingFinance)) {
                                self.outstandingFinanceValue(0);
                            }
                            else {
                                self.outstandingFinanceValue(tempOutstandingFinance);
                            }
                        });

                        self.enableSaveValuation = ko.computed(function () {
                            return self.enableEmail() && self.valuationDetails() && self.valuationDetails().appointmentEnquiry_UID === null;
                        });

                        self.emailLabel = ko.computed(function () {
                            var result = "";
                            if (self.valuationDetails() && self.valuationDetails().expiryTimeStamp) {
                                var endDate = moment(self.valuationDetails().expiryTimeStamp);
                                result = self.dynamicData('valuation_email_label').replace("[DAYS]", endDate.diff(moment(), "days"));
                            }
                            return result;
                        });

                        self.firstName = ko.observable("").extend({
                            required: {
                                message: errorMesageString["firstName"],
                                params: true
                            }
                        });

                        self.lastName = ko.observable("").extend({
                            required: {
                                message: errorMesageString["lastName"],
                                params: true
                            }
                        });

                        self.valuationEmail = ko.observable("").extend({
                            required: {
                                message: errorMesageString["emailRequired"],
                                params: true
                            },
                            email: {
                                message: errorMesageString["email"],
                                params: true
                            }
                        });

                        self.reset.subscribe(function () {
                            self.valuationEmail('');
                            self.lastName('');
                            self.firstName('');
                            self.emailErrors.showAllMessages(false);

                        });

                        self.emailErrors = ko.validation.group(
                            [
                                self.valuationEmail,
                                self.lastName,
                                self.firstName
                            ]);

                        self.emailErrors.showAllMessages(false);

                        if (self.valuationDetails() && self.valuationDetails().valuationValue) {

                            self.hasValue(true);

                        } else {

                            self.hasValue(false);
                        }

                        if (self.valuationDetails() && self.valuationDetails().outstandingFinance) {

                            self.tempOutstandingFinanceValue(self.valuationDetails().outstandingFinance);
                        }

                        self.vehicleDetails(mapping.fromJS(self.valuationDetails().vehicleDetails));

                        if (self.valuationDetails().grade && self.valuationDetails().grade.grade) {

                            var shortDesc = "<span class='tooltip-trigger' data-tooltip='" +
                                self.valuationDetails().grade.shortDescription + "'>" +
                                self.valuationDetails().grade.name +
                                "</span > ";
                            self.grade(shortDesc);
                        }

                            self.termsAndConditions = self.dynamicData("terms_and_conditions");
                       

                        if (self.valuationDetails().expiryTimeStamp) {

                            self.expiryDate(moment(self.valuationDetails().expiryTimeStamp).format("DD/MM/YYYY"));

                        }

                        self.outstandingFinanceValue.subscribe(function (outstandingFinanceValue) {

                            if (self.valuationDetails() && self.valuationDetails().valuationValue) {
                              
                                if (self.valuationDetails().valuationValue <= outstandingFinanceValue) {

                                    self.invalidOutstandingFinanceValue(self.dynamicData("outstanding_finance_error_message"));

                                } else {

                                    self.invalidOutstandingFinanceValue("");
                                }
                            }
                        });

                        self.emailValuation = function () {

                            if (self.emailErrors().length > 0) {

                                self.emailErrors.showAllMessages();

                            } else {

                                var requestData = {
                                    firstName: self.firstName(),
                                    lastName: self.lastName(),
                                    email: self.valuationEmail(),
                                    valuation_UID: self.valuationDetails().valuation_UID,
                                };

                                sendEmail(requestData);
                            }
                        };

                        function sendEmail(request) {

                            self.emailSendingMessage(true);
                            self.emailSent(false);
                            self.emailError(false);
                            self.updateFinance(function () {

                                var data = {
                                    firstName: request.firstName,
                                    lastName: request.lastName,
                                    emailAddress: request.email,
                                    valuation_UID: request.valuation_UID,
                                };

                                var endpoint = "/api/VehicleValuation/EmailValuation";

                                $.ajax({
                                    url: endpoint,
                                    method: "POST",
                                    data: JSON.stringify(data),
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                }).done(function (response) {
                                    eval(response);
                                    self.emailSendingMessage(false);
                                    self.emailSent(true);
                                    setTimeout(function () {
                                        self.emailSent(false);
                                    }, 3000);

                                }).fail(function () {
                                    self.emailSendingMessage(false);
                                    self.emailError(true);
                                });
                            });
                        }
                      
                        self.vehicleValuationVehicleDetailsParameter = {
                            load: self.init,
                            vehicleDetails: self.vehicleDetails,
                            showAll: ko.observable(true),
                            onChangeClick: ko.observable(self.onChangeClick),
                            grade: self.grade
                        };
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });