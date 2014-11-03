
$(document).ready(function() {

	var totalFrames = 60;
	var filmstripStem = "images/woman_";
	var spacing = 10;
	var filmstripString = "";	



	
	var sliding = function () {
		var currentPosition = parseInt($("div.filmstrip").css("left"));
		if (-currentPosition >= hardStop) {
			$("div.filmstrip").css("left", "0px");

			sliding();
		}
		
		else {	
			$("div.filmstrip").animate({
				left:"-=120",
			}, 10, sliding
			);
		}
	}

	
	for (i=1; i<=totalFrames; i++) {
		filmstripString = '<img class=\'strip\' src=\'' + filmstripStem + i + '.png\'></img>';
		$("div.filmstrip").append(filmstripString);
	
		if (i==60) {
			
			var filmstripSpacing = parseInt($("img.strip").css("margin-left"));
			var imageWidth = parseInt($("img.strip").css("width"));
			var newWidth = totalFrames*(imageWidth+filmstripSpacing);
			$("div.filmstrip").css("width", newWidth+"px");
			var hardStop = newWidth - $(window).width();
			
			sliding();
		}
	};



	
	









});