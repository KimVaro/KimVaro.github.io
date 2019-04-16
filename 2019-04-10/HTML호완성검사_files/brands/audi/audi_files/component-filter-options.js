define(["knockout", "koMapping", "text!componentVehicleSearchFilterOptionsTemplate", "clearFilterBinding"],
    function (ko, mapping, template) {

        function componentViewModel() {
            ko.components.register("filter-options",
                {
                    viewModel: function (params) {

                        var self = this;

                        self.filterItems = params.options.filters;
                        self.load = params.options.load;
                        self.selectedFilters = params.options.selectedFilters;
                        self.postCode = params.options.postCode;
                        self.currentPage = params.options.currentPage;

                        self.requestData = ko.observable({});
                        self.expanded = ko.observable(false);
                        self.filterPanels = ko.observable({});

                        self.filterItems.subscribe(function (o) {
                            loadPanels(o);
                        });

                        self.selectedFilters.subscribe(function () {
                            self.currentPage(0);
                            self.load();
                        });

                        self.buildFilter = function (parent, data, level) {

                            if (data.count === 0) {
                                return self.uncheckDisabledFilter(data);
                            }

                            var path = parent.value;

                            if (data.path !== undefined && data.path !== null) {
                                path = data.path;
                            }

                            var _FilterData = {
                                value: data.value,
                                field: parent.term,
                                level: level
                            };
                            
                            if (_FilterData.field == null && parent.filter != null) {
                                _FilterData.field = parent.filter.term;
                            }

                            if (_FilterData.value === "other") {
                                _FilterData.value = "Other";
                            }

                            if (path !== undefined) {
                                _FilterData.parentValue = path;
                            }
                            
                            return JSON.stringify(_FilterData);
                        };

                        self.onExpand = function (data) {

                            var filter = self.filterPanels()[data.title];

                            if (filter === undefined) {
                                self.filterPanels()[data.title] = ko.observable(true);
                            } else {

                                var isExpanded = self.filterPanels()[data.title]();

                                if (isExpanded) {
                                    self.filterPanels()[data.title](false);
                                } else {
                                    self.filterPanels()[data.title](true);
                                }

                            }
                        };

                        self.renderSubFilters = function (o, id) {
                            var showSubFilters = false;

                            for (var j = 0; j < self.selectedFilters().length; j++) {

                                if (showSubFilters) {
                                    break;
                                }

                                var selectedFilter = JSON.parse(self.selectedFilters()[j]);

                                showSubFilters = selectedFilter.value === o;
                            }

                            if (!showSubFilters) {
                                var $selectedItems = $("#" + id).find(".search-filter__input");

                                $selectedItems.each(function (index, inputValue) {

                                    self.selectedFilters().forEach(function (obj, i) {
                                        if (inputValue.value === obj) {
                                            self.selectedFilters().splice(i, 1);
                                        }
                                    });
                                });
                            }

                            return showSubFilters;
                        };

                        self.uncheckDisabledFilter = function (data) {
                            for (var j = 0; j < self.selectedFilters().length; j++) {

                                var obj = JSON.parse(self.selectedFilters()[j]);

                                if (data.value === obj.value) {
                                    self.selectedFilters().splice(j, 1);

                                    break;
                                }

                                var path = data.value;

                                if (data.path !== undefined && data.path !== null) {
                                    path = data.path;
                                }

                                if(obj.parentValue !== undefined && obj.parentValue === path){
                                    self.selectedFilters().splice(j, 1);
                                    break;
                                }
                            }
                            return false;
                        };

                        self.buildId = function (parentLabel, label, index) {
                            var id = (parentLabel + "_" + label + "_" + index).replace(/\s/g, "_").toLowerCase();

                            return id;
                        };

                        function loadPanels(o) {

                            o.forEach(function (obj) {
                                var hasProperty = self.filterPanels().hasOwnProperty(obj.title);

                                if (!hasProperty) {
                                    self.filterPanels()[obj.title] = ko.observable(false);
                                }
                            });
                        }
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });