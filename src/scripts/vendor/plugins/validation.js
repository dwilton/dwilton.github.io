/*
 *  Project: validation
 *  Author: David Wilton
 *  License: Dual licensed under the MIT and GPL licenses.
 *
 *  Description: 
 *  validation.js is a jQuery validation plugin that tries to achieve the functionality of HTML5 forms with the following modifications:
 *  - Polyfills HTML5 form validation for older browsers.
 *  - Modifies the input validation interaction to perform more like "Real-Time Feedback in Web Forms" by Luke Wroblewski, See: https://www.youtube.com/watch?v=hlU74LIPauo
 *  - Removes the default validation bubble.
 *  - Provides functionality to return validity state for a specific form (useful for older browsers that don't support the "invalid event" as this can be run inside your submit event handler).
 *  - Automatically toggles CSS styles for "valid" and "invalid" field states.
 *  - Provides custom validation message attributes, e.g. data-validation-message-value-missing, data-validation-message-pattern-mismatch, etc...
 *  - Adds a validation message result attribute to invalid fields (this can then be used to display the validation message, e.g. using tooltips).
 *
 *  Todo:
 *  - Range
 *  - stepMismatch
 *  - tooLong
 *  - setCustomValidity
 *
 *  Example:
 *
 *    Example of validation setup:
 *         $(function () {
 *
 *            // Setup validation
 *            var validation = new $.Validation();
 *
 *            // Attach validation to submit event
 *            $("#my-form").on("submit", function (e) {
 *
 *                // Prevent form post or get methods
 *                e.preventDefault();
 *
 *                // Do stuff if valdation has passed.
 *                if (validation.validateForm(e)) {
 *                    console.log("Doing stuff!")
 *                }
 *
 *            });
 *
 *         });
 *        
 *
 *    Example of a custom validation message.
 *        JavaScript:
 *
 *        // Custom validation for confirm password.
 *        $("#accountConfirmPassword").blur(function (e) {
 *
 *            var cpass = e.target,
 *            pass = $("#accountPassword");
 *
 *            // Reset Custom Validity
 *            cpass.setCustomValidity("");
 *
 *            // Check self the passwords match
 *            if (pass.val() !== $(cpass).val()) {
 *             cpass.setCustomValidity("Your password doesn't match");
 *            }
 *
 *        }); 
 */

