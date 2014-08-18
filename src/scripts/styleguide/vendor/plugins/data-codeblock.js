/*
 *  Project: dataCodeBlock
 *  Author: Dave Rupert
 *  License: WTFPL
 *
 *  Description:
 *  When documenting style guides, maintaining parity between your "living"
 *  demos and code samples can be a pain in the butt. dataCodeBlock automates that.
 *
 *  Howzzit Work?
 *  - Add the "data-codeblock" attribute to your demo markup
 *  - BINGO BANGO a code block is generated!
 *
 *  Usage Example:
 *  <ul data-codeblock="true">
 *    <li>This <code>UL</code> uses the <code>data-codeblock</code> attribute</li>
 *    <li>It targets the <code>#target-div</code> selector and appends there.</li>
 *    <li>The output generated code block removes the attribute.</li>
 *  </ul>
 */

(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function () {
  'use strict';
  // jQuery Plugin Boilerplate: https://raw.github.com/jquery-boilerplate/boilerplate/master/jquery.boilerplate.js
  (function ($, window, document, undefined) {
    $.fn.dataCodeBlock = function () {
    
      // Yoinked from Prototype.js
      var escapeHTML = function (code) {
        return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      };

      return $('[data-codeblock]').each(function () {

          var target = $(this).data('codeblock-target');
          var javascriptTemplate = $(this).data('codeblock-js');
          var html = $(this).clone().removeAttr('data-codeblock data-codeblock-target data-codeblock-js')[0].outerHTML.trim();
          var javascript = '';

          if (javascriptTemplate) {
            javascript = $('#' + javascriptTemplate).html().trim();
          }

          var codeBlock = $('<div class="CodeExample"><a href="#">Show Code Snippet</a><div class="Details"></div>');
          var htmlBlock = $('<div class="code html"><h3>HTML</h3><textarea>' + html + '</textarea></div>');
          var javascriptBlock = $('<div class="code javascript"><h3>JavaScript</h3><textarea>' + javascript + '</textarea></div></div>');
          var details = codeBlock.children('.Details');

          details.append(htmlBlock);

          if (javascript.length > 0) {
            details.append(javascriptBlock);
          }

          if (target) {
            $(target).append(codeBlock);
          } else {
            $(this).after(codeBlock);
          }

      });
    
    };
    
    // Self Execute!!
    $.fn.dataCodeBlock();
  
  })(jQuery, window, document);
 
}));