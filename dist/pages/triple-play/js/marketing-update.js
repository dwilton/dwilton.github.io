// Check / Un-check item on click
  //If any sibling is removed, update parent icon to add
  $('ul.options li .icon').click(function(el) {
    el = $(this);
    if (el.attr("has")) {
      el.removeClass('added').addClass('removed').removeAttr('has');
      if (el.closest('li').find('li').length != 0) {
        el.closest('li').find('.icon').removeClass('added').addClass('removed').removeAttr('has');
      }
      Check(el);
    }

    else {
      el.removeClass('add removed').addClass('added').attr('has', 'true');
      if (el.closest('li').find('li').length != 0) {
        el.closest('li').find('.icon').removeClass('add removed').addClass('added').attr('has', 'true');
      }
      Check(el);
    }
  });

  // Select All 
  function selectAll(el) {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    $(el).closest('li').each(function(el) {
      el = $(this).find('span.icon');
      el.removeClass('add removed').addClass('added').attr('has', 'true');
    });
    Check(el);
  }

  // Deselect All 
  function deselectAll(el) {
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    $(el).closest('li').each(function(el) {
      el = $(this).find('span.icon');
      el.removeClass('added').addClass('removed').removeAttr('has');
    });
    Check(el);
  }

  // Check parent's siblings and set parents' status accordingly
  function Check(el) {
    n = $(el).parents('li').length -1; // Number of parent list elements
    el=$(el).closest('ul').children('li'); // Parent's Siblings

    // If all siblings are checked, select Parent(s)
    if ((el.find('.icon:not([has])').length <= 0)) {
      if(el.closest('ul').parent().siblings().find('.icon:not([has])').length <=0) {
        $(el).parents('li').find('.icon').slice(0,n).addClass('added').removeClass('add removed').attr('has', 'true');
      }
      
    }
    // If all siblings are checked, Check Parent(s)
    else if ((el.find('.icon:not([has])').length > 0)) {
      $(el).parents('li').find('.icon').slice(0,n).addClass('add').removeClass('added removed').removeAttr('has');
    }
  }