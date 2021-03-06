
var currentUser = whoami();

//------------------------------------

/* CHARLSTON MICROSITE JS */

//------------------------------------

function assignCharlston(targetDiv) {

	$(targetDiv).xySlider({

		titles:[
			"HIDE",																										//slide 1 -  landing/intro slide
			"slide 2<div class='nav-sub-text'>sub-text-2</div>",			//slide 2
			"slide 3<div class='nav-sub-text'>sub-text-3</div>",			//slide 3
			"slide 4<div class='nav-sub-text'>sub-text-4</div>",			//slide 4
			"slide 5<div class='nav-sub-text'>sub-text-5</div>",			//slide 5
			"slide 6<div class='nav-sub-text'>sub-text-6</div>"				//slide 6
		],

		images:[																										// bg images for these slides
			"img/slides/slide-a.jpg",
			"img/slides/slide-b.jpg",
			"img/slides/slide-c.jpg",
			"img/slides/slide-d.jpg",
			"img/slides/slide-e.jpg",
			"img/slides/slide-f.jpg"
		]

	});

	// prefix image paths
	$(targetDiv).find('img').each(function() {
		var thisSRC = checkSRC($(this).attr('src'));
		$(this).attr('src', thisSRC);
	});

	// check anchor tags
	$(targetDiv + ' a').each(function () {
		var thisHREF = checkHREF($(this).attr('href'));
		$(this).attr("href", thisHREF);																																	// update path
		if ($(this).hasClass('act')) {																																	// add click through event
			$(this).on('click', function () {
				createGAEvent(projectName, 'Click-Through', $(this).attr("href"), inSandbox);								// analytics clickthrough event
			});
		}
	});

	$('.xy-slider .xy-slider-menu').on('mouseover', '.slide-nav', function() {
		$(this).css("background-image", "url(" + prefixURL + "img/base-menu-rollover.gif)");
	});
	$('.xy-slider .xy-slider-menu').on('mouseout', '.slide-nav', function() {
		$(this).css("background-image", "none");
	});

	// analytics event - LoadModal
	//
	$(targetDiv).on('click', '.ajax-fancybox', function (event) {
		createGAEvent(projectName, "View-Item", $(this).attr('id'), inSandbox);
	});

}

//------------------------------------

// utils

//------------------------------------

function checkHREF(thisHREF){

	var response;

	if (typeof thisHREF === "undefined" ) {
		response = '';
	}
	else {

		var aHREF = thisHREF;
		var cleanHREF = ie7fix(thisHREF,'href');
		var aHASH = '';
		var arrHREF;

		if (cleanHREF.indexOf('#') == 0) {																																				// link managed via assignment
			response = aHREF;
		}
		else {
			if (cleanHREF.indexOf('http') >= 0 && cleanHREF.indexOf('exertismicro-p') < 0) {						// external link - don't alter
				response = aHREF;
			}
			else {
				if (aHREF.indexOf('fnFile=') >= 0) {																											// repair relative file link (deals with iCom interference)
					arrHREF = aHREF.split('fnFile=');
					aHREF = arrHREF[1];
					$(this).attr('href', aHREF);
				}
				var qsDelimiter = "?";
				if (aHREF.indexOf('?') >= 0) { qsDelimiter = "&"; }																				// detemin appropriate QS delimiter
				if (aHREF.indexOf('#') >= 0) { 																														// does the HREF contain a # value?
					arrHREF = aHREF.split('#');
					aHREF = arrHREF[0];
					aHASH = '#' + arrHREF[1];
				}
				response = aHREF + qsDelimiter + 'mscssid=' + currentUser.mscssid + aHASH;								// maintain session & add the session ID, append any # value
			}
		}
	}

	return response;
}

function checkSRC(thisSRC){

	var imgSRC = thisSRC;
	imgSRC = ie7fix(imgSRC,'src');	

	if (inSandbox != true) {																																			// prefix image paths -  (deals with iCom interference)
		imgSRC = replaceAll(imgSRC, '/ImagesPortal/UK/localisation/4/', '');
		imgSRC = prefixURL + imgSRC;
	}
	else {																																												// standard prefix
		imgSRC = prefixURL + imgSRC;
	}

	var response = imgSRC;
	return response;
}

function ie7fix(addr, domtype) {
	
	var cleanAddr = addr;
	var cleanHash = '';
	var arrAddr;
	
	switch (domtype){
		case 'src':		
			if (cleanAddr.indexOf(document.domain) >= 0) { 																									// fix ie7 bug - remove domain from src value
				cleanAddr = cleanAddr.replace('http://' + document.domain + '/', '');
				cleanAddr = cleanAddr.replace('https://' + document.domain + '/', '');
			}
			break;
		
		case 'href':				
			var url = document.URL;
			var arrURL = url.split('#');			
			cleanAddr = cleanAddr.replace(arrURL[0], '');
			if (cleanAddr == '##') {
				cleanAddr = cleanAddr.replace('##', '#');
			}
			break;
	}
	
	return cleanAddr;
}

//------------------------------------
//# sourceURL=charlston.js