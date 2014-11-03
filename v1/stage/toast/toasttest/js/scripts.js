/*   CREDITS: 
Ariel Flesler for the scrollTo plugin
Nick La for the scrolltoanchor tutorial: http://webdesignerwall.com/tutorials/scrollto-posts-with-jquery/
Dion Almaer for gspreadsheet : http://almaer.com/blog/gspreadsheet-javascript-helper-for-google-spreadsheets
Alex Chitu for customizing Google docs forms code : http://googlesystem.blogspot.com/2008/05/customize-google-docs-forms.html
*/




	function custommsg() {
		document.getElementById("form-message").style.display=""; 		
		document.getElementById("form-message").innerHTML="awesome.  see you at the toast expo!"; 
		document.getElementById("form-container").style.display="none";
	} 
	



$(document).ready(function(){
	

	$(function() {

		$(".scrolltoanchor").click(function() {
	        $.scrollTo($($(this).attr("href")), {
	            duration: 750
	        });
	        return false;
	    });


	});


	/* handle checkbozes*/
	$(".checklist input:checked").parent().addClass("selected");
	
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





