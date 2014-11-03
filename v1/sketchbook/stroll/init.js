var barwidth = 80;
var barheight = 20;


function initData() {
	var windowwidth = $(window).width(); 
	var windowheight = $(window).height(); 
	var cols = Math.ceil(windowwidth/barwidth);
	var rows = Math.ceil(windowheight/barheight) + 50;
	var grid = [];
	for (var i=0; i<cols; i++) {
		var thisrow = []
		for (var j=0; j<rows; j++) {
			thisrow.push( [-i*barwidth, -j*barheight])
		}
		var thiscol = {x: (i*barwidth), coords: thisrow, z: 10*(i+1)};			
		grid.push(thiscol); 
	}
	return grid;
}
	


function populate() {
	var data = initData();
	console.log(data)

	var main = d3.select('#main').datum(data);

	var col = main.selectAll('ul')
		.data(function(d) {return d;})
		.enter().append('ul')
		.attr('class', 'skew')
	 	.style('left', function(d) {
	 		return d.x;
	 	})
	 	.style('width', barwidth+15)
		.selectAll('li')
		.data( function(d) {
			return d.coords;
		})
		.enter()
		.append('li')
		.style('background-position', function(d) {
	 		return d[0]+" "+d[1];
	 	})
	 	.style('height', barheight)
}

var readyToGrow = true;

$('.skew').scroll(function() {
    if ($('.skew').height() <=  $('.skew').scrollTop() ) {
        
    }
});

populate();

$.getScript("stroll.js", function(){
	stroll.bind( '#main ul' );
});


$(window).on({
	mousemove: function(e) {
		// var windowwidth = $(window).width(); 
		// var windowheight = $(window).height(); 
		// var xpercent = e.pageX/windowwidth;
		// var ypercent = e.pageY/windowheight;		
		// scrollColumns(e.pageX, e.pageY);
		$('#main ul').each(function(index,element) {
			var val = e.pageY / Math.abs(e.pageX - ($(element).offset().left))*100;
 			$(element).animate({scrollTop:val}, 1);
	 	})

	}
});



