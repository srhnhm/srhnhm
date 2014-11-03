$(document).ready(function() {
	
	$('.project').hover(function() {
		$(this).toggleClass('projecthover', 300);
//		$(this).children('header h3').toggleClass('hover');  WHY WON'T THIS WORK?
	});
	
	$('button.view').click( function() {

//   VERSION 1:

		$(this).parents('.project').addClass('projectexpand');
//		$(this).parents('.project').children('.close').show();
		$(this).parents('.project').removeClass('project',10);
		$(this).text('huh?');
		$(this).removeClass('view').addClass('close');
		alert('added class close and removed view');
	
//	  VERSION 2
//		$(this).parents('.project').addClass('projectexpand2', 1000);		


	});
	
	
	
	$('button.close').click( function() {
//		$('.close').hide();
		alert('clicked close');
//		$(this).parents('.project').removeClass('projectexpand');
//		alert('projecexpand removed');
//		$(this).parents('.project').addClass('project');
//		alert('project class added');
	});	
	
	
});