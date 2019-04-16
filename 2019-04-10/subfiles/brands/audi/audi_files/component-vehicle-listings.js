define(["knockout", "vehicleValuationPopup", "text!componentVehicleSearchListingsTemplate"],
    function (ko, vehicleValuationPopup, template) {
        vehicleValuationPopup.register();

        function componentViewModel() {
            ko.components.register("vehicle-listings",
                {
                    viewModel: function (params) {
                        var self = this;

                        self.vehicles = params.value.vehicles;
                        self.totalResults = params.value.vehicles;
                        self.vehicleValuationPopupParameter = params.value.vehicleValuationPopupParameter;
                        
                        self.vehicleValuationPopupParameter = {
                            load: params.value.vehicleValuationPopupParameter.loadSlider,
                            valuation_UID: params.value.vehicleValuationPopupParameter.valuation_UID,
                            valuation: params.value.vehicleValuationPopupParameter.valuation
                        };

                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });