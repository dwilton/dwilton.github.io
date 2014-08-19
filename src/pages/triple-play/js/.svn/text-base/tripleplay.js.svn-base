'use strict';

var triplePlay = {

  // Initialize methods that are required on all pages
  // Do not call ones that are page specific
  init: function () {
    triplePlay.autoFontSize();
    triplePlay.windowResize();
    triplePlay.sideNav();
  },

  // Font resize for designated elements
  autoFontSize: function () {
    $('.AccountholderName').textfill({ maxFontPixels: 38 });
    $('.DOB, .accountNo').textfill({ maxFontPixels: 16 });
    $('.fitText16').textfill({ maxFontPixels: 16, innerTag: 'abbr' });
  },

  // SideNav toggle
  sideNav: function(){
    $('#sideNav').hoverIntent(function () {
      $(this).toggleClass('expanded', 250);
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

  windowResize: function () {
    // Wait for end of Window Resize
    var windowId;
    $(window).resize(function () {
      clearTimeout(windowId);
      windowId = setTimeout(function () {
        //call Font resize function upon window resize;
        triplePlay.autoFontSize();
      }, 200);
    });
  },

  datePicker: function (el) {
    $(el).datepicker({
      showOn: 'both',
      dateFormat: 'dd/mm/yy',
      buttonImage: 'img/calendar.png',
      buttonImageOnly: true,
      prevText: '<',
      nextText: '>'
    });
  }

};

$(function () {
  triplePlay.init();
});