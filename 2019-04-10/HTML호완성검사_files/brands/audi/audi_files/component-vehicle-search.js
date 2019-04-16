define([
        "knockout",
        "vehicleSearchModel",
        "filterOptions",
        "vehicleListings",
        "priceFilterOptions",
        "postCodeFilter",
        "vehicleValuationModal",
        "bindingHandlers",
        "text!componentVehicleSearchTemplate"
    ],
    function(ko,
        vehicleSearchModel,
        filterOptions,
        vehicleListings,
        priceFilterOptions,
        postCodeFilter,
        vehicleValuationModal,
        bindingHandlers,
        template) {
        function componentViewModel() {

            vehicleValuationModal.register();
            filterOptions.register();
            vehicleListings.register();
            priceFilterOptions.register();
            postCodeFilter.register();

            var model = new vehicleSearchModel();

            ko.components.register("vehicle-search",
                {
                    viewModel: function() {
                        return model;
                    },
                    template: template
                });

            var vehicleSearchElement = $('.search-layout')[0];

            if (vehicleSearchElement !== undefined && vehicleSearchElement !== null) {
                ko.applyBindings(model, vehicleSearchElement);
            }
        }

        return {
            register: componentViewModel
        };
    });