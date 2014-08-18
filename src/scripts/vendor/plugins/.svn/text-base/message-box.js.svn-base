/// <reference path="~/Content/Scripts/Shared/Reference.js" />

/// <summary>
/// Shows an ajax dialog, and ajax loader, or a messagebox.
/// </summary>
/// <examples>
/// Example of creating an ajax dialog:
///     HTML returned by ChangeSynopsis/Index:
///         <div class=\"Dialog\">
///             <div class=\"Content\">
///                 ...
///             </div>
///         </div>
///     Javascript:
///         $(document).click(function() {
///             // Show the dialog when the document is clicked.
///             $.ajaxDialog({
///                 url: $.url("ChangeSynopsis/Index"),
///                 data: {
///                     id: 4
///                 },
///                 success: function() {
///                     // Event handler called when the view is loaded in and attached to the dialog.
///                     view.attachController("ChangeSynopsis");
///                 }
///                 events: {
///                     onOkClicked: function (eventArgs) {
///                         // A custom event handler.
///                         console.log("OK button clicked.");
///                     }
///                 }
///             });
///         });
///
/// Example of creating an ajax loader:
///     Javascript:
///         $.ajaxLoader({
///             url: $.url("ChangeSynopsis/Update"),
///             data: {
///                 id: 4
///             },
///             success: function() {
///                 // Event handler called when the loading has completed.
///             }
///         });
///
/// Example of creating a messagebox:
///     Javascript:
///         $.messageBox({
///             content: "An error has occurred.",
///             isCloseButton: true,
///             events: {
///                 onHide: function(view) {
///                     // The messagebox has been hidden.
///                 }
///             }
///         })
/// </examples>

