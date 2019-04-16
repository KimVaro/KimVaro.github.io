define(["knockout"],
    function (ko) {
        ko.bindingHandlers.clearFilter = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var value = ko.unwrap(valueAccessor());
                var selectedFilters = ko.unwrap(value.filters());
                var wrappedValue = valueAccessor();

                $element.click(function () {

                    var $component = bindingContext.$component,
                        newFilters = [],
                        selectedFilterInputs = $element.parent().find(".search-filter__input");

                    selectedFilters.forEach(function (selectedValue) {

                        var addFilter = true;

                        selectedFilterInputs.each(function (i, o) {
                            if (selectedValue === $(o).val()) {
                                addFilter = false;
                            }
                        });

                        if (addFilter) {
                            newFilters.push(selectedValue);
                        }
                    });
                    
                    wrappedValue.filters(newFilters);
                });
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var $element = $(element);
                var value = ko.unwrap(valueAccessor());
                var selectedFilters = ko.unwrap(value.filters());
                
                $element.hide();

                var isFound = false;

                for (var j = 0; j < selectedFilters.length; j++) {

                    var selectedFilter = JSON.parse(selectedFilters[j]);

                    for (var i = 0; i < value.data.values.length; i++) {

                        var filter = value.data.values[i];

                        if (filter.path === selectedFilter.parentValue && value.data.term === selectedFilter.field) {
                            $element.show();

                            isFound = true;

                            break;
                        }
                    }

                    if (isFound) {
                        break;
                    }
                }
            }
        };
    });