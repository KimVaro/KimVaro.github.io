define(["knockout", "text!footerTemplate"],

    function (ko, template) {
        function componentViewModel() {
            ko.components.register("navfooter",
                {
                    viewModel: function (params) {
                        var self = this;
                        self.footernavigationdata = ko.observableArray([]);
                        self.copyrightnotice = ko.observable();
                        if (params !== undefined) {
                            self.footernavigationdata = params.data;
                        }

                        self.getCopyrightText = function () {
                            var startYear = '2018';
                            var currentYear = new Date().getFullYear();
                            var copyrightdata = '&copy; ' + startYear + ' - ' + currentYear + ' All rights reserved.';
                            self.copyrightnotice(copyrightdata);
                        };
                        self.getCopyrightText();
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });