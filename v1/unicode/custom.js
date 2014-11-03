	var canvas = $('div#canvas');
	var params = {
		fs: 40,
		c: ['black', 'darkgray', 'gray', 'lightgray', 'white'],
		d: 0,
		u: [9700, 9701, 9698, 9699]
	};

	var url = '';


	$('.char').each(function() {
		$(this).attr('id', 'u_'+$(this).text().charCodeAt(0));
	})

	$('.colorpalette').each(function() {
		var colors = $(this).text();
		colorsArray = colors.split(" ");
		$(this).text('').attr('title', colors);
		var percent = 100/colorsArray.length;
		for (var i = 0; i < colorsArray.length; i ++) {
			$(this).append('<div style="background-color:'+colorsArray[i]+'; width:'+percent+'%"></div>')
		}
	})
	
	function getParameters() {
	  	var urlString = window.location.search.substring(1);
  		urlArray = urlString.split("&");
  		for (var i=0;i<urlArray.length;i++) {
  			var val = urlArray[i].split("=");
  			params[val[0]] = val[1];
  		}
	}

	function populate(params) {
		canvas.html('');

		var c = params.c;
		var fs = parseInt(params.fs);
		var d = (parseInt(params.d)*fs*.3)+fs;
		var u = params.u;

		var w = parseInt($(canvas).css('width'));
		var h = parseInt($(canvas).css('height'));
		var rows = h/fs;
		var columns = w/fs;

		var blanks = '';
		var chars = []

		for (var j=0; j<u.length; j++){
			var thisChar = $('#legend').children('#u_'+u[j])
			chars.push( thisChar.text() );
			$(thisChar).addClass('selected');
		}

		function randomColor() {
			return c[Math.floor(Math.random()*c.length)];
		}

		for (var i=0; i<(rows/2); i++) {
			for (var j=0; j<columns; j++) {
				blanks += '<span class="unicode" style="background-color: '+randomColor()+'; color: '+randomColor()+'; font-size: '+d+'; line-height: 1em">'+chars[Math.floor(Math.random()*chars.length)]+'</span>';
				blanks += '<span class="unicode" style="background-color: '+randomColor()+'; color: '+randomColor()+'; font-size: '+fs+'; line-height: 1em">'+chars[Math.floor(Math.random()*chars.length)]+'</span>';
			}
		}
		
		canvas.append(blanks);

		$('#size').attr('value', params.fs+'px');
		$('#distortion').attr('value', params.d);
	}

	getParameters();
	populate(params);





/////***** ********//////
$(document).ready(function() {
	
	$(window).resize(function() {
		populate(params);		
	});

	$('#reset').on({
		click: function(){
			params.fs = parseInt($('#size').val());
			params.d = parseInt($('#distortion').val());
			console.log(params);
			populate(params);
		}
	});

	$('.colorpalette').on({
		click: function(){
			$('.colorpalette').removeClass('selected');
			$(this).addClass('selected');
			cString = $(this).attr('title');
			c = cString.split(" ");
			params.c = c;
		}
	});
	
	$('div.char').on({

		click: function(){
			var id = $(this).attr('id').substring(2);
			if( $(this).hasClass('selected') ) {
				$(this).removeClass('selected');
				params.u.splice(params.u.indexOf(id), 1);
			} else {
				$(this).addClass('selected');
				params.u.push(id)
			}
			console.log(params.u);
		}


	});


    // $("input").keyup(function () {
    //   var value = $(this).val();
    //   $("p").text(value);
    // }).keyup();


});
