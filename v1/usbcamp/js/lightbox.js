$(document).ready(function(){
		
		$(function() {
		var apiKey = '853ab6d747598ec01476c2b8fef87a75';
		var userId = '64353446@N08';
	    var perPage = '500';
	    var showOnPage = '77';

	    $.getJSON('http://api.flickr.com/services/rest/?format=json&method='+
	        'flickr.photos.search&api_key=' + apiKey + '&user_id=' + userId + 
	        '&per_page=' + perPage + '&jsoncallback=?', 
	    function(data){
	        var classShown = 'class="lightbox"';
	        var classHidden = 'class="lightbox hidden"';

	        $.each(data.photos.photo, function(i, rPhoto){
	          var basePhotoURL = 'http://farm' + rPhoto.farm + '.static.flickr.com/'
	            + rPhoto.server + '/' + rPhoto.id + '_' + rPhoto.secret;            

	            var thumbPhotoURL = basePhotoURL + '_s.jpg';
	            var mediumPhotoURL = basePhotoURL + '.jpg';

	            var photoStringStart = '<a ';
	            var photoStringEnd = 'title="' + rPhoto.title + '" href="'+ 
	                mediumPhotoURL +'"><img src="' + thumbPhotoURL + '" alt="' + 
	                rPhoto.title + '"/></a>;'                
	            var photoString = (i < showOnPage) ? 
	                photoStringStart + classShown + photoStringEnd : 
	                photoStringStart + classHidden + photoStringEnd;

	            $(photoString).appendTo("#flickr");
	        });
	        $("a.lightbox").lightBox();
	    });
	});

});






/* theusbcamp 
var apiKey = '853ab6d747598ec01476c2b8fef87a75';
var userId = '64353446@N08';
http://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&api_key=853ab6d747598ec01476c2b8fef87a75&user_id=64353446@N08&tags=sf&per_page=20&jsoncallback=?

srhnhm
var apiKey = 'e06ffcd8832bc640ce5c7d7323300287';
var userId = '35532026@N08';
http://api.flickr.com/services/rest/?format=json&method=flickr.photos.search&api_key=e06ffcd8832bc640ce5c7d7323300287&user_id=35532026@N08&tags=sf&per_page=20&jsoncallback=?

*/