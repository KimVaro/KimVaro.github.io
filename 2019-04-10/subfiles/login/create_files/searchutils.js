define([],
    function () {
        function getLocalStorageValue(key, defaultValue) {
            var value = localStorage.getItem(key);

            if (value) {
                return value;
            }

            return defaultValue;
        }

        function getSessionStorageValue(key, defaultValue, toJson) {
            var value = sessionStorage.getItem(key);

            if (value) {

                if (toJson !== undefined && toJson) {
                    return JSON.parse(value);
                }

                return value;
            }

            return defaultValue;
        }

        function setLocalStorage(key, value) {
            localStorage.setItem(key, value);
        }

        function setSessionStorage(key, value) {
            sessionStorage.setItem(key, value);
        }

        function removeSessionItem(key) {
            sessionStorage.removeItem(key);
        }

        function storageLocationKeyPrefix() {
            var key = window.location.pathname;

            return "current" + key.replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "").replace(/\//g, "-").toLowerCase();
        }

        return {
            getLocalStorageValue: getLocalStorageValue,
            getSessionStorageValue: getSessionStorageValue,
            setSessionStorage: setSessionStorage,
            setLocalStorage: setLocalStorage,
            removeSessionItem: removeSessionItem,
            storageLocationKeyPrefix: storageLocationKeyPrefix
        };
    });