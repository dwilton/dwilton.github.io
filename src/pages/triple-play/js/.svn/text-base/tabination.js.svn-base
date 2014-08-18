$(function () {
  'use strict';
});

var tabination = {};

tabination = {


  init: function () {
    'use strict';
   
    var tabs = $('#ChangeOptionTabs li'),
		TabSpacing = 2,//inline elements have an 'invisible' 4px buffer area, because it is treated as a text by the browser. Block Elements with a float would fix the issue, but would/could cause layout issues in other places
		ContainerWidth,
		ForwardButtonsSize,
	    BackButtonsSize,
	    linksWidth,
	    tabWidth = $('.Tabs').outerWidth(true),
	    tabOffset,
		CurrentPage = 0,
		ActiveTabPosition,
		viewableArea,
		pageNumbersContained = [],
		pageCount;
	   
	var calculateTabPages = function(){
	//measure each node to find how many will fit in the container
		var currentTabWidth = 0,
			tabWidthSum = 0,
			tabWidthOnPage = 0,
			tabCount = tabs.length -1,
			tabOffset = tabs.offset().left;
		pageNumbersContained = [0];
		pageCount = 1;
		
		tabs.each(function(i){
		  var currentOffest = $(tabs[i]).offset().left;
		  if(i<tabCount){
			currentTabWidth = $(tabs[i+1]).offset().left - currentOffest;
		  }
		  else{
			currentTabWidth = $(this).outerWidth(true);	
		  }
		  
		  tabWidthSum += currentTabWidth;
		  tabWidthOnPage += currentTabWidth;
		  
		  if(tabWidthOnPage - TabSpacing > viewableArea){
			//store the position of the first tab on the page ---THIS IS WRONG... USE OFFSET OF ELEMENT TO DETERMINE WHERE TO SCROLL TO
			//store the index of the first tab on the page
			 
		      pageNumbersContained[pageCount] = i;
		      tabWidthOnPage = currentTabWidth;
		      pageCount++;
		  }
		});
		console.log(pageNumbersContained)
		ScrollToActiveTab();
		
		//set page number... initalize at page 0
		
	},
	ScrollToActiveTab = function(){
		
			//find position of active tab
			ActiveTabPosition = tabs.index($('.Active'));
			//find place where ActiveTabPosition is >=  pageNumbersContained[i] && < pageNumbersContained[i+1] OR you are currently on the last page
			
			for(var i=0; i < pageNumbersContained.length; i++)
			{
				if( (typeof pageNumbersContained[i+1] === 'undefined') ||  (ActiveTabPosition >=  pageNumbersContained[i] && ActiveTabPosition < pageNumbersContained[i+1]) )
				{
					CurrentPage = i;
					ScrollToTabPage();
					return true;
				} 
			}

	},
	enableDisableButtons = function(){
	  $('.Forward.TabButton').removeAttr('disabled');
	  $('.Back.TabButton').removeAttr('disabled');
	  if(CurrentPage === pageCount - 1)
  	  {
		  $('.Forward.TabButton').attr('disabled','disabled'); 
  	  }
	  if(CurrentPage === 0)
	  {
	 	$('.Back.TabButton').attr('disabled','disabled');
	  }
       
	},
	setVariables = function(){
	  $('.TabPagination').width(0)//set size to 0 so tab content does not change the width
	  ContainerWidth = $('.TabContainer').outerWidth(true);
	  ForwardButtonsSize = $('.Forward.TabButton').outerWidth(true);
	  BackButtonsSize = $('.Back.TabButton').outerWidth(true);
	  linksWidth = $('.ToolsContainer').outerWidth(true);
	  tabOffset = $('#ChangeOptionTabs li').offset().left;
	  viewableArea = ContainerWidth - BackButtonsSize - ForwardButtonsSize - linksWidth;

	  $('.TabPagination').width(viewableArea);

	  calculateTabPages();

	},
	ScrollToTabPage = function(){
		
		var location = $(tabs[pageNumbersContained[CurrentPage]]).offset().left - $('#ChangeOptionTabs li').offset().left;
		$('.TabPagination').animate({scrollLeft: (location)}, 800);

		enableDisableButtons();
	};
	
	$( window ).resize(function(){
		setVariables();
	});

    $('.TabButton').on('click',function(e){
    	
    	viewableArea = $('.TabPagination').outerWidth(true);
      var hiddenArea = tabWidth - viewableArea,
          scrollDirection = $(e.currentTarget).hasClass('Forward')?'Forward':'Back',
          distancePreviouslyScrolled = $('.TabPagination').scrollLeft();
     
      if(scrollDirection === 'Forward')
	  {
    	  CurrentPage++;
	  }
      else
	  {
        CurrentPage--;
	  }
      ScrollToTabPage();
    });
    
    setVariables();
  }
};
