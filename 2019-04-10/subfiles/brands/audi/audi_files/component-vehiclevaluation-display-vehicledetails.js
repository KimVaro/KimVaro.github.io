define(["knockout", "koMapping", "text!componentValuationVehicleDetailsTemplate"],
    function (ko, mapping, template) {

        function componentViewModel() {
            ko.components.register("vehiclevaluation-display-vehicledetails",
                {
                    viewModel: function (params) {
                        var self = this;

                        self.load = params.options.load;
                        self.vehicleDetails = params.options.vehicleDetails;
                        self.showAdvancedVehicleDetail = params.options.showAll;
                        self.onChangeClick = params.options.onChangeClick;
                        self.grade = params.options.grade;
                        self.priceDetails = params.options.priceDetails;
                        self.nextMOTDate = ko.observable();


                        if (self.showAdvancedVehicleDetail()) {

                            self.nextMOTDate(moment(params.options.vehicleDetails().nextMOTDate()).format("DD/MM/YYYY"));

                        }

                        self.showChangeButton = ko.computed(function () {
                            var result = false;
                            if (self.onChangeClick && typeof self.onChangeClick() === 'function') {
                                result = true;
                            }
                            return result;
                        });

                        self.showPriceDetails = ko.computed(function () {
                            var result = false;
                            if (self.priceDetails && self.priceDetails()) {
                                result = true;
                            }
                            return result;
                        });
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });