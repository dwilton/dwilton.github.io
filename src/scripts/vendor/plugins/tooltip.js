(function (factory) {

  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function ($) {

  'use strict';

  (function ($, window, document, undefined) {

    // Create the defaults once
    var defaults = {
      css: 'TooltipInfo',
      content: 'data-tooltip-content',
      direction: 'top',
      directions: ['top', 'bottom', 'right', 'left'],
      delay: 500,
      offset: 10
    };

    var validation = {
      css: 'TooltipError',
      content: 'data-validation-message-result',
      direction: 'right'
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn.tooltip = function (options) {

      // Init
      this.init = function () {

        var self = this;

        // Create tooltip if it doesn't exist.
        if ($('#Tooltip').length === 0) {
          $('body').append('<div id=\'Tooltip\'><span class=\'Icon\'><span></span></span><span class=\'Content\'></span><span class=\'Arrow\'><span></span></span></div>');
        }

        self.el = $('#Tooltip');
        self.hide();

        // Mouse enter event type, most typical use.
        $(document).on('mouseenter', '[' + defaults.content + ']', function () {
          var el = $(this);
          self.timer = setTimeout(function () {
            self.update(el, defaults);
          }, defaults.delay);
        });

        $(document).on('mouseleave', '[' + defaults.content + ']', function () {
          clearTimeout(self.timer);
          self.hide();
        });

        // Focus event type, typically used for validation on input fields
        $(document).on('focus', 'input[' + validation.content + '], select[' + validation.content + '], textarea[' + validation.content + ']', function () {
          var el = $(this);
          if (el.hasClass('Invalid') && el.is(':visible')) {
            self.update(el, validation);
          }
        });

        $(document).on('blur', 'input[' + validation.content + '], select[' + validation.content + '], textarea[' + validation.content + ']', function () {
          self.hide();
        });

      };

      this.pos = function (el, direciton, opts) {

        var self = this,
            elTop = el.offset().top,
            elLeft = el.offset().left,
            elWidth = el.outerWidth(),
            elHeight = el.outerHeight(),
            tooltipWidth = self.el.outerWidth(),
            tooltipHeight = self.el.outerHeight(),
            pos = {
              top: 0,
              left: 0
            };

        // Determine direction
        switch (direciton) {

          case 'bottom':
            pos.top = (elTop + elHeight) + opts.offset;
            pos.left = (elLeft + ($(el).outerWidth() / 2)) - (self.el.outerWidth() / 2);
            break;

          case 'left':
            pos.left = (elLeft - tooltipWidth) - opts.offset;
            pos.top = (elTop + (elHeight / 2)) - (tooltipHeight / 2);
            break;

          case 'right':
            pos.left = elLeft + elWidth + opts.offset;
            pos.top = (elTop + (elHeight / 2)) - (tooltipHeight / 2);
            break;

          default:
            pos.top = (elTop - elHeight) - opts.offset;
            pos.left = (elLeft + ($(el).outerWidth() / 2)) - (self.el.outerWidth() / 2);
            break;
        }

        return pos;

      };

      this.direction = function (el, defaultDir, opts) {

        var self = this,
            windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            tooltipWidth = self.el.width(),
            tooltipHeight = self.el.height(),
            scrollTop = $(document).scrollTop(),
            scrollLeft = $(document).scrollLeft(),
            offsetTop = (windowHeight + scrollTop),
            offsetLeft = (windowWidth + scrollLeft),
            pos = el.offset(),
            dir = '';

        var directions = opts.directions;
        directions.unshift(defaultDir);

        for (var i = 0; i < directions.length; i++) {

          pos = self.pos(el, directions[i], opts);

          if (pos.left > scrollLeft && (pos.left + tooltipWidth) < offsetLeft && pos.top > scrollTop && (pos.top + tooltipHeight) < offsetTop) {
            dir = directions[i];
            break;
          }

        }

        return dir;

      };

      this.update = function (el, options) {

        var opts = $.extend({}, defaults, options),
            self = this,
            css = opts.css,
            dir,
            pos,
            defaultDir;

        // Apply css from attribute if available or use default
        if ($(el).attr('data-tooltip-class')) {
          css = $(el).attr('data-tooltip-class');
        }

        if ($(el).attr('data-tooltip-direction')) {
          defaultDir = $(el).attr('data-tooltip-direction');
        }
        else {
          defaultDir = opts.direction;
        }

        // Set content from element title attribute.
        self.el.find('.Content').html(document.createTextNode($(el).attr(opts.content)));

        // Set css Class (Note this needs to be applied to correctly determine direction and pos)
        self.el.attr('class', css);

        // Get the direction
        dir = self.direction(el, defaultDir, opts);

        // Get the position
        pos = self.pos(el, dir, opts);

        // Apply styles
        self.el.css(pos);
        self.el.attr('class', css + ' ' + dir);
        self.el.css('opacity', 1);

      };

      this.hide = function () {
        this.el.css({
          'left': '-9999em',
          'width': 'auto',
          'opacity': '0'
        });
      };

      this.init();

    };

  })(jQuery, window, document);

}));