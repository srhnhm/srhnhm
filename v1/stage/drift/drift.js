$(document).ready(function() {


// CROSSHAIRS


crossX = $('#crosshairs').width()/2;
crossY = $('#crosshairs').height()/2;

function updateCrosshairs(x, y) {

	$('#crosshairs').css('left', x-crossX)
	$('#crosshairs').css('top', y-crossY)
}

$(document).mousemove(function(e){
  updateCrosshairs(e.pageX, e.pageY);
});


// LIST STYLES

var lists = $('li')

for (var i=0; i<lists.length; i++) {
	$(lists[i]).css('border-top-width', Math.random()*50+5)
}



// DRIFT

var timing = 5000;
// $('.column').css({
// 	'-webkit-transition-duration': timing+'ms',
// 	'-moz-transition-duration': timing+'ms', 
// 	'-o-transition-duration': timing+'ms', 
// 	'transition-duration': timing+'ms' 

// });

function drift(thiscol, speedTop, speedLeft) {


	// $('#'+id).css('top', '-='+speedTop);
	// $('#'+id).css('left', '-='+speedLeft);
	// setTimeout(function() {drift(id, speedTop, speedLeft);}, 5000); // scrolls every 100 milliseconds	drift(id, speedTop, speedLeft)


	thiscol.animate({
	    top: '-='+speedTop,
	    left: '-='+speedLeft,
	  }, 10, 'linear', function() {
	    // Animation complete.
		if ( thiscol.offset().top < -1*thiscol.height()) {
			thiscol.css('top', window.innerHeight);
		} else if (thiscol.offset().top > window.innerHeight) {
			thiscol.css('top', -1*thiscol.height());
		} else if ( thiscol.offset().left < -1*thiscol.width()) {
			thiscol.css('left', thiscol.parent('.column').width());
		} else if (thiscol.offset().left > thiscol.parent('.column').width) {
			thiscol.css('left', -1*thiscol.width());
		}

	    drift(thiscol, speedTop, speedLeft);
	  });
	



	// $('#'+id).css('top', '-='+speedTop);
	
	// if ( Math.abs($('#'+id).offset().top) >= $('#'+id).height() ) {
	// 	$('#'+id).css('top', window.innerHeight);
	// }
	// setTimeout(function() {drift(id, speedTop, speedLeft);}, 5000); 




}

var col1 = $('#col1')
var col2 = $('#col2')
var col3 = $('#col3')
var hr1 = $('#hr1')
var hr2 = $('#hr2')

drift(col1, -.2, 0);
drift(col2, -.25, 0);
drift(col3, .4, 0);
drift(hr1, .3, 0);
drift(hr2, .25, 0);









});

