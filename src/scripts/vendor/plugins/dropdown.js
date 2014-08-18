/// <summary>
/// A drop down.
/// </summary>
/// <examples>
/// Example of showing a drop down:
///    HTML:
///         <div class="DropDown">
///             <button type="button" data-open="Dropdown">Open button</button>
///             <div class="DropDownList" data-position="Top Right">
///                 <div class="DropDownListHeader">
///                 <button data-close="Dropdown">on</button>
///             </div>
///             <div class="DropDownListContent">
///                 <div>content</div>
///             </div>
///         </div>

(function ($) {

    $.expr[":"].scrollable = function (element) {
        /// <summary>
        /// Gets any jQuery elements that are scrollable.
        /// </summary>
        /// <returns type="jQuery">Any jQuery elements that are scrollable.</returns>

        var overflow = $(element).css("overflow");

        return overflow !== "hidden" && overflow !== "visible";
    };

    $.fn.getPixels = function (css) {
        /// <summary>
        /// Gets a css value in pixels.
        /// </summary>
        /// <param name="css">The css value to retrieve.</param>
        /// <returns type="int">The css value in pixels.</returns>

        return parseInt(($(this).css(css) + "").slice(0, -2), 10);
    };

    var refreshHeaderPosition = function ($dropDownList, $header, $target) {
        /// <summary>
        /// Refresh the header position of the dropdownlist.
        /// </summary>
        /// <param name="$dropDownList" type="jQuery">The dropdownlist.</param>
        /// <param name="$header" type="jQuery">The header.</param>
        /// <param name="$target" type="jQuery">The target the dropdownlist is attached to.</param>

        var xPadding = $dropDownList.getPixels("padding-left") + $dropDownList.getPixels("border-left-width") + $header.getPixels("padding-left") + $header.getPixels("border-left-width");
        var yPadding = $dropDownList.getPixels("padding-top") + $dropDownList.getPixels("border-top-width") + $header.getPixels("padding-top") + $header.getPixels("border-top-width") + $target.getPixels("margin-top");

        var left = $target.offset().left - xPadding;
        var top = $target.offset().top - yPadding;
        var width = $target.outerWidth() + $header.getPixels("padding-left") + $header.getPixels("padding-right") + $header.getPixels("border-left-width") + $header.getPixels("border-right-width");
        var height = $target.outerHeight() + $header.getPixels("padding-top") + $header.getPixels("padding-bottom") + $header.getPixels("border-top-width") + $header.getPixels("border-bottom-width") + $target.getPixels("margin-top") + $target.getPixels("margin-bottom");

        $dropDownList.css({
            left: left,
            top: top
        });

        $header.css({
            width: width,
            height: height
        });
    };

    var refreshContentPosition = function ($dropDownList, $header, $content, $target) {
        /// <summary>
        /// Refresh the content position of the dropdownlist.
        /// </summary>
        /// <param name="$dropDownList" type="jQuery">The dropdownlist.</param>
        /// <param name="$header" type="jQuery">The header.</param>
        /// <param name="$target" type="jQuery">The target the dropdownlist is attached to.</param>

        var xPosition = "Right";
        var yPosition = "Bottom";

        var position = $dropDownList.attr("data-position");

        if (position !== undefined) {
            if (position.indexOf("Left") !== -1) {
                xPosition = "Left";
            }

            if (position.indexOf("Top") !== -1) {
                yPosition = "Top";
            }
        }

        if ($dropDownList.offset().top - $content.outerHeight() < 0) {
            yPosition = "Bottom";
        }
        else if ($dropDownList.offset().top + $header.outerHeight() + $content.outerHeight() > $(window).outerHeight()) {
            yPosition = "Top";
        }

        if ($dropDownList.offset().left + $header.outerWidth() - $content.outerWidth() < 0) {
            xPosition = "Right";
        }
        else if ($dropDownList.offset().left + $content.outerWidth() > $(window).outerWidth()) {
            xPosition = "Left";
        }

        var left = 0;
        var top = $header.outerHeight();

        if (xPosition === "Left") {
            left = $header.outerWidth() - $content.outerWidth();
        }

        if (yPosition === "Top") {
            top = -$content.outerHeight();
        }

        $content.css({
            top: top,
            left: left
        });

        $dropDownList
            .removeClass("Top")
            .removeClass("Left")
            .removeClass("Bottom")
            .removeClass("Right")
            .addClass(yPosition)
            .addClass(xPosition);
    };

    var refreshPosition = function () {
        /// <summary>
        /// Refreshes the position of any shown dropdownlist contents.
        /// </summary>

        $(".DropDownList.Show").each(function () {
            var $dropDownList = $(this);
            var $header = $dropDownList.children(".DropDownListHeader");
            var $content = $dropDownList.children(".DropDownListContent");
            var $target = $dropDownList[0].target;

            refreshHeaderPosition($dropDownList, $header, $target);
            refreshContentPosition($dropDownList, $header, $content, $target);
        });
    };

    var hideAll = function () {
        /// <summary>
        /// Hides all of the dropdownlists.
        /// </summary>

        $(".DropDownList.Show").each(function () {
            var $dropDownList = $(this);

            $dropDownList.removeClass("Show");
        });
    };

    $(document).on("click.dropdown", ".DropDown [data-open='Dropdown']", function () {
        // Hide all dropdownlists. Show dropdownlist. Refresh the location of shown dropdownlist.
        var $dropDown = $(this).closest(".DropDown");
        var $dropDownList = $dropDown.find(".DropDownList");
        var $target = $(this);

        hideAll();

        $dropDown[0].list = $dropDownList;
        $dropDownList[0].target = $target;
        $dropDownList[0].dropDown = $dropDown;

        $dropDownList
            .addClass("Show");

        // Refresh is called twice because the element may have gone outside the bounds of the document, and show a scrollbar. The only way I can see
        // to detect the change in document size is to attach an event when anything is attached to the DOM, which is processor intensive.
        refreshPosition();
        refreshPosition();

        $dropDownList.find("[data-close='Dropdown']").focus();

        return false;
    });

    $(document).on("click.dropdown", "[data-close='Dropdown']", function () {
        // Hide all dropdownlists.
        hideAll();

        $(this).closest(".DropDown").find("[data-open='Dropdown']").focus();
    });

    $(document).on("click.dropdown", ".DropDownList", function (e) {
        // Stop propagation of click event.
        e.stopPropagation();
    });

    $(document).on("click.dropdown", function () {
        // Hide all dropdownlists.
        hideAll();
    });

    $(window).on("resize.dropdown", function () {
        // Refresh the location of shown dropdownlist.
        refreshPosition();
    });

    $(document).on("keydown.dropdown", function (e) {
        if (e.keyCode === 27) {
            // ESC has been pressed. Hide all dropdownlists.
            hideAll();
        }
    });

    $(":scrollable").each(function () {
        $(this).on("scroll.dropdown", function () {
            // Hide all dropdownlists.
            hideAll();
        });
    });

})($);