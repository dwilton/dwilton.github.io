(function ($, window, document, undefined) {

  'use strict';

  var pluginName = 'Grid',
      defaults = {};

  // Plugin constructor
  function Plugin (element, options) {

    this.element = element;
    this.options = $.extend({}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;

    this.gridEl = $(this.element);
    this.contentEl = this.gridEl.children('.Content');
    this.headerEl = this.gridEl.children('.GridHeader');
    
    this.init(this.options);

  }

  Plugin.prototype = {

    /**
     * Init
     * @param  {Object} options { load: callback, scrollEnd: callback, sortBy: callback, click: callback }
     */
    init: function (options) {

      var resize;

      // Render loader if no content is present
      if (!this.contentEl.html().length) {
      
        this.displayLoader();
      
        var colgroupEl = this.headerEl.find('table colgroup').clone();
        var tableEl = $('<table/>');
        var tbodyEl = $('<tbody/>');

        this.contentEl.append(tableEl.append(colgroupEl).append(tbodyEl));
      
      }

      // On load callback
      if (options.load !== undefined) {
        this.load(options.load);
      }

      // Scoll end callback
      if (options.scrollEnd !== undefined) {
        this.scrollEnd(options.scrollEnd);
      }

      // Sort By callback
      if (options.sortBy !== undefined) {
        this.sortBy(options.sortBy);
      }

      // Click By callback
      if (options.click !== undefined) {
        this.click(options.click);
      }

      // Offset scrollbars
      $(window).on('resize', function () {
        clearTimeout(resize);
        resize = setTimeout(this.offsetScrollbars, 100);
      });

      this.offsetScrollbars();

    },

    /**
     * Load
     * @param  {Function} callback
     */
    load: function (callback) {
      callback();
    },

    /**
     * scrollEnd
     * @param  {Function} callback
     */
    scrollEnd: function (callback) {

      var self = this;

      this.contentEl.on('scroll', function () {

        var el = $(this);
      
        if(el.scrollTop() + el.innerHeight() >= this.scrollHeight) {
          self.displayProgressLoader();
          callback();
        }
      
      });

    },

    sortBy: function (callback) {
        
      if (this.headerEl.length > 0) {
      
        var sortables = this.headerEl.find('.Sortable');

        sortables.each(function () {

          $(this).on('click', function () {

            var sortable = $(this);
            var column = sortable.data('sort-by');
            var direction;

            if (sortable.hasClass('Asc')) {
              direction = 'desc';
            } else {
              direction = 'asc';
            }

            sortables.removeClass('Asc Desc');
            sortable.addClass(direction.charAt(0).toUpperCase() + direction.slice(1).toLowerCase());

            callback({ column: column, direction: direction });

          });

        });

      }

    },

    click: function (callback) {
      this.contentEl.on('click', 'tr', function () {
        callback($(this).data());
      });
    },

    /**
     * Offset Scrollbars
     */
    offsetScrollbars: function () {

      if (this.headerEl.length > 0) {

        var scrollbarWidth = this.contentEl.width() - this.contentEl.children(0).width();

        if(scrollbarWidth > 0) {
          this.headerEl.css('padding-right', scrollbarWidth + 'px');
        }

      }

    },

    displayLoader: function (content) {
      this.messageShow('loader', 'Loading', content);
    },

    displayProgressLoader: function (content) {
      this.messageShow('progressLoader', 'Loading', content);
    },

    displayError: function (content) {
      this.updateContentHTML('');
      this.messageShow('error', 'Error returning results', content);
    },

    displayNoResults: function (content) {
      this.updateContentHTML('');
      this.messageShow('noResults', 'No Results', content);
    },

    /**
     * Append grid content html (used in infinite scroll)
     * @param  {string} html
     */
    appendContentHTML: function (html) {
      this.contentEl.find('tbody').append(html);
      this.messageHide();
      this.offsetScrollbars();
    },

    /**
     * Update grid content html (used when paging)
     * @param  {[type]} html [description]
     * @return {[type]}      [description]
     */
    updateContentHTML: function (html) {
      this.contentEl.find('tbody').html(html);
      this.messageHide();
      this.offsetScrollbars();
    },

    /**
     * Message Inferface
     * @param  {string} Message type
     * @param  {string} Default message content
     * @param  {string} Custom message content
     */
    messageShow: function (type, defaultContent, content) {

      if (this.gridEl.children('.Message').length === 0) {
        this.gridEl.append('<div class="Message" style="display: none"><div class="Overlay"></div><div class="Template"></div></div>');
      }

      var messageEl = this.gridEl.children('.Message');
      var contentEl = messageEl.children('.Template');

      if (content === undefined) {
        content = defaultContent;
      }

      switch (type) {
        case 'loader':
          contentEl.html('<div class="Loading"><span class="Spinner"></span>' + content + '</div>');
          break;

        case 'progressLoader':
          contentEl.html('<div class="Status"><div class="LoadIcon"></div><div class="LoadText">' + content + '</div></div>');
          break;

        case 'noResults':
          contentEl.html('<div class="NoResults">' + content + '</div>');
          break;
        
        case 'error':
          contentEl.html('<div class="DataError">' + content + '</div>');
          break;

        case 'clear':
          contentEl.html('');
          break;
      }

      messageEl.show();

    },

    messageHide: function () {
      this.gridEl.children('.Message').hide();
    }

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function (options) {
    return this.each(function () {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName,
        new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);