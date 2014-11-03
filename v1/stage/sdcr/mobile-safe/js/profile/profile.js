var userData = {
	"Name": "Andreas B", 
	"Rating": "4.5", 
	"AboutMe": "I love meeting new people and getting to know the city", 
	"Hometown": "Ann Arbor, MI", 
	"Music": "Radiohead, Broken Social Scene", 
	"Movies": "", 
	"Foods": "" , 
	"Hobbies": "Programming", 
	"Quotes" : "asdf", 
	"CarName": "Knight Rider", 
	"CarMake": "Toyota", 
	"CarModel": "Prius", 
	"CarYear": "2008", 
	"CarNoDoors": "4", 
	"CarCapacity": "4",
	"PhoneNo": "1234567890", 
	"EmailAddr": "test@side.cr", 
	"AccountNo": "5555555555", 
	"RoutingNo": "1111111111", 
	"ImageURLUser":  "/images/imgs/sample-user-photo.png",
	"ImageURLCar": "/images/imgs/sample-user-car.png", 
	"ImageURLLicense":  "/images/imgs/sample-user-license.jpg",
	"ImageURLRegistration":  "",
	"ImageURLInsurance":  "",
}

function initFields(data) {
	//initializing the fields
	d3.selectAll('.profile-field')
		.datum(data)
		.each(function(d) {

			var field = $(this)
			
			try {
				var id = field.attr('id').split('-');
				var key = id[2];
				var val = d[key];
				var type = field[0].tagName;

				if (type == "INPUT") {
					field.attr('value', val)
				} else if (type == "TEXTAREA") {
					field.text(val);
				} else if (type == "IMG") {
					field.attr('src', val);
					console.log($('#profile-field-'+key).height());
					$(field).css('height', field.height())
				} else if (type == "DIV") {
					
					if (key == "Rating") {
						var percent = parseFloat(parseFloat(val)/5*$('#profile-field-Rating').width())+"px";
						console.log('found it', percent)

						//deal with the partial-star rating
						$(this).find('.stars-top').css('width', percent)

					} else {
						field.text(val);
					}
				}
			}

			catch (err) {
			}
	})

	$('input.profile-data').each(function() {
		if ($(this).attr("value").length == 0) {
			$(this).addClass('empty-input')
		}
	});
	$('textarea.profile-data').each(function() {
		if ($(this).val().length == 0) {
			$(this).addClass('empty-input')
		}
	});




	//UPDATING DATA

	function updateUserData(obj) {
		var key = $(obj).attr('id').split('-')[2];
		var val = $(obj).val();
		var changes = {"Field": key, "Value": val}
		$.ajax({
			url: "https://drive.side.cr/setField",
			data: changes,
			type: "POST",
			success: function() {
				// confirmSaved(obj)
			}
			
		});
	}


	function confirmSaved(obj) {
		$(obj).before('<label class="saved-label" style="display:inline">Saved...</label>');
		$('.saved-label').fadeOut(1000)
			.delay(1000, function() {
				$(this).remove();			
			})
		if ($(obj).attr("value").length == 0) {
			$(obj).addClass('empty-input')
		} else {
			$(obj).removeClass('empty-input')
		}
	}

	// if you hit enter :
	$('.profile-data').keyup(function (e) {
	    if (e.keyCode == 13) {
	        $(this).blur();
	    }
	}).focusout(function() {
		updateUserData(this);
		confirmSaved(this); //for testing, putting it here.
	});

}


// KICKING STUFF OFF
initFields(userData)
$('textarea').autoResize();



// UPDATING PHOTOS
$('.profile-field-image-wrapper').on({
	click: function(){
		alert('change the photo')
	},
	mouseenter: function(){
		$(this).find('.profile-field-image').css({
			'z-index': '0', 
			'opacity': '.7'
		})
	},
	mouseleave: function(){
		$(this).find('.profile-field-image').css({
			'z-index': '2',
			'opacity': 1
		})
    }
});


