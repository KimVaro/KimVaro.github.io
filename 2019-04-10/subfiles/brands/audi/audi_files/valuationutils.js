define([],
    function () {
        function getValuation_UID() {

           return Cookies.get("__valuation");
        }

        function setValuation_UID(valuation_UID, expiryDate) {

            var cookieDomain = $("#cookiedomain").val();
            Cookies.set("__valuation", valuation_UID, { expires: new Date(expiryDate), domain: cookieDomain });
          
        }

        function deleteValuation_UID() {

            var cookieDomain = $("#cookiedomain").val();
            Cookies.remove("__valuation", { domain: cookieDomain });
        }

        
        return {
            getValuation_UID: getValuation_UID,
            setValuation_UID: setValuation_UID,
            deleteValuation_UID: deleteValuation_UID
        };
    });