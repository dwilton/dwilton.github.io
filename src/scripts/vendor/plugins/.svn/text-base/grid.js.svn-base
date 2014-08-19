(function($) {

  'use strict';

  $.fn.Grid = function(options) {

    var grids = this;

    grids.each(function () {

      var grid = $(this);
      var content = grid.children('.Content');
      var header = grid.children('.GridHeader');
      var resize;

      function init () {

        // Append overlay and loading indicator
        grid.append('<div class="Overlay" style="display: none"></div><div class="Status" style="display: none"><div class="LoadIcon"></div><div class="LoadText">Loading</div></div>');

        // Render loader if no content is present
        if (!content.html().length) {
          loader();
        }

        // Load callback
        if (options.onload !== undefined) {
          options.onload();
        }

        // Scoll end callback
        if (options.infiniteScroll !== undefined) {
          content.on('scroll', function () {
            if($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
              progresLoader(true);
              options.infiniteScroll();
            }
          });
        }

        // Sort event handlers
        sorting();

        // Offset scrollbars
        $(window).on('resize', function () {
          clearTimeout(resize);
          resize = setTimeout(offsetScrollbars, 100);
        });

        offsetScrollbars();

      }

      // Offset Scrollbars
      function offsetScrollbars () {

        if (header.length > 0) {

          var scrollbarWidth = content.width() - content.children(0).width();

          if(scrollbarWidth > 0) {
            header.css('padding-right', scrollbarWidth + 'px');
          }

        }

      }

      // Sorting
      function sorting () {
        
        if (header.length > 0 && options.sort !== undefined) {
        
          var sortables = header.find('.Sortable');

          sortables.each(function () {

            $(this).on('click', function () {

              var sortable = $(this);
              var sortBy = sortable.data('sort-by');
              var direction;

              if (sortable.hasClass('Asc')) {
                direction = 'desc';
              } else {
                direction = 'asc';
              }

              sortables.removeClass('Asc Desc');
              sortable.addClass(direction.charAt(0).toUpperCase() + direction.slice(1).toLowerCase());

              options.sort({ sortBy: sortBy, direction: direction });

            });

          });

        }

      }

      // Initial loader display
      function loader () {
        content.html('<div class="Loading"><span class="Spinner"></span>Loading</div>');
      }

      // Error
      function error (msg) {

        if (msg === undefined) {
          msg = 'Error returning results';
        }

        content.html('<div class="DataError">' + msg + '</div>');
      }

      function noResults (msg) {

        if (msg === undefined) {
          msg = 'No Results';
        }

        content.html('<div class="NoResults">' + msg + '</div>');
      }


      // progress loader display
      function progresLoader (show) {

        var status = grid.children('.Status');
        var overlay = grid.children('.Overlay');

        if(show) {
          status.show();
          overlay.show();
        }
        else {
          status.hide();
          overlay.hide();
        }

      }

      // Append content
      function append (html) {
        content.find('tbody').append(html);
        progresLoader(false);
        offsetScrollbars();
      }

      // Replace content
      function replace (html) {
        content.html(html);
      }

      // Clear content
      function clear () {
        replace('');
      }

      init();

    });

  };

})(jQuery);