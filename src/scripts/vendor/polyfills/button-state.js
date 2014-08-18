/*
 *  Project: ButtonState
 *  Description: This plugin handles button states in IE8 and below, it makes me feel very sad :(
 *  Author: David Wilton
 *  License: Dual licensed under the MIT and GPL licenses.
 */

// Uses AMD or browser globals to create a jQuery plugin.
// AMD Wrapper: https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    // jQuery Plugin Boilerplate: https://raw.github.com/jquery-boilerplate/boilerplate/master/jquery.boilerplate.js
    (function ($, window, document, undefined) {

        // undefined is used here as the undefined global variable in ECMAScript 3 is
        // mutable (ie. it can be changed by someone else). undefined isn't really being
        // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
        // can no longer be modified.

        // window and document are passed through as local variable rather than global
        // as this (slightly) quickens the resolution process and can be more efficiently
        // minified (especially when both are regularly referenced in your plugin).

        $.ButtonState = function () {

            // Init
            this.init = function () {

              $(document).on("mouseover", "button:enabled, input[type=submit]:enabled, input[type=button]:enabled, input[type=reset]:enabled", function (e) {
                  $(this).addClass("Hover");
              });

              $(document).on("mouseout", "button:enabled, input[type=submit]:enabled, input[type=button]:enabled, input[type=reset]:enabled", function (e) {
                  $(this).removeClass("Hover");
              });

            };

            this.init();

        };

    })(jQuery, window, document);

}));