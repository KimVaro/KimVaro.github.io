define(["knockout", "megamenu", "navfooter"],
    function (ko, megamenu, navfooter) {
        function NavigationDetailsViewModel() {
            megamenu.register();

            var self = this;
            self.navigationdata = ko.observableArray([]);

            self.getnavigationdata = function () {
                var getmegamenuUrl = "/api/navigation/megamenu";

                $.ajax({
                    url: getmegamenuUrl,
                    cache: false,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json"
                }).done(function (data) {
                    if (data) {
                        self.navigationdata(data);
                        navigation.megaMenu();
                        navigation.subMenu();
                        navigation.toggle();
                        navigation.toggleChildren();
                    }
                });
            };

            self.getnavigationdata();
        }

        function FooterNavigationDetailsViewModel() {
            navfooter.register();
            var self = this;
            self.footernavigationdata = ko.observableArray([]);
            self.getfooternavigationdata = function () {
                var getFooterNavigationUrl = "/api/navigation/footernavigationdata";

                $.ajax({
                    url: getFooterNavigationUrl,
                    cache: false,
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json"
                }).done(function (data) {
                    if (data) {
                        self.footernavigationdata(data.footerData);                      
                    }
                });
            };
            self.getfooternavigationdata();
        }

        ko.applyBindings(new FooterNavigationDetailsViewModel(), document.getElementById('footer'));
        ko.applyBindings(new NavigationDetailsViewModel(), document.getElementById('pageheader'));
    });