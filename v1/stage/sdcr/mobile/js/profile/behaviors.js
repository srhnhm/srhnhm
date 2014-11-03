// $(document).ready(function() {

	function populateLoginData() {

	}

	function resizeContent() {
		var contentHeader = $('#content-header')
		var w = contentHeader.width()
		var left = $('#content-floater').width()
		
		contentHeader.css({
			'position': 'relative', 
			'display': 'block',
			'width': 'auto'
		})
		w = contentHeader.width()
		contentHeader.css({
			'width': w, 
			'position': 'fixed',
			'z-index': 10,
			'display': 'inline-block'
		})

		$('#content-body').css('height', $('body').height()-300)
		$('#content').css({
			'width': '',
			'position': "relative"
		});
		$('#content').css({
			'width': $('#content').width(),
			'position': "fixed",
			'left': left,
		});
	}


	// ON LOAD
	resizeContent();
	populateLoginData();

	// Setting the toggle state for the page in the #sidenav
	// $('#'+window.location.pathname.replace('/', '').replace('.html', '')).addClass('selected');

	// ON RESIZE
	$(window).resize(function() {
		resizeContent();
	});

	// LOGGING OUT 
	$('#logout').on("click", function() {
		// INSERT LOGOUT CODE.
	});
	

    $("select#m-nav").change(function () {
      var str = "";
      $("select option:selected").each(function () {
            str += $(this).text() + " ";
          });
      alert(str);
    })
    .trigger('change');



// });