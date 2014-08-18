/// <reference path="~/Content/Scripts/Shared/Reference.js" />

/// <summary>
/// A modal dialog.
/// </summary>
/// <examples>
/// Example of retrieving the dialog object from an element:
///    HTML:
///         <div id="Dialog" class="Dialog">
///             <div class="Content">
///                 <h3>Dialog</h3>
///                 <div id="#Test">This is a standard dialog.</div>
///             </div>
///         </div>
///     Javascript:
///        ...
///        var dialog = $("#Test").getDialog();
///        ...
///
/// Example of a basic dialog:
///     HTML:
///         <div id="Dialog" class="Dialog" data-auto-hide="true" data-auto-close="false">
///             <div class="Content">
///                 <h3>Dialog</h3>
///                 <div>This is a standard dialog.</div>
///             </div>
///         </div>
///     Javascript:
///         $(document).click(function() {
///             // Show the dialog when the document is clicked.
///             $("#Dialog").dialog();
///         });
///
/// Example of a dialog with buttons:
///     HTML:
///         <div id="MessageBoxDialog" class="Dialog">
///             <div class="Content">
///                 <h3>Dialog</h3>
///                 <div>This is a messagebox dialog.</div>
///                 <button class="OK">OK</button>
///                 <button class="Cancel CloseButton">Cancel</button>
///             </div>
///         </div>
///     Javascript:
///         $(document).click(function() {
///             $("#MessageBoxDialog").dialog({
///                 events: {
///                     onShow: function (dialog) {
///                         var okButton = dialog.elements.dialog.find("button.OK");
///
///                         okButton.click(function () {
///                             dialog.hide();
///                         });
///                     },
///                     onOkButtonClicked: function(eventArgs) {
///                         // This is a custom event that is stored inside the dialog's events object.
///                     }
///                 }
///             });
///         });
/// </examples>

