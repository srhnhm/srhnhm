function createEntry(type, comments, height) {
	var entry = "";
	if (height) {
		entry += '<div class="entry" style="opacity:0"><div class="avatar imgdiv"></div><div class="content"><div class="textblock" style="height:'+height+'px"></div>';
	} else {
		entry += '<div class="entry"><div class="avatar imgdiv"></div><div class="content"><div class="textblock" style="height:'+(Math.floor(Math.random()*80)+18)+'px"></div>';	
	}

	switch(type) {
		case 0: //album		
			entry += '<div class="photo"><div class="imgdiv photo-album-main"></div></div> <div style="width:149px; float:right;"><div class="photo" style="margin-bottom:1px"><div class="imgdiv photo-album-sub"></div></div> <div class="photo"><div class="imgdiv photo-album-sub"></div></div></div>'
			break;
		case 1: //photo-portrait
			entry += '<div class="photo"><div class="imgdiv photo-portrait"></div></div>';
			break;
		case 2: //photo-landscape
			entry += '<div class="photo"><div class="imgdiv photo-landscape"></div></div>';
			break;
		case 3: //photo-instagram
			entry += '<div class="photo"><div class="imgdiv photo-instagram"></div></div>';
			break;			
		case 4: //link
			entry += '<div class="media"><div class="imgdiv link"></div></div>';			
			break;
		case 5: //video
			entry += '<div class="media"><div class="imgdiv video"></div></div>';
			break;
		case 6: //text-only
			break;
		case 7: //text-only
			break;
		case 8: //text-only
			break;
	}
	

	if (comments>1) {
		entry += '<div class="commentblock"><div style="border-top-color:#edeff4 !important; height:24px;"></div>'
		for (var j=0; j<Math.ceil(Math.random()*3); j++) {
			entry+= '<div style="height:'+(Math.ceil(Math.random()*40)+44)+'px"><div class="imgdiv commentavatar"></div></div>'
		}
		// entry+= '<div class="commentfield"><div class="imgdiv commentavatar" style="display:none;"></div><form><input name="comment" onkeypress="submitComment(event,this.form)"></input></form></div></div>';
		entry+= '<div class="commentfield"><div class="imgdiv commentavatar" style="display:none;"></div><div class="textentry"><span contenteditable="true"></span></div></div></div>';
	}

	entry += '</div></div>'
	$('div#update').after(entry)	
}

function repopulate() {
	for (var i=0; i<15; i++) {
		var type = Math.floor(Math.random()*8.9);
		var comments = Math.floor(Math.random()*4);
		createEntry(type, comments);			
	}

	$('div#wall').append('<div id="more"></div>')
}


repopulate();


// BEHAVIORS

$('#update > div.textentry > span').on({
	click: function(){
		
		$('div#update > div.textentry').css('min-height', 60);
		$('span#updatebox').css('min-height', 60);
		$('span#updatebox').css('padding-bottom', 34);
		$('div#updatebar').removeClass('hidden');
	}
});





var geoexpand = false;
$('div.updateoptions').on({
	click: function(){
		if (geoexpand == false) {
			$('div#update > div.textentry').css('height', '+=20');
			$('div#update > div.textentry > span').css('height', '+=20');
			$('div#geoexpand').removeClass('hidden')
			geoexpand = true;
		}
		
	}
});



$('#post').on({
	click: function(){
		var comment = $('span#updatebox').text().length;
		if (comment!=0) {
			var height = (Math.ceil(comment/ 60)*18);
			$('span#updatebox').html('');
			$('div#updatebar').attr('class', 'hidden');
			$('#geoexpand').attr('class', 'hidden');
			$('div#update > div.textentry').css('min-height', 30).css('height', 0);
			$('#update').after(createEntry(6, 0, height));
			$('#wall > .entry:first').delay(500).animate({
				opacity:1
			}, 500);
		}

		geoexpand = false;

	},
	mousedown: function(){
		$(this).children('div').css('background-color', '#4f699f')
	},
	mouseup: function(){
		$(this).children('div').css('background-color', 'transparent')
    }
});




$('.commentfield > div > span').on({
	click: function(){
		$(this).parents('.commentfield').addClass("active");
	}, 
	keydown: function() {
		var comment = $(this).text().length;
		if (event.which == 13) {  //"ENTER"
			var parent = $(this).parents('.commentfield');

	    	
	    	height = comment/25*18;
	    	$('<div style="height:'+height+'"><div class="imgdiv commentavatar"></div></div>').insertBefore(parent)
	    	$(this).text('');
	    	parent.removeClass("active");
	   	// } else if () { //delete key?
	   	} else {
	   		// event.preventDefault();
			// try to get this to replace all characters with unicode box?	   		
	   	}
	}

});

$('.photo').on({
	click: function(){
		$('#blackout').removeClass('hidden');
		var c = $(this).children().attr('class').split(' ');
		if (c[1] == 'photo-portrait') {

		} else if (c[1] == 'photo-instagram') {}
	}
});

$('.photo-filmstrip').on({
	click: function(){
		$('#blackout').removeClass('hidden');
		var c = $(this).children().attr('class').split(' ');
		if (c[1] == 'photo-portrait') {

		} else if (c[1] == 'photo-instagram') {}
	}
});


$('#blackout').on({
	click: function(){
		$(this).addClass('hidden');
    }
});


$('.video').on({
	click: function(){
		$(this).css({
			opacity: 0,
			width:400,
			height:300,
			marginBottom: 60,
			backgroundColor: '#ccc'
		}).delay(500)
		.animate({
				opacity: 1,
				
		}, 500);
	},
	mouseenter: function(){
	},
	mouseleave: function(){
    }
});


// NAVIGATION

$('.avatar').on({
	click: function(){
		window.open("profile.html", '_self');
	},
	mouseenter: function(){
	},
	mouseleave: function(){
    }
});

$('.commentavatar').on({
	click: function(){
		window.open("profile.html", '_self');
	},
	mouseenter: function(){
	},
	mouseleave: function(){
    }
});

$('.home').on({
	click: function(){
		window.open("index.html", '_self');
	}
});



