
/* Prevent form popup */
function custommsg() {
	event.preventDefault();
	document.getElementById("form-message").style.display=""; 		
	document.getElementById("form-message").innerHTML="<p class='basicbigtext'><strong>Awesome - see you there.  Invite anyone!</strong></p>"; 
	document.getElementById("form-container").style.display="none";
} 

$(document).ready(function() {

	/* Scroll-to functions */
	$(function() {
		$(".scrolltoanchor").click(function() {
	        $.scrollTo($($(this).attr("href")), {
	            duration: 750
	        });
	        return false;
	    });
	});


	/* handle the checkboxes */
	$(".checklist .checkbox-select").click(
		function(event) {
			event.preventDefault();
		
			$(this).parent().addClass("selected");
			$(this).parent().find(":checkbox").attr("checked","checked");
		}
	);

	$(".checklist.checkbox-select").hover(function () {
	    $(this).parent().removeClass(".");
			$(this).parent().addClass(".hover");
	  },
	  function () {
	    $(this).parent().removeClass(".hover");
	  }
	);


	$(".checklist .checkbox-deselect").click(
		function(event) {
			event.preventDefault();
			$(this).parent().removeClass("selected");
			$(this).parent().find(":checkbox").removeAttr("checked");
		}
	);





});