define(["knockout", "contactForm"],
    function (ko, contactForm) {
        function paymentDetailsViewModel() {
            contactForm.register();

            var self = this;
            self.formSubmitted = ko.observable(false);
            self.formValid = ko.observable(false);
            self.enquiryShowErrors = ko.observable(false);
            self.showLoader = ko.observable(false);
            self.disableSendPaymentButton = ko.observable(false);

            self.submit = function (data, event) {
                self.formSubmitted(true);
                if (self.formValid()) {
                    self.enquiryShowErrors(false);
                    self.showLoader(true);
                    self.disableSendPaymentButton(true);
                    $(event.currentTarget).closest('form').submit();
                } else {
                    self.enquiryShowErrors(true);
                    self.formSubmitted(false);
                }
            };
        }

        ko.applyBindings(new paymentDetailsViewModel(), document.getElementById('payment-details'));
    });