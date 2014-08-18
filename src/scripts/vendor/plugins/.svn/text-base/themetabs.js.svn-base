(function ($) {
    var methods = {
        init: function (options) {
            var themeTabs = {
                /// <summary>
                /// The jQuery DOM element representing the tab.
                /// </summary>
                target: $(this),

                init: function () {
                    /// <summary>
                    /// Initializes a new instance of the tabs class.
                    /// </summary>

                    var targetEls = themeTabs.target;

                    targetEls.each(function () {

                        // Tab container element
                        var tabContainer = $(this);

                        // Activate first tab
                        tabContainer.children("ul.Tabs").children("li:first").addClass("Active");

                        // Show first tab content
                        tabContainer.children(".TabContent").addClass(tabContainer.children("ul.Tabs li:first a").attr("data-theme"));

                        // Click event
                        tabContainer.children("ul.Tabs").children("li").click(function () {

                            var liEl = $(this),
                                tabContainer = liEl.parent().parent(),
                                themeName = liEl.children("a").attr("data-theme");

                            // Remove any "Active" class
                            tabContainer.children("ul.Tabs").children("li").removeClass("Active");

                            // Add "Active" class to selected tab
                            liEl.addClass("Active");

                            // Reset Classes
                            tabContainer.children(".TabContent").attr("class", "TabContent Active");

                            // Show active ID content
                            tabContainer.children(".TabContent").addClass(themeName);

                            return false;
                        });

                    });

                }

            };

            themeTabs.init();
        }
    };

    $.fn.themeTabs = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }
    };

})($);