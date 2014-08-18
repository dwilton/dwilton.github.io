(function ($) {

  'use strict';

  var methods = {

    init: function (options) {

      var tabs = {

        // The jQuery DOM element representing the tab.
        target: $(this),

        init: function () {

          // Initializes a new instance of the tabs class.
          var targetEls = tabs.target,
            tabList;

          targetEls.each(function () {

            // Tab container element
            var tabContainer = $(this),
              tabList = tabContainer.children('div').children('ul.Tabs'),
              hasTabination = tabList.hasClass('Tabs');
          
            if(!hasTabination){
              tabList = tabContainer.children('ul.Tabs');
            }

            // Activate first tab
            tabList.children('li:first').addClass('Active');

            // Show first tab content
            tabContainer.children('.TabContent:first').addClass('Active');

            // Click event
            tabList.children('li').on('click.tabs', function (e) {

              var liEl = $(this);

              if(hasTabination){
                //Has Tabination Buttons
                tabContainer = liEl.parent().parent().parent();
                tabList = tabContainer.children('div').children('ul.Tabs').children('li');

              }
              else {
                //Doesn't have Tabination Buttons
                tabContainer = liEl.parent().parent();
                tabList = tabContainer.children('ul.Tabs').children('li');
              }
              
              // Stop default event
              e.preventDefault();

              // Remove any 'Active' class
              tabList.removeClass('Active');

              // Add 'Active' class to selected tab
              $(this).addClass('Active');

              // Hide all tab content
              tabContainer.children('.TabContent').removeClass('Active');

              // Find the href attribute value to identify the active tab + content
              var activeTab = $(this).children('a').attr('href');

              // Show active ID content
              var activeTalEl = $(activeTab).addClass('Active');

            });

          });

        }

      };

      tabs.init();
    }

  };

  $.fn.tabs = function (method) {
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