// $(document).ready(function() {

	function resizeContent() {
		var contentHeader = $('#content-header')
		var w = contentHeader.width()
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
			'display': 'inline-block', 
			'margin-top': 0,
		})
		$('#content-body').css('height', $('body').height()-300)
	}


	// ON LOAD
	resizeContent();
	// Setting the toggle state for the page in the #sidenav
	$('#'+window.location.pathname.replace('/', '').replace('.html', '')).addClass('selected');


	// ON RESIZE
	$(window).resize(function() {
		resizeContent();
	});



// });