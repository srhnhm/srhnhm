$(document).ready(function(){
	
	//Mouseover Change
	
	$("img.button").hover(function() { 			
		$(this).toggleClass("navOn");
	});
		
	$("img.button").hover(
		function(){
	  this.src = this.src.replace("_off","_on");}, 
		function() {
	  this.src = this.src.replace("_on","_off");
	});
	
	
	// Buttons to reveal "content" divs
	
	$("div.nav").click(function(event){
		event.preventDefault();
		$("#design_content").removeClass("designShow");
		$("#photos_content").removeClass("photosShow");
		$("#design_content").addClass("designHide");
		$("#photos_content").addClass("photosHide");
		$(".main").animate({width:400}, 600);
		$("div.nav").not(this).siblings(".content").slideUp("slow");
		$(this).siblings(".content").slideToggle("slow");
	});
	
	//Slide over and reveal Col2

	$("div#design").click(function(event){						
		$("div.nav").siblings(".content").slideUp("slow");		
		$("#photos_content").removeClass("photosShow");		
		$("#photos_content").addClass("photosHide");
		$(".main").animate({width:1200}, 600, function() { 
		
			$("#design_content").toggleClass("designHide");
			$("#design_content").toggleClass("designShow");
		});
	});
	
	$("div#photos").click(function(event){						
		$("div.nav").siblings(".content").slideUp("slow");	
		$("#design_content").removeClass("designShow");
		$("#design_content").addClass("designHide");
		$(".main").animate({width:1200}, 600, function() { 
			$("#photos_content").toggleClass("photosHide");
			$("#photos_content").toggleClass("photosShow");
		});
	});


	// Buttons to reveal footer divs

	$("#about").click(function(event){
		event.preventDefault();
		$("#contact_content").hide("slow");
		$("#about_content").slideToggle("slow");
	});
	$("#contact").click(function(event){
		event.preventDefault();
		$("#about_content").hide("slow");
		$("#contact_content").slideToggle("slow");
	});



});