define(["knockout", "searchUtils"],
    function (ko, searchUtils) {
        ko.bindingHandlers.numeric = {
            init: function (element, valueAccessor) {
                $(element).on("keydown", function (event) {
                    // Allow: backspace, delete, tab, escape, and enter
                    if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
                        // Allow: Ctrl+A
                        (event.keyCode == 65 && event.ctrlKey === true) ||
                        // Allow: home, end, left, right
                        (event.keyCode >= 35 && event.keyCode <= 39)) {
                        // let it happen, don't do anything
                        return;
                    }
                    else {
                        // Ensure that it is a number and stop the keypress
                        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
                            event.preventDefault();
                        }
                    }
                });
            }
        };

        ko.bindingHandlers.currency = {
            init: function (element, valueAccessor) {

                $(element).bind('paste', function () {
                    var self = this;
                    setTimeout(function () {
                        if (!/^[a-zA-Z]+$/.test($(self).val())) $(self).val('');
                    }, 0);
                });

                $(element).bind('paste', function () {
                    var self = this;
                    setTimeout(function () {
                        if (!/^\d*(\.\d{1,2})+$/.test($(self).val())) $(self).val('');
                    }, 0);
                });

                $(element).keypress(function (e) {
                    var character = String.fromCharCode(e.keyCode);
                    var newValue = this.value + character;
                    if (isNaN(newValue) || hasDecimalPlace(newValue, 3) || e.keyCode == 32) {
                        e.preventDefault();
                        return false;
                    }
                });

                function hasDecimalPlace(value, x) {
                    var pointIndex = value.indexOf('.');
                    return pointIndex >= 0 && pointIndex < value.length - x;
                }
            }
        };

        ko.bindingHandlers.sliderData = {
            update: function (element, valueAccessor) {
                if (valueAccessor()()) {
                    var objects = valueAccessor()();
                    $(element).data("value-strings", objects.data);
                    $(element).data("value", objects.selectedIndex);
                    $(element).prev(".form__slider-value").remove();
                    $(element).slider("destroy");
                    form.initSlider($(element));
                }
            }
        };

        ko.bindingHandlers.slider = {
            init: function (element, valueAccessor) {
                $(element).find(".form__slider-input").on("change", function (event, data) {
                    var value = valueAccessor();
                    value(data);
                });
            },
            update: function (element, valueAccessor) {
                var value = valueAccessor()();
                $(element).data("value", value);
            }

        };

        ko.bindingHandlers.datePicker = {
            init: function (element, valueAccessor) {
                $(element).find("input[type=text]").on("dateInputChange", function (event, data) {
                    var value = valueAccessor();
                    value(data);
                });
            },
            update: function (element, valueAccessor) {

                var data = "";
                var value = valueAccessor()();
                if (valueAccessor) {
                    if (value) {
                        value = value.split("/");
                        data = value[1] + "/" + value[0] + "/" + value[2];

                        $(element).data('selected-date', data);

                        datepicker.updateDisplayedDate($(element).find("input[type=text]"));
                    } else {

                        datepicker.clearDate($(element));
                    }
                }
            }
        };

        ko.bindingHandlers.datePickerEnableDates = {

            update: function (element, valueAccessor) {

                var data = [];
                var value = valueAccessor()();
                if (valueAccessor) {
                    if (value) {

                        for (var i = 0; i <= value.length - 1; i++) {

                            var temp = value[i].split("/");
                            data[i] = temp[1] + "/" + temp[0] + "/" + temp[2];

                        }

                        $(element).data('enabled-dates', data);

                        datepicker.updateDisplayedDate($(element).find("input[type=text]"));
                    }

                    datepicker.clearDate($(element));
                }
            }
        };

        ko.bindingHandlers.scrollToVehicleTile = {
            init: function (element) {

                var searchNav = searchUtils.getSessionStorageValue("search_nav", null, true);

                if (searchNav !== undefined && searchNav !== null) {

                    var $vehicleTile = $('#' + searchNav.selectedReg);
                    var $ul = $(element);

                    if ($vehicleTile.length > 0 && $ul.length > 0) {

                        $("html, body").animate({
                            scrollTop: $($vehicleTile).offset().top
                        });
                    }

                    searchUtils.removeSessionItem("search_nav");
                }
            }
        };

        ko.bindingHandlers.onVehicleTileClick = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                $(element).on("click",
                    function (e) {
                        var $resultsGrid = $(".results-grid");

                        searchUtils.setSessionStorage("search_nav",
                            JSON.stringify({
                                selectedReg: this.id,
                                currentTotal: $resultsGrid.data("vehicles-count")
                            }));
                    });
            }
        };

        ko.bindingHandlers.readonly = {
            update: function (element, valueAccessor) {
                if (valueAccessor()()) {
                    $(element).attr("readonly", "readonly");
                 } else {
                    $(element).removeAttr("readonly");
                 }
            }
        };
    });