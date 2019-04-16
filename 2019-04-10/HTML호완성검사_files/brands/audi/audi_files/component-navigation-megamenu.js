define(["knockout", "text!megamenuTemplate"],

    function (ko,template) {
        function componentViewModel() {
            ko.components.register("megamenu",
                {
                    viewModel: function (params) {
                        var self = this;
                        self.navigationdata = ko.observableArray([]);
                        if (params !== undefined) {                           
                            self.navigationdata = params.data;
                        }
                      
                    },
                    template: template
                });
        }

        return {
            register: componentViewModel
        };
    });