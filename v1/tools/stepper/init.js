$(document).ready(function() {

	var scrollwidth = detectScrollBar();

	function detectScrollBar() {
		// Create the measurement node
		var scrollDiv = document.createElement("div");
		scrollDiv.className = "scrollbar-measure";
		document.body.appendChild(scrollDiv);
		// Get the scrollbar width
		var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		// Delete the DIV 
		document.body.removeChild(scrollDiv);
		return scrollbarWidth;
	}

	var settings = {
		stroll: 'papercut',
		barwidth: 240,
		barheight: 40,
		imageURL: 'static.png',
		imageColor: '',
		backgroundURL: '',
		backgroundColor: '#323232',
		showscrollbars: false,
		controls: true
	}


	function getSettings() {
	  	var urlString = window.location.search.slice(1);
	  	if (urlString[urlString.length - 1] == "/") {
	  		urlString = urlString.slice(0,1);
	  	}
  		if (urlString.length > 1) {
	  		urlArray = urlString.split("&");
	  		for (var i=0;i<urlArray.length;i++) {
	  			var val = urlArray[i].split("=");
	  			var valStr = decodeURIComponent(val[1])
	  			if (typeof(settings[val[0]]) != 'undefined') {
	  				settings[val[0]] = valStr;
	  			}
	  		}
  		} 
	}

	function initData() {
		var windowwidth = $(window).width(); 
		var windowheight = $(window).height(); 
		var cols = Math.ceil(windowwidth/(settings.barwidth-scrollwidth));
		var rows = Math.ceil(windowheight/settings.barheight) + 40;
		var grid = [];
		for (var i=0; i<cols; i++) {
			var thisrow = []
			for (var j=0; j<rows; j++) {
				thisrow.push( [-i*(settings.barwidth-scrollwidth), -j*settings.barheight])
			}
			var thiscol = {x: (i*(settings.barwidth-scrollwidth)), coords: thisrow, z: 10*(i+1)};			
			grid.push(thiscol); 
		}
		return grid;
	}
		

	function populate() {
		var data = initData();
		var main = d3.select('#main').datum(data);
		var col = main.selectAll('ul')
			.data(function(d) {return d;})
			.enter().append('ul')
			.attr('class', settings.stroll)
		 	.style('left', function(d) {
		 		return d.x;
		 	})
		 	.style('width', settings.barwidth)
			.selectAll('li')
			.data( function(d) {
				return d.coords;
			})
			.enter()
			.append('li')
			.style('height', settings.barheight)
			.style('background-image', function() {
		 		return 'url("'+settings.imageURL+'")';
		 	})
			.style('background-position', function(d) {
		 		return d[0]+" "+d[1];
		 	});

		$.getScript("stroll.js", function(){
			stroll.bind( '#main ul' );
		});

	}

	function setBackgrounds(_url, _imgcol, _bgurl, _bgcol, _showss) {
		if (_url.length > 0) {
			settings.imageURL = _url;
			settings.imageColor = '';
			$('ul li').css("background-color", '');
			$('ul li').css("background-image", 'url("'+_url+'")');
		} else if (_imgcol.length > 0) {
			settings.imageURL = "";
			settings.imageColor = _imgcol;
			$('ul li').css("background-image", '');
			$('ul li').css("background-color", _imgcol);
		}

		if (_showss == true || _showss == "true") {
			var bgobj = $('body');
			$('ul').css("background-image", '');
			$('ul').css("background-color", '');
		} else {
			var bgobj = $('ul');
		}

		if (_bgurl.length > 0) {
			settings.backgroundURL = _bgurl;
			settings.backgroundColor = "";
			bgobj.css("background-image", 'url("'+_bgurl+'")');
			bgobj.css("background-color", '');
		} else if (_bgcol.length > 0) {
			settings.backgroundURL = "";
			settings.backgroundColor = _bgcol;
			bgobj.css("background-image", '');
			bgobj.css("background-color", _bgcol);
		}

		settings.showscrollbars = _showss

	}

	function displayVariables() {
		$('div.button:contains("'+settings.stroll+'")').addClass('selected');
		$('#barwidth').attr('value', settings.barwidth);
		$('#barheight').attr('value', settings.barheight);
		$('#imageURL').attr('value', settings.imageURL);
		$('#imageColor').attr('value', settings.imageColor);
		$('#backgroundURL').attr('value', settings.backgroundURL);
		$('#backgroundColor').attr('value', settings.backgroundColor);
		if (settings.showscrollbars == true || settings.showscrollbars == "true") {
			document.getElementById("showscrollbars").checked = true;
		}
	}



	// KICK IT OFF ////////////////////////////
	getSettings();	
	
	if (settings.controls == false || settings.controls == "false") {
		$('#footer').remove();
	} else {
		displayVariables();
	}
	populate();
	setBackgrounds(settings.imageURL, settings.imageColor, settings.backgroundURL, settings.backgroundColor, settings.showscrollbars)


	// BEHAVIORS ////////////////////////////

	$(window).on({
		mousemove: function(e) {
			$('#main ul').each(function(index,element) {
				var val = e.pageY / Math.abs(e.pageX - ($(element).offset().left))*100;
	 			$(element).animate({scrollTop:val}, 10);
			});
		}
	});

	if (settings.controls == true || settings.controls == "true") {

		$('#controls div').on({
			click: function(){
				settings.stroll = $(this).text().toLowerCase();
				$('ul').attr('class', settings.stroll);
				$('#controls div').removeClass('selected')
				$(this).addClass('selected');
			}
		});
		

		$('#resize').on({
			click: function(){
				settings.barwidth = parseInt($('#barwidth').val());
				settings.barheight = parseInt($('#barheight').val());
				$('#main').html('');
				populate();
			}
		});

		$('#reset').on({
			click: function(){
				var url = $('#imageURL').val();
				var imgcol = $('#imageColor').val();
				var bgurl = $('#backgroundURL').val();
				var bgcol = $('#backgroundColor').val();
			    var showss = document.getElementById("showscrollbars").checked;
				setBackgrounds(url, imgcol, bgurl, bgcol, showss);
			}
		});

		$('#getURL').on({
			click: function(){
				var urlString = window.location.origin + window.location.pathname + "?"
				urlString += ("stroll="+settings.stroll+"&");
				urlString += ("barwidth="+settings.barwidth+"&");
				urlString += ("barheight="+settings.barheight+"&");
				urlString += ("imageURL="+encodeURIComponent(settings.imageURL)+"&");
				urlString += ("imageColor="+encodeURIComponent(settings.imageColor)+"&");
				urlString += ("backgroundURL="+encodeURIComponent(settings.backgroundURL)+"&");
				urlString += ("backgroundColor="+encodeURIComponent(settings.backgroundColor)+"&");
				urlString += ("showscrollbars="+encodeURIComponent(settings.showscrollbars));
				alert(urlString);
			}
		});
	}



});

