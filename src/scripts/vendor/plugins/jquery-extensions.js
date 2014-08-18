$.extend({

    getQueryString: function (key) {
        /// <summary>
        /// Gets a parameter value from the query string.
        /// </summary>
        /// <param name="key" type="string">The name of the parameter value to retrieve.</param>
        /// <returns type="string">The parameter value from the query string.</returns>

        key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

        var regexS = "[\\?&]" + key + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        }
        else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }

});