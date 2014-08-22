(function () {
  
  'use strict';

  var FOXTEL = this.FOXTEL = {};

  FOXTEL.uiElements = function (scope) {

    // IE8 Polyfills
    if ($('html.lt-ie9').length > 0) {
      
      $.ButtonState();

      $('input[placeholder], textarea[placeholder]').placeHolder({ autoInit: true });

      // Radio / Checkbox
      if ($.fn.uniform) {
        $('input[type="radio"], input[type="checkbox"]').filter(function () {
          return !$(this).parents('fieldset').hasClass('SegmentedButtons');
        }).uniform();
      }

      // Segmented Buttons
      if ($.fn.SegmentedButtons) {
        $('.SegmentedButtons').SegmentedButtons();
      }

    }
  
    // Tabs
    $('.TabGroup').tabs();

    // Grids
    $('.Grid').Grid();

    // Tooltips
    $(document).tooltip();

    // Nano Scroller
    $('.nano').nanoScroller({
      alwaysVisible: true
    });

  };

}).call(this);

$(document).ready(function () {

  'use strict';

  window.FOXTEL.uiElements();

});