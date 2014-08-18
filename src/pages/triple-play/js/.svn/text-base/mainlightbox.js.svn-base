function showMainLightBox(url,cssClass){
	document.getElementById("lightboxContainer").className=cssClass;
	var mainLightbox = document.getElementById('mainlightbox'); 
	if (url.indexOf('add_note') !== -1) {
		mainLightbox.className = mainLightbox.className + ' addNoteLightbox'; 
	} else if (url.indexOf('view_notes') !== -1) {
		mainLightbox.className = mainLightbox.className + ' viewNotesLightbox';
	}
	mainLightbox.style.display='block';
	document.getElementById('mainlightboxframe').src=url;
	/* below sets dynamic positioning of the lighbox based on the viewport if a certain class is used */
	invokeDynamicLightbox('#lightboxContainer', cssClass);
}

function hideMainLightBox(){
	var noteButtons = document.querySelectorAll('.noteActions');
	for(var i = 0; i < noteButtons.length; i++) {
		noteButtons[i].className = noteButtons[i].className.replace(/\bactive\b/, '');
	}
	document.getElementById('mainlightboxframe').src='';
	document.getElementById('mainlightbox').style.display='none';
	document.getElementById('mainlightbox').className='modalPage';
	var background = document.getElementById('disabledMask');
	if(background) {
		background.style.display = "none";
	}
}

function closeLightBoxOnSessionExpiry(){
	if(parent.location != window.location){
		parent.hideMainLightBox();
		parent.document.getElementById('go_to_homepage').submit();
	} 
	else {
		hideMainLightbox();
	}
}

function invokeDynamicLightbox(selector, cssClass){
	var dynamicLightbox = 'dynamicLightbox';
	if (cssClass.indexOf(dynamicLightbox) !== -1) {
		dyamicLightboxProperties(document.querySelectorAll(selector + '.' + dynamicLightbox), dynamicLightbox);
	} else {
		$(window).off('resize.' + dynamicLightbox);
		$(selector).removeAttr('style');
	}
}

function invokeDynamicLightbox(selector, cssClass){
    var dynamicLightbox = 'dynamicLightbox';

    if (cssClass.indexOf(dynamicLightbox) !== -1) {
    	dyamicLightboxProperties(document.querySelectorAll(selector + '.' + dynamicLightbox), dynamicLightbox);
    } else {
    	$(window).off('resize.' + dynamicLightbox);
    	$(selector).removeAttr('style');
    }
}
// Adding Centering Class
$.fn.centreMe = function (options) {
    var opt = {
        forceAbsolute: false,
        container: window,    // selector of element to center in
        completeHandler: null
    };
    $.extend(opt, options);
    return this.each(function (i) {
        var el = $(this);
        var jWin = $(opt.container);
        var isWin = opt.container == window;
        if (opt.forceAbsolute) {
            if (isWin)
                el.remove().appendTo("body");
            else
                el.remove().appendTo(jWin.get(0));
        }
        el.css("position", "absolute");
        var heightFudge = isWin ? 2.0 : 1.8;
        var x = (isWin ? jWin.width() : jWin.outerWidth()) / 2 - el.outerWidth() / 2;
        var y = (isWin ? jWin.height() : jWin.outerHeight()) / heightFudge - el.outerHeight() / 2;
        el.css("left", x + jWin.scrollLeft());
        el.css("top", y + jWin.scrollTop());
        if (opt.completeHandler)
            opt.completeHandler(this);
    });
}
function dyamicLightboxProperties(el, namespace){
	var viewport = $(window),
		lightbox = $(el),
		calculatePos = function(x, y) {
			return ((x - y) / 2) + 'px';
		},
		repositionLightbox = function() {
			var viewportWidth = viewport.width(),
				viewportHeight = viewport.height(),
				lightboxWidth = lightbox.width(),
				lightboxHeight = lightbox.height();
			if (viewportWidth > lightboxWidth) {
				lightbox.css('left', calculatePos(viewportWidth, lightboxWidth));
			}
			if (viewportHeight > lightboxHeight) {
				lightbox.css('top', calculatePos(viewportHeight, lightboxHeight));
			}
			lightbox.centreMe();
		};
	repositionLightbox();
	viewport.on('resize.' + namespace, function() {
		repositionLightbox();
	});
}