// Uses AMD or browser globals to create a jQuery plugin.
// AMD Wrapper: https://github.com/umdjs/umd/blob/master/jqueryPlugin.js

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function (factory) {
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

        // Create the defaults once
        var defaults = {
            validClass: "Valid",
            invalidClass: "Invalid"
        };

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
        $.Validation = function (options) {
            
            // Update defaults
            this.options = $.extend({}, defaults, options);

            // Initial detection of hidden required fields
            this.checkHidden = function () {
                $("form:not([novalidate]) input:not(:submit):not(:button):not(:reset), form:not([novalidate]) select, form:not([novalidate]) textarea").each(function () {
                    el = $(this);
                    if ($(el).is(':hidden') && $(el).attr('required')) {
                        $(el).removeAttr('required');
                        $(el).attr('removed', 'removed');
                    }
                });
            }

            // Init
            this.init = function () {

                var self = this,
                  forms;

                // Remove the default bubble
                if (document.addEventListener) {
                    forms = document.getElementsByTagName('form');
                    for (var i = 0; i < forms.length; i++) {
                        forms[i].addEventListener('invalid', function (e) {
                            e.preventDefault();
                            self.checkField(e);
                        }, true);
                    }
                }

                // Setup event handling
                $(document).on("blur", "form:not([novalidate]) input:not(:submit):not(:button):not(:reset), form:not([novalidate]) select, form:not([novalidate]) textarea", function (e) {
                    self.checkField(e);
                });

                $(document).on("keyup", "form:not([novalidate]) input:not(:submit):not(:button):not(:reset), form:not([novalidate]) select, form:not([novalidate]) textarea", function (e) {
                    if ($(e.target).hasClass(self.options.invalidClass)) {
                        self.checkField(e);
                    }
                });

                $(document).on("DOMNodeInserted", function (e) {
                    $("form:not([novalidate]) input:not(:submit):not(:button):not(:reset), form:not([novalidate]) select, form:not([novalidate]) textarea").each(function () {
                        $(this).on("invalid", function (e) {
                            self.checkField(e);
                        });
                    });
                });

            }

            // Trigger form validation, passing in the submit event 
            this.validateForm = function (el) { 
  
                var self = this, 
                    inputEls = $(el.target).find("input:not(:submit):not(:button):not(:reset), select, textarea"), 
                    isValid = true; 
  
                if (inputEls.length == 0) inputEls = $(el[0]).find("input:not(:submit):not(:button):not(:reset), select, textarea"); 
                inputEls.each(function (i) { 
                    if (self.checkField(this) === false) { 
                        isValid = false; 
                    } 
                }); 
  
                return isValid; 
  
            } 

            // HTML5 validation polyfill
            this.validate = function (el) {
                var m = {
                    url: /^https?\:\/\/[a-z0-9]+/i,
                    date: /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/,
                    email: /^[a-z0-9\.\'\-]+@[a-z0-9\.\-]+$/i,
                    number: /^[0-9]+(\.[0-9]+)?$/i
                },
                type = el.getAttribute('type'),
                required = (el.getAttribute('required') !== null),
                pattern = (el.getAttribute('pattern') !== null),
                validityState,
                validationMessage = "";

                validityState = {
                    customError: false,
                    rangeOverflow: false,
                    rangeUnderflow: false,
                    stepMismatch: false,
                    valueMissing: required && el.value.length === 0,
                    tooLong: false,
                    typeMismatch: (el.value.length > 0) && (type in m) && !el.value.match(m[type]),
                    patternMismatch: pattern && (el.value.length > 0) && !el.value.match(new RegExp(el.getAttribute('pattern')))
                };

                for (var prop in validityState) {
                    if (validityState[prop] === true) {
                        validityState.valid = false;

                        switch (prop) {

                            case "rangeOverflow":
                                validationMessage = "Range Over";
                                break;

                            case "rangeUnderflow":
                                validationMessage = "Range Under";
                                break;

                            case "stepMismatch":
                                validationMessage = "Step Mismatch";
                                break;

                            case "valueMissing":
                                validationMessage = "Please fill in this field";
                                break;

                            case "tooLong":
                                validationMessage = "Too Long";
                                break;

                            case "typeMismatch":
                                validationMessage = "Not a valid " + el.getAttribute('type');
                                break;

                            case "patternMismatch":
                                validationMessage = "Invalid pattern";
                                break;

                        };

                        break;
                    }
                }

                if (typeof (validityState.valid) == "undefined") {
                    validityState.valid = true;
                }

                return {
                    validityState: validityState,
                    validationMessage: validationMessage
                };
            }

            // Check Field
            this.checkField = function (e) {
                var el = e.target || e,
                  self = this,
                  suffix,
                  specificErrormessage,
                  genericErrormessage,
                  validity,
                  validationMessage;
                // Check for required fields that were hidden and are now visible
                if ($(el).is(':visible') && $(el).attr('removed')) {
                    $(el).removeAttr('removed');
                    $(el).removeClass('Valid');
                    $(el).attr('required', 'required');
                }
                if (($(el).is(':hidden') || $(el).is(':disabled')) && $(el).attr('required')) {
                    $(el).removeAttr('required').removeClass('Invalid');
                    $(el).attr('removed', 'removed');
                }
                // Prevent display of the native browser validation messages.
                if (e.target) {
                    e.stopPropagation();
                    e.preventDefault();
                }

                // Detect HTML5 form support
                if (typeof (el.validity) != "undefined") {
                    validity = el.validity;
                    validationMessage = el.validationMessage;
                } else {
                    validatation = self.validate(el);
                    validity = validatation.validityState;
                    validationMessage = validatation.validationMessage;
                }

                // Checks the element validation.
                if (validity.valid) {
                    // Update CSS styles & remove tooltip attribute
                    $(el).removeAttr("data-tooltip-content")
                      .addClass(self.options.validClass)
                      .removeClass(self.options.invalidClass);

                    return true;

                } else {

                    // Update CSS styles
                    $(el).addClass(self.options.invalidClass)
                      .removeClass(self.options.validClass);

                    /*      
                    Custom validation attributes self can be added to the element.
                    data-validation-message
                    data-validation-message-value-missing
                    data-validation-message-type-mismatch
                    data-validation-message-pattern-mismatch
                    data-validation-message-too-long
                    data-validation-message-range-underflow
                    data-validation-message-range-overflow
                    data-validation-message-step-mismatch
                    data-validation-message-custom-error
                    */

                    suffix = validity.valueMissing ? "value-missing" : validity.typeMismatch ? "type-mismatch" : validity.patternMismatch ? "pattern-mismatch" : validity.tooLong ? "too-long" : validity.rangeUnderflow ? "range-underflow" : validity.rangeOverflow ? "range-overflow" : validity.stepMismatch ? "step-mismatch" : validity.customError ? "custom-error" : "";

                    if (suffix && (specificErrormessage = el.getAttribute("data-validation-message-" + suffix))) { // Use custom "data-validation-message-*"
                        $(el).attr("data-validation-message-result", specificErrormessage);
                    } else if ((genericErrormessage = el.getAttribute("data-validation-message")) && !validity.customError) { // Use default "data-validation-message"
                        $(el).attr("data-validation-message-result", genericErrormessage);
                    } else { // Use HTML5 default message or a custom error.
                        $(el).attr("data-validation-message-result", validationMessage);
                    }

                    return false;

                }
            }

            this.checkHidden();
            this.init();

        };

    })(jQuery, window, document);

}));