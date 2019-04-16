define(["knockout", "koMapping", "vehicleValuationModalRegnumber", "vehicleValuationVehicleDetails", "vehicleValuationParent", "vehicleValuationDisplayValuationDetails", "valuationutils", "text!componentValuationModalTemplate"],
    function (ko, mapping, vehicleValuationModalRegnumber, vehicleValuationVehicleDetails, vehicleValuationParent, vehicleValuationDisplayValuationDetails, valuationutils, template) {

        vehicleValuationModalRegnumber.register();
        vehicleValuationVehicleDetails.register();
        vehicleValuationDisplayValuationDetails.register();

        function componentViewModel() {
            ko.components.register("vehiclevaluation-modal",
                {
                    viewModel: function (params) {

                        var self = this;
                       vehicleValuationParent(self, params);

                        self.onClickContinueWithoutThisValuation = function (e) {
                            setTimeout(function () {
                                self.onChangeClickToRegNo();
                            }, 300);
                           
                        },
                            
                        self.onModalOpened = function (data, event) {
                            self.initObservables();
                            self.prePopulateVehicleDetails(null);
                            self.resetEmailForm(new Date());
                            self.PopulateDynamicContent();
                            
                             if (self.error() || self.processingData()) {
                                
                                self.valuation_UID("");
                                self.valuation();
                            }

                            if (self.valuation_UID()) {

                                self.getValuationDetails(self.valuation_UID());

                            } else {

                                self.initObservables();

                                valuationutils.deleteValuation_UID();
                            }


                            self.processingData(false);
                        };                      
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });