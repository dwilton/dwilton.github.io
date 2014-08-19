$(function() {

  'use strict';

  var navigation = $('#Navigation');
  var title = $('#Title');
  var template = $('#Template');

  // Register click event for menu items
  navigation.on('click', 'a', function (e) {

    var link = $(this);

    // Prevent default browser behavior
    e.preventDefault();

    // Get template fragment
    $.ajax({ url: 'template/' + link.attr('data-template') + '.html', cache: false }).done(function (data) {

      // Update title
      title.text(link.text());

      // Update content
      template.html(data);
      
      // Create data code blocks
      $.fn.dataCodeBlock();

      // Apply code example plugin
      $('.CodeExample').codeExample();

      // Change navigation selected state
      navigation.find('li').removeClass('Selected');
      link.parent().addClass('Selected');

      // Apply UI elements to the current scope
      window.FOXTEL.uiElements(template);

      // Find all content scripts and eval
      template.find('script').each(function () {
        /*jslint evil: true */
        eval($(this).html());
      });

    });

  });

  // Simulate a click event on the first navigation item
  navigation.find('a').first().click();

});