(function ($) {

    $.fn.dialog = function (options) {
        /// <summary>
        /// Shows a modal dialog.
        /// </summary>
        /// <param name="options" type="object">
        /// Contains options for the dialog.
        /// &#10;"autoHide" (bool) - a value indicating whether to hide the dialog when clicking in the mask of pressing 'ESC'.
        /// &#10;"autoClose" (bool) - a value indicating whether to automatically hide the dialog when an element in the dialog with a class of "CloseButton" is clicked.
        /// &#10;"events" (object) -  any events to use inside the dialog.
        /// &#10;    {
        /// &#10;        onShow(object) (function) - the event that is called when the dialog is shown.
        /// &#10;        onHide(object) (function) - the event that is called when the dialog is hidden.
        /// &#10;    }
        /// </param>

        // Build the dialogs collection if it does not already exist.
        var dialogs = $("#Dialogs");

        if (!dialogs.length || !dialogs[0].dialogs) {
            var dialogsClass = {
                /// <summary>
                /// Contains the collection of dialogs.
                /// </summary>
                dialogCollection: [],

                init: function () {
                    /// <summary>
                    /// Initializes the dialogs.
                    /// </summary>

                    dialogs = $("<div id=\"Dialogs\" />");
                    $("body").append(dialogs);
                },

                add: function (dialog) {
                    /// <summary>
                    /// Adds a dialog to the collection of dialogs.
                    /// </summary>
                    /// <param name="dialog" type="object">The dialog to add.</param>

                    this.dialogCollection.push(dialog);
                },

                remove: function (dialog) {
                    /// <summary>
                    /// Removes a dialog from the collection of dialogs.
                    /// </summary>
                    /// <param name="dialog" type="object">The dialog to remove.</param>

                    this.dialogCollection = $.grep(this.dialogCollection, function (value) {
                        return value !== dialog;
                    });
                }
            };

            if (!dialogs.length) {
                dialogsClass.init();
            }
            
            dialogs[0].dialogs = dialogsClass;
        }

        var dialog = {
            elements: {
                template: $(this),
                mask: undefined,
                dialog: undefined
            },

            events: {
                onShow: undefined,
                onHide: undefined
            },

            autoHide: false,

            autoClose: true,

            init: function () {
                /// <summary>
                /// Initializes the dialog.
                /// </summary>

                this.initOptions();
                this.buildDialog();
                this.buildEvents();

                var dialogContent = $(this.elements.dialog).children(".Content");

                dialogContent.css({
                    "margin-left": ($("body").outerWidth(true) / 2) - (dialogContent.outerWidth() / 2) + "px",
                    "margin-top": ($("body").outerHeight(true) / 2) - (dialogContent.outerHeight() / 2) + "px"
                });


                if (this.events.onShow) {
                    this.events.onShow(this);
                }
            },

            initOptions: function () {
                /// <summary>
                /// Initializes any options used for the dialog.
                /// </summary>

                if (!options) {
                    options = {};
                }

                if (!options.events) {
                    options.events = {};
                }

                if (this.elements.template.attr("data-auto-hide") && options.autoHide === undefined) {
                    options.autoHide = this.elements.template.attr("data-auto-hide") === "true";
                }

                if (this.elements.template.attr("data-auto-close") && options.autoClose === undefined) {
                    options.autoClose = this.elements.template.attr("data-auto-close") !== "false";
                }

                this.events = options.events;

                if (options.autoHide !== undefined) {
                    this.autoHide = options.autoHide;
                }

                if (options.autoClose !== undefined) {
                    this.autoClose = options.autoClose;
                }
            },

            hide: function () {
                /// <summary>
                /// Hides the dialog.
                /// </summary>

                // Remove the dialog elements from the HTML.
                this.elements.dialog.add(this.elements.mask).remove();

                // Remove the dialog from the collection of dialogs.
                dialogs[0].dialogs.remove(this);

                //Remove the mask and set it back the dialog hidden underneath if there is one.
                this.setVisibleMask();

                // Set focus to the dialog hidden underneath if there is one.
                if (dialogs[0].dialogs.dialogCollection.length > 0) {
                    var visibleDialog = dialogs[0].dialogs.dialogCollection[dialogs[0].dialogs.dialogCollection.length - 1];
                    visibleDialog.elements.dialog.focus();
                }

                if (this.events.onHide) {
                    this.events.onHide(this.elements.dialog);
                }
            },

            buildDialog: function () {
                /// <summary>
                /// Builds the dialog.
                /// </summary>

                this.elements.mask = $("<div class=\"Mask\" />");
                this.elements.dialog = this.elements.template.clone().removeAttr("id");

                dialogs.append(this.elements.mask).append(this.elements.dialog);
                this.elements.dialog.attr("tabindex", "0").addClass("Show");
                this.elements.dialog[0].dialog = this;

                this.setVisibleMask();
            },

            setVisibleMask: function () {
                /// <summary>
                /// Shows the Dialog Mask.
                /// </summary>

                var dialogContainer = $("#Dialogs");
                var masks = dialogContainer.children(".Mask");

                masks.each(function (index) {
                    $(this).removeClass("Show");
                });
                dialogContainer.removeClass("Show");
                masks.filter(":last").addClass("Show").parent().addClass("Show");
            },

            buildEvents: function () {
                /// <summary>
                /// Builds the events for the dialog.
                /// </summary>

                this.elements.dialog.focus();

                // Bind the keydown event when the tab key is pressed to make sure no items outside of the dialog can be tabbed to.
                this.elements.dialog.bind("keydown.dialog", function (event) {
                    switch (event.keyCode) {
                        case 9:
                            // The 'TAB' button has been pressed.
                            var first = dialog.elements.dialog;
                            var last = $(this).find(":tabbable:last");

                            if (!last.length) {
                                // There are no tabbable controls in the dialog. Ignore the TAB keypress.
                                return false;
                            }
                            else if (event.target === last[0] && !event.shiftKey) {
                                // TAB has been pressed in the last tabbable control - set focus to the first tabbable control.
                                first.focus();

                                return false;
                            }
                            else if (event.target === first[0] && event.shiftKey) {
                                // Shift-TAB has been pressed in the first tabbable control - set focus to the last tabbable control.
                                last.focus();

                                return false;
                            }

                            break;

                        case 27:
                            // The 'ESC' button has been pressed. Hide the dialog.
                            if (dialog.autoHide) {
                                dialog.hide();
                            }
                            break;
                    }
                });

                if (dialog.autoHide) {

                    this.elements.dialog.on("click", function (event) {
                        /// <summary>
                        /// Event handler called when the content of the dialog is clicked.
                        /// </summary>
                        dialog.hide();
                    });

                    this.elements.mask.on("click", function (event) {
                        /// <summary>
                        /// Event handler called when the content of the dialog is clicked.
                        /// </summary>
                        dialog.hide();
                    });

                    this.elements.dialog.on("click", "> .Content", function (event) {
                        /// <summary>
                        /// Event handler called when the content of the dialog is clicked.
                        /// </summary>
                        event.stopPropagation();
                    });

                }

                if (dialog.autoClose) {
                    this.elements.dialog.on("click", ".CloseButton", function () {
                        dialog.hide();

                        return false;
                    });
                }
            }
        };

        dialogs[0].dialogs.add(dialog);
        dialog.init();
    };

    $.fn.getDialog = function () {
        /// <summary>
        /// Gets the dialog object for the dialog that the current element is inside.
        /// </summary>
        /// <returns type="object">The dialog object for the dialog that the current element is inside.</returns>

        var element = $(this).closest(".Dialog")[0];

        return element === undefined ? undefined : element.dialog;
    };

})(jQuery);