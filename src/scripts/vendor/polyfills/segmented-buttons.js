(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = "SegmentedButtons";
    var defaults = {
    };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function () {

            $(this.element).find("input:checked").next('label').addClass('Selected');

            $(this.element).find("label").click(function () {
                $(this).siblings("label").removeClass('Selected');
                $(this).addClass("Selected");
            });

        },

        refresh: function () {
            $(this.element).children("label").removeClass('Selected');
            $(this.element).find("input:checked").next('label').addClass('Selected');

        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);

jQuery(function () {
    jQuery('.SegmentedButtons').SegmentedButtons();
});