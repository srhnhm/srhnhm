


// PASSWORD CHANGE

$('.password-data').focus(function() {
	$('#password-message > label').text('');
});


$('#password-change').on({
	click: function(){
		console.log('hi')
		$('.password-fields').css('display', 'inline-block');
		$('#password-change').css('display', 'none');
			
	}
});

$('#password-cancel').on({
	click: function(){
		$('.password-fields').css('display', 'none');
		$('#password-change').css('display', 'inline-block');
		$('#password-message > label').text('');
	}
});

$('#password-submit').on({
	click: function(){
		var old = false;
		var length = false;
		var match = false;
		var msg = '';

		// Check that the new passwords match
		if($('#password-new-1').attr("value") == $('#password-new-2').attr("value")) {
			match = true;
		} else { msg = "Your new passwords don't match." }

		// Check that the new password is > 1
		if($('#password-new-1').attr("value").length >= 4) {
			length = true;
		} else { msg = "New password must be at least 4 characters." }

		// Check that the old password is the password
		if($('#password-old').attr("value") == "oldpassword") {
			old = true;
		} else { msg = "The old password you've typed doesn't match our records." }
		
		if (old == true && length == true && match == true) {
			msg = 'Your password has been changed.'
			$('.password-fields').delay(2000, function() {
				$(this).css('display', 'none');
				$('#password-change').css('display', 'inline-block');
			});
		}

		$('#password-message label').text(msg);
	}
});