(function ($) {

    $.extend({
        ajaxDialog: function (options) {
            /// <summary>
            /// Shows a dialog that is loaded in asynchronously.
            /// </summary>
            /// <param name="options" type="object">
            /// Any options passed in to the dialog.
            /// &#10;"url" (string) - the url of the data source to load the dialog from.
            /// &#10;"data" (object) - the data to pass to the data source.
            /// &#10;"type" (string) - the request type - "get" or "post" (default is "get").
            /// &#10;"success" (function(response)) - the function to call once the data has been loaded successfully.
            /// &#10;"error" (function()) - the function to call once an error has occurred loading the data (if undefined will show a messagebox error).
            /// &#10;"events" (object) - any custom events to use inside the dialog.
            /// &#10;    {
            /// &#10;        onHide(view) (function) - the event that is called when the dialog is hidden.
            /// &#10;        ... - add any custom events
            /// &#10;    }
            /// </param>

            if (options === undefined) {
                throw "Error: No 'options' given to dialog.";
            }

            if (options.url === undefined) {
                throw "Error: No 'url' given to dialog.";
            }

            var ajaxOptions = $.extend({}, options, {
                success: function (view) {
                    var dialogTemplate = $(view);

                    dialogTemplate.dialog({
                        events: {
                            onShow: function (dialog) {
                                $.extend(dialog.events, options.events);

                                if (options.success) {
                                    options.success(dialog.elements.dialog);
                                }
                            }
                        }
                    });
                }
            });

            $.ajaxLoader(ajaxOptions);
        },

        ajaxLoader: function (options) {
            /// <summary>
            /// Shows an ajax loader while performing an asynchronous HTTP (AJAX) request.
            /// </summary>
            /// <param name="options" type="object">
            /// Any options passed in to the dialog.
            /// &#10;"url" (string) - the url of the data source to load.
            /// &#10;"data" (object) - the data to pass to the data source.
            /// &#10;"type" (string) - the request type - "get" or "post" (default is "get").
            /// &#10;"success" (function(response)) - the function to call once the data has been loaded successfully.
            /// &#10;"error" (function()) - the function to call once an error has occurred loading the data (if undefined will show a messagebox error).
            /// </param>

            var dialogTemplate = $("<div class=\"Dialog Loading ThemeLight\"><div class=\"Content\"><div class=\"Loading\"><span class=\"Spinner\"></span>Loading</div></div></div>");

            if (options === undefined) {
                throw "Error: No 'options' given to ajaxLoader.";
            }

            if (options.url === undefined) {
                throw "Error: No 'url' given to ajaxLoader.";
            }

            dialogTemplate.dialog({
                events: {
                    onShow: function (dialog) {
                        dialog.success = options.success;
                        dialog.error = options.error;

                        var ajaxOptions = $.extend({}, options, {
                            success: function (response) {
                                dialog.hide();

                                if (dialog.success) {
                                    dialog.success(response);
                                }
                            },
                            error: function (response) {
                                if (response.status !== 0) {
                                    dialog.hide();

                                    if (dialog.error) {
                                        dialog.error(response);
                                    }
                                    else {
                                        $.messageBox({
                                            content: "An error has occurred."
                                        });
                                    }
                                }
                            }
                        });

                        $.ajax(ajaxOptions);
                    }
                }
            });
        },

        messageBox: function (options) {
            /// <summary>
            /// Shows a message box.
            /// </summary>
            /// <param name="options">
            /// Any options passed through for the messageBox, or a response from an ajax call.
            /// &#10;"type" (string) - the type of message box: "success", "warning" or "error" (default is "error").
            /// &#10;"title" (string) - the title of the message box (default is "Error").
            /// &#10;"content" (string) - the content of the message box.
            /// &#10;"buttons" (object) - any buttons to add to the dialog.
            /// &#10;    {
            /// &#10;        name (string) - the text that is shown on the button.
            /// &#10;        cssClass (string) - the class that is applied to the button.
            /// &#10;        callback (function) - [OPTIONAL] the callback function that is called when the button is clicked, after first hiding the dialog.
            /// &#10;    }
            /// &#10;"events" (object) - any events to use inside the dialog.
            /// &#10;    {
            /// &#10;        onLoad(view) (function) - the event that is called when the dialog is shown.
            /// &#10;        onHide(view) (function) - the event that is called when the dialog is hidden.
            /// &#10;    }
            /// </param>

            if (options.responseText) {
                // The options object pass in is an error response from an ajax call.
                var error = JSON.parse(options.responseText);

                if (error.modelState) {
                    // Display the modelstate errors returned.
                    var messages = [];

                    for (var key in error.modelState) {
                        error.modelState[key].forEach(function (message) {
                            messages.push(message);
                        });
                    }

                    var content = "";

                    if (messages.length === 1) {
                        content = messages[0];
                    }
                    else {
                        content = "<ul>";

                        messages.forEach(function (message) {
                            content += "<li>" + message + "</li>";
                        });

                        content += "</ul>";
                    }

                    options = {
                        content: content
                    };
                }
                else if (error.message) {
                    // Display the error message returned.
                    options = {
                        content: error.message
                    };
                }
                else {
                    // An error message was not given. Fall back to a default error message.
                    options = {
                        content: "An error has occurred."
                    };
                }
            }

            var defaultOptions = {
                type: "information",
                title: "Information",
                content: ""
            };

            options = $.extend(defaultOptions, options);

            var cssClassType = "Issue";

            if (options.type.toLowerCase() === "success") {
                cssClassType = "Issue Success";
            } else if (options.type.toLowerCase() === "warning") {
                cssClassType = "Issue Warning";
            } else if (options.type.toLowerCase() === "error") {
                cssClassType = "Issue Error";
            }

            var messageBoxTemplate = "<div class=\"Dialog\"><div class=\"Content MessageBox ";
            messageBoxTemplate += cssClassType;
            messageBoxTemplate += "\"><h1>";
            messageBoxTemplate += options.title;
            messageBoxTemplate += "</h1>";

            // If no buttons are defined in the options, add the standard close button
            if (options.isCloseButton !== undefined) {
                messageBoxTemplate += "<a href=\"#\" class=\"CloseButton\">Close</a>";
            }

            messageBoxTemplate += "<div class=\"Container\">";
            messageBoxTemplate += "<div class=\"Content \">";
            messageBoxTemplate += options.content;
            messageBoxTemplate += "</div>";
            
            // If buttons are defined, write out button container
            if (options.buttons !== undefined) {
                messageBoxTemplate += "<div class=\"ActionButtons\"></div>";
            }

            messageBoxTemplate += "</div>";
            messageBoxTemplate += "</div></div>";
            messageBoxTemplate = $(messageBoxTemplate);
            
            messageBoxTemplate.dialog({
                events: {
                    onShow: function (dialog) {

                        $.extend(dialog.events, options.events);

                        if (dialog.events.onLoad) {
                            dialog.events.onLoad(dialog.elements.dialog);
                        }

                        // If buttons are defined, add buttons along with css and callback click event handler
                        if (options.buttons !== undefined) {
                            for (var i = 0; i < options.buttons.length; i++) {
                                var button = $("<button>" + options.buttons[i].name + "</button>");
                                dialog.elements.dialog.find(".ActionButtons").append(button);
                                button.addClass(options.buttons[i].cssClass);

                                button.click(function() {
                                    dialog.hide();

                                    for (var j = 0; j < options.buttons.length; j++) {
                                        if (this.innerHTML === options.buttons[j].name) {
                                            if (options.buttons[j].callback !== undefined) {
                                                options.buttons[j].callback();
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            });
        }
    });

})($);