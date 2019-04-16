var GlobalUtilities = function () {

    var addDays = function (date, days) {
        var newDate = date.setDate(date.getDate() + days);
        return new Date(newDate);
    };

    var addHours = function (date, hours) {
        var newDate = date.setHours(date.getHours() + hours);
        return new Date(newDate);
    };

    var daysDifference = function (startDate, endDate) {
        startDate = new Date(startDate);
        endDate = new Date(endDate);

        var millisecondsPerDay = 1000 * 60 * 60 * 24;
        var timeBetween = endDate.getTime() - startDate.getTime();

        return timeBetween / millisecondsPerDay;
    };

    var deleteCookie = function (name) {
        setCookie(name, '', -1);
    };

    var getCookie = function (name) {
        var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    };

    var getCookiePolicyExpiryDate = function () {
        return addDays(new Date(), 365);
    };

    var getDomain = function () {
        return $('#cookiedomain').val() || window.location.hostname.match(/(\w+?\.?\w+)$/)[0];
    };

    var getPostcodeExpiryDate = function () {
        return addDays(new Date(), 90);
    };

    // Detects if testValue has at least one digit without a decimal point 
    //   or at least one to the left of a decimal point 
    //   and zero to 2 digits to the right of a decimal point 
    var isMoneyNumber = function (testValue) {
        var regex = /^-?\d+\.?\d{0,2}$/; 
        return regex.test(testValue);
    };

    // Rounds the passed amount (string or number) to the passed decimalPlaces number of decimal places
    //   If amount is string and is not parsable as a number, it simply returns the string
    //   NOTE: the result is always returned as a string
    var roundToDecimal = function (amount, decimalPlaces) {
        if (!isNaN(amount)) {
            var result = +amount;
            return result.toFixed(decimalPlaces);
        }

        return amount;
    };

    var isPostcodeValid = function (postcode) {
        var postcodeValue = postcode.replace(/\s/g, "");
        var postcodeRegex = /^([a-zA-Z][0-9][a-zA-Z]?|[a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9]{1,2}|[a-zA-Z][a-zA-Z][0-9][a-zA-Z]) ?[0-9][a-zA-Z]{2}$/;

        return postcodeRegex.test(postcodeValue);
    };

    var linkScroll = function () {
        $(".link-scroll").on("click", function () {
            var $scrollTo = $($(this).attr("href"));
            $([document.documentElement, document.body]).animate({
                scrollTop: $scrollTo.offset().top
            }, 500);
        });
    };

    var operators = {
        ">": function (a, b) { return a > b; },
        ">=": function (a, b) { return a >= b; },
        "<": function (a, b) { return a < b; },
        "<=": function (a, b) { return a <= b; }
    };

    var setCookie = function (name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    };

    var findItemByValue = function(items, property, value) {

        for (var i = 0; i < items.length; i++) {

            var item = property.split(".").reduce(function (a, b) {
                return a && a[b];
            }, items[i]);

            if (item === undefined) {
                continue;
            }

            if (item === value) {
                return items[i];
            }
        }

        return undefined;
    };

    return {
        addDays: addDays,
        addHours: addHours,
        daysDifference: daysDifference,
        deleteCookie: deleteCookie,
        getCookie: getCookie,
        getCookiePolicyExpiryDate: getCookiePolicyExpiryDate,
        getDomain: getDomain,
        getPostcodeExpiryDate: getPostcodeExpiryDate,
        isMoneyNumber: isMoneyNumber,
        roundToDecimal: roundToDecimal,
        isPostcodeValid: isPostcodeValid,
        linkScroll: linkScroll,
        operators: operators,
        setCookie: setCookie,
        findItem: findItemByValue
    };

}();