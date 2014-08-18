$(function () {
  'use strict';
  triplePlay.init();
  // Initialize Triple Play
});

var triplePlay = {};

triplePlay = {


  init: function () {
    'use strict';
    // Initialize methods that are required on all pages
    // Do not call ones that are page specific
    triplePlay.AutoFontSize();
    triplePlay.windowResize();
    triplePlay.sideNav();
    
    
    // Nanoscroller
  },


  // Font resize for designated elements
  AutoFontSize: function () {
    $('.AccountholderName').textfill({ maxFontPixels: 38 });
    $(".DOB, .accountNo").textfill({ maxFontPixels: 16 });
    $('.fitText16').textfill({ maxFontPixels: 16, innerTag: 'abbr' });
  },


  // SideNav toggle
  sideNav: function(){
    $('#sideNav').hoverIntent(function () {
      $(this).toggleClass('expanded', 250)
      return false;
    });
  },


  // Royal Slider, Subscription Pane Carousel 
  // Please note that autoHeight option has some conflicts with options like imageScaleMode, imageAlignCenter and autoScaleSlider
  // it's recommended to disable them when using autoHeight module
  // Usage: triplePlay.royalSlider(element)
  royalSlider: function (el) {
    $(el).royalSlider({
      autoHeight: true,
      arrowsNav: true,
      arrowsNavAutoHide: false,
      fadeinLoadedSlide: true,
      controlNavigationSpacing: 0,
      controlNavigation: 'none',
      imageScaleMode: 'none',
      imageAlignCenter: false,
      loop: false,
      loopRewind: false,
      numImagesToPreload: 10,
      keyboardNavEnabled: true,
      usePreloader: false,
      touch: false,
      sliderTouch: false,
      sliderDrag: false,
      navigateByClick: false

    });
  },


  nanoScroll: function(el) {
    $(el).nanoScroller({
      alwaysVisible: true
    });
  },

  
  windowResize: function () {
    // Wait for end of Window Resize
    var WindowId;
    $(window).resize(function () {
      clearTimeout(WindowId);
      // Call
      id = setTimeout(function () {
        //call Font resize function upon window resize;
        triplePlay.AutoFontSize();
      }, 200);
    });
    // End Resize Function
  },

  datePicker: function (el) {
    // DatePicker functions
    $(el).datepicker({
      showOn: "both",
      dateFormat: "dd/mm/yy",
      buttonImage: "img/calendar.png",
      buttonImageOnly: true,
      prevText: "<",
      nextText: ">"
    })
   // End DatePicker Functions 
  }
};





/* Currently not in use
// Simple equal heights 
$.fn.setAllToMaxHeight = function () {
  return this.height(Math.max.apply(this, $.map(this, function (e) { return $(e).height() })));
}
$(‘div.unevenheights’).setAllToMaxHeight()

// Account Profile Show/Hide Address & Security Question
$('.moreBackSlide').click(function () {
  $('.CollapsibleItem').toggleClass('shiftLeft', 500);
  $(this).fadeOut().toggleClass('active', 0).fadeIn();
  return false;
});
*/
