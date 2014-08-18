(function ($) {
    'use strict';
    var methods = {
        init: function () {
            var codeExample = {
                /// <summary>
                /// The jQuery DOM element representing the tab.
                /// </summary>
                target: $(this),

                init: function () {
                    /// <summary>
                    /// Initializes a new instance of the codeExample class.
                    /// </summary>

                    var targetEls = codeExample.target;

                    targetEls.each(function () {

                        var containerEl = $(this);
                        var html = containerEl.find('.html textarea').get(0);
                        var javascript = containerEl.find('.javascript textarea').get(0);
                        var htmlEditor = window.CodeMirror.fromTextArea(html, { value: html, lineNumbers: true, readOnly: true });
                        
                        if (javascript) {
                          var javaScriptEditor = window.CodeMirror.fromTextArea(javascript, { value: javascript, mode: 'javascript', lineNumbers: true, readOnly: true });
                          
                        }

                        containerEl.children('a').click(function (e) {

                            var aEl = $(this),
                                containerEl = aEl.parent();

                            e.preventDefault();

                            if (containerEl.children('.Details').is(':visible')) {
                                aEl.text('Show Code Snippet');
                                containerEl.children('.Details').hide();
                            }
                            else {
                                aEl.text('Hide Code Snippet');
                                containerEl.children('.Details').show();
                            }

                            htmlEditor.refresh();

                            if (javascript) {
                              javaScriptEditor.refresh();
                            }

                        });

                    });

                }
            };

            codeExample.init();
        }
    };

    $.fn.codeExample = function (method) {
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