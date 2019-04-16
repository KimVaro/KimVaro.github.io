var knockoutUtility = function () {

    var isPositiveNumber = function (viewModel, data) {
        return ko.computed(function () {
            return data() > 0;
        }, viewModel);
    };

    var getFirstMatchItem = function(items, itemPropertyName, itemToMatch) {
        if (!items.length) {
            return null;
        }
        return ko.utils.arrayFirst(items,
            function(item) {
                var value = item[itemPropertyName];
                return (ko.isObservable(value) ? value() : value) === itemToMatch;
            });
    };

    return {
        isPositiveNumber: isPositiveNumber,
        getFirstMatchItem: getFirstMatchItem
    }
}();