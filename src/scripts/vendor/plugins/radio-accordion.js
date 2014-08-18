/// <summary>
/// radioAccordion.
/// </summary>
/// <examples>
///
///    Example of radioAccordion setup:
///        JavaScript:
///
///         $(".RadioAccordion").radioAccordion();
///
///         HTML:
///
///         <form id="radioAccordionForm" name="radioAccordion" action="radioAccordion.html">
///
///              <fieldset class="radioAccordion">
///                  <legend>Group</legend>
///
///                  <section>
///                     <input id="myRadioId1" name="myRadioName" type="radio" aria-labeledby="tab1" checked />
///                      <label for="myRadioId1">My Label</label>
///                      <div aria-labeledby="tab1" role="tabpanel">
///                         <fieldset>
///                              <legend>Child Group</legend>
///                              <div class="FormStack">
///                                  <div class="Row">
///                                      <label for="myChildField1">Child Field</label>
///                                      <input id="myChildField1" name="myChildField1" type="text" required title="test" />
///                                 </div>          
///                              </div>
///                          </fieldset>
///                      </div>
///                  </section>
///
///                  <section>
///                      <input id="myRadioId2" name="myRadioName" type="radio" aria-labeledby="tab2" />
///                      <label for="myRadioId2">My Label</label>
///                      <div aria-labeledby="tab2" role="tabpanel">
///                          <fieldset>
///                              <legend>Child Group</legend>
///                              <div class="FormStack">
///                                  <div class="Row">
///                                      <label for="myChildFie  ld2">Child Field</label>
///                                      <input id="myChildField2" name="myChildField2" type="text" required title="test" />
///                                  </div>          
///                              </div>
///                          </fieldset>
///                      </div>
///                  </section>
///
///              </fieldset>
///
///              <button type="submit">Submit</button>
///
///         </form>
///
/// </examples>

(function ($) {

    var methods = {

        init: function (options) {

            var radioAccordion = {

                /// <summary>
                /// The jQuery DOM element representing the form or form collection.
                /// </summary>
                target: $(this),

                init: function () {

                    /// <summary>
                    /// Initializes a new instance of the radioAccordion class.
                    /// </summary>

                    var targetEls = radioAccordion.target;

                    targetEls.each(function () {

                        var accordionEl, radioEls

                        // Accordion Element
                        accordionEl = $(this);

                        // Define as "aria-multiselectable"
                        accordionEl.attr('aria-multiselectable', this.accordian);

                        // Radio inputs
                        radioEls = accordionEl.children("section")
                            .children("input");

                        //  Apply selection initial setup.
                        radioAccordion.collapseAll(accordionEl);
                        radioEls.each(function () {
                            radioAccordion.expandSelected($(this));
                        });

                        // Apply selection on change event.
                        radioEls.change(function (e) {
                            radioAccordion.collapseAll(accordionEl);
                            radioAccordion.expandSelected($(e.target));
                        });

                    });

                },

                collapseAll: function () {

                    /// <summary>
                    /// Collapse "div" and add "disabled" attribute to the fieldset. 
                    /// </summary>

                    var radioAccordionEl = radioAccordion.target,
                        sectionEls = radioAccordionEl.children("section");

                    sectionEls.children("div")
                        .removeClass("Expand")
                        .addClass("Collapse")
                            .children("fieldset")
                            .attr("disabled", "disabled")
                            .attr("aria-hidden", "true");

                },

                expandSelected: function (el) {

                    /// <summary>
                    /// Expand "div" and remove "disabled" attribute to the fieldset.
                    /// </summary>
                    
                    var sectionEl = el.parent();

                    if (el.is(':checked')) {

                        sectionEl.children("div")
                            .removeClass("Collapse")
                            .addClass("Expand")
                                .children("fieldset")
                                .removeAttr("disabled")
                                .attr("aria-hidden", "false");

                    }

                }

            }

            radioAccordion.init();

        }

    };

    $.fn.radioAccordion = function (method) {

        /// <summary>
        /// Accesses radioAccordion for a jQuery element.
        /// </summary>

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method ' + method + ' does not exist on jQuery.radioAccordion');
        }

    };

})($);