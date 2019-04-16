define(["knockout", "knockoutvalidation", "bindingHandlers", "text!contactFormTemplate"],

    function (ko, kov, bindingHandlers, template) {
        function componentViewModel(initComponent, element) {

            var model = {};

            ko.components.register("contact-form",
                {
                    viewModel: model = function (params) {
                        var self = this,
                            $maxMessageLength = 250;

                        self.addExtraValidation = ko.observable(false);
                        self.appointmentValid = ko.observable(false);
                        self.clearContactForm = ko.observable(false);
                        self.enquiryShowErrors = ko.observable(false);
                        self.formSubmitted = ko.observable(true);
                        self.formValid = ko.observable(true);
                        self.locationUID = ko.observable(null);
                        self.previousMessage = ko.observable(null);
                        self.showMessage = ko.observable(true);
                        self.appointment = ko.observable(false);
                        self.messageLabel = ko.observable("Message");
                        self.messageMandatory = ko.observable(false);
                        self.privacyPolicyURL = ko.observable('');

                        //form initialise elements
                        self.enquiryType = ko.observable();
                        if (params !== undefined) {
                            if (params.options !== undefined) {
                                self.addExtraValidation = params.options.addExtraValidation || ko.observable(false);
                                self.appointmentValid = params.options.appointmentValid || ko.observable(true);
                                self.enquiryType(params.options.enquiryType);
                                self.enquiryShowErrors = params.options.enquiryShowErrors || ko.observable(false);
                                self.formSubmitted = params.options.formSubmitted || ko.observable(true);
                                self.formValid = params.options.formValid || ko.observable(true);
                                self.locationUID = params.options.locationUID || ko.observable(null);
                                self.showMessage = params.options.showMessage || ko.observable(true);
                                self.clearContactForm = params.options.clearContactForm || ko.observable(false);

                                if (params.options.appointment !== undefined) {
                                    self.appointment(params.options.appointment);
                                    self.reserveVehicleChecked = ko.observable(params.options.reserveVehicleChecked);
                                }

                                if (params.options.messageMandatory !== undefined) {
                                    self.messageMandatory(params.options.messageMandatory);
                                    if (self.messageMandatory()) {
                                        self.messageLabel(self.messageLabel() + " *");
                                    }
                                }
                            }
                        }

                        if (self.appointment()) {
                            self.reserveVehicleChecked = ko.observable(false);
                            if (params !== undefined) {
                                if (params.options !== undefined) {
                                    self.reserveVehicleChecked = params.options.reserveVehicleChecked || ko.observable(false);
                                }
                            }
                        }

                        self.acceptedTermsConditions = ko.observable(false).extend({ notEqual: { params: false, message: "Please accept the Privacy Policy." } });
                        self.isLoading = ko.observable(false);
                        self.firstname = ko.observable(null).extend({ required: true });
                        self.surname = ko.observable(null).extend({ required: true });
                        self.preferedContactMethod = ko.observable(null);
                        self.email = ko.observable(null).extend({
                            required: true, pattern: {
                                message: 'Invalid email.',
                                params: /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA -Z])*\.)+[a-zA-Z]{2,9})$/
                            }
                        });
                        self.telephone = ko.observable(null).extend({
                            required: true,
                            pattern: {
                                message: 'Invalid phone number.',
                                params: /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/
                            }
                        });

                        self.disableFirstname = ko.observable(false);
                        self.disableSurname = ko.observable(false);
                        self.disableEmail = ko.observable(false);
                        self.disableTelephone = ko.observable(false);


                        $.ajax({
                            url: "/api/content/GetPrivacyPolicyURL",
                            cache: false,
                            type: "GET",
                            datatype: "json",
                            async: false,
                            contenttype: "application/json;utf8",
                            success: function (data) {
                                self.privacyPolicyURL(data);
                            }
                        });

                        //if full form
                        if (self.enquiryType() !== undefined) {
                            self.enquiryItemTypes = ko.observable({});
                            self.selectedEnquiryItemType = ko.observable(undefined).extend({ required: true });
                            $maxMessageLength = 500;
                        }

                        self.message = ko.observable(null).extend({ required: self.messageMandatory(), maxLength: $maxMessageLength });

                        if (params !== undefined && params.options !== undefined) {
                            if (params.options.customer && params.options.customer.customer) {
                                var customerDetails = params.options.customer.customer;

                                self.firstname(customerDetails.FirstName);
                                self.surname(customerDetails.Surname);
                                self.preferedContactMethod(customerDetails.PreferedContactMethod);
                                self.email(customerDetails.Email);
                                self.telephone(customerDetails.Telephone);
                                self.message(customerDetails.Message);
                            }

                            if (params.options.readOnlyFields) {

                                if (params.options.readOnlyFields.firstName) {
                                    self.disableFirstname(true);
                                }

                                if (params.options.readOnlyFields.surName) {
                                    self.disableSurname(true);
                                }

                                if (params.options.readOnlyFields.email) {
                                    self.disableEmail(true);
                                }

                                if (params.options.readOnlyFields.telephone) {
                                    self.disableTelephone(true);
                                }
                            }
                        }

                        //functions
                        self.getEnquiryItemTypes = function () {
                            if (self.showFullForm()) {
                                var getUrl = "/api/Enquiry/GetEnquiryItemTypes/" + self.enquiryType();

                                $.ajax({
                                    url: getUrl,
                                    cache: false,
                                    type: "GET",
                                    dataType: "json",
                                    contentType: "application/json"
                                }).done(function (data) {
                                    self.enquiryItemTypes(data);
                                });
                            }
                        };

                        //computed
                        self.showFullForm = ko.computed(function () {
                            return self.enquiryType() !== undefined;
                        });

                        self.getEnquiryItemTypes();
                        self.errors = ko.validation.group(self);

                        if (params !== undefined && params.options !== undefined) {
                            self.isValid = params.options.isValid || ko.observable(self.errors().length === 0);
                        }

                        self.errors.subscribe(function () {
                            self.isValid(self.errors().length === 0);
                            self.formValid(self.isValid());
                            if (!self.isValid() && self.formSubmitted()) {
                                self.errors.showAllMessages(true);
                            }
                        });

                        self.showErrors = ko.computed(function () {
                            self.errors.showAllMessages(self.enquiryShowErrors());
                        });

                        self.updatePreviousMessage = ko.computed(function () {
                            if (self.showMessage()) {
                                self.message(self.previousMessage());
                                self.previousMessage(null);
                            } else {
                                self.previousMessage(self.message());
                                self.message(null);
                            }
                        });

                        self.clearContentFromContactForm = ko.computed(function () {
                            if (self.clearContactForm()) {
                                self.firstname(null);
                                self.surname(null);
                                self.email(null);
                                self.telephone(null);
                                self.message(null);
                                self.preferedContactMethod(null);
                                self.acceptedTermsConditions(false);

                                self.clearContactForm(false);
                            }
                        });
                    },
                    template: template
                });

            if (initComponent !== undefined && element !== undefined) {

                if (initComponent) {
                    ko.applyBindings(model, element);
                }
            }
        }

        return {
            register: componentViewModel
        };
    });