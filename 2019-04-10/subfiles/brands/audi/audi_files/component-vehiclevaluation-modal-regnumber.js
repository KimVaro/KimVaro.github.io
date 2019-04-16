define(["knockout", "koMapping", "knockoutvalidation", "text!componentValuationModalRegNumberTemplate"],
    function (ko, mapping, knockoutvalidation, template) {

        function componentViewModel() {
            ko.bindingHandlers.enterkey = {
                init: function (element, valueAccessor, allBindings, viewModel) {
                    var callback = valueAccessor();
                    $(element).on("keypress", function (event) {
                        var keyCode = event.which ? event.which : event.keyCode;
                        if (keyCode === 13) {
                            element.blur();
                            callback.call(viewModel);
                            return false;
                        }
                        return true;
                    });
                }
            };
            ko.components.register("vehiclevaluation-modal-regnumber",
                {
                    viewModel: function (params) {

                        var self = this;

                        self.registrationNumber = params.options.registrationNumber;
                        self.reset = params.options.reset;
                        self.validateNow = ko.observable(false);
 
                        self.registrationNumberInput = ko.observable().extend({
                            required: {
                                message: 'Required!',
                                params: true,
                                onlyIf: function () {
                                    return self.validateNow();
                                }
                            },
                            pattern: {
                                message: 'Invalid Reg Number!',
                                params: '^(?=.{1,8}$)[a-zA-Z0-9]+[ ]{0,1}[a-zA-Z0-9]+$',
                                onlyIf: function () {
                                    return self.validateNow();
                                }
                            }
                        });

                        self.reset.subscribe(function (v) {
                            self.registrationNumberInput("");
                            self.errors.showAllMessages(false);
                        });

                        self.errors = ko.validation.group(self.registrationNumberInput, { deep: true });

                        self.onClickFindRegNumber = function () {

                            self.validateNow(true);

                            self.errors.showAllMessages();
                            if (self.registrationNumberInput.isValid()) {
                                self.registrationNumber("");
                                setTimeout(function () {

                                    self.registrationNumber(self.registrationNumberInput());
                                    self.registrationNumberInput("");

                                    self.errors.showAllMessages(false);
                                }, 100);
                                
                            }
                        };
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });