	var filepath = window.location.href.split('/')
	filepath.pop()
	filepath = filepath.join('/')
	console.log(filepath)
	var today = new Date();

	function setParamsToToday(params) {
		params["d"] = today.getDate();
		params["m"] = today.getMonth()+1; //January is 0
		params["y"] = today.getFullYear();
		return params
	}

	function setParamsToDefaultView(params) {
		params['view']='list';
		return params
	}

	function getParamsFromURL() {
		var view = window.location.search;
		var hash = window.location.hash;
		var url = "";
		var params = {};

		// need to clean up these ifs into a better flow
		if (view.length > 0) {
			url += view.replace('/', '').replace('?', '')
		}

		if (hash.length > 0) {
			hash = hash.replace('#', '')
			if (url.length > 0) {url+="&";}
			url += hash;
		}

		if (url.length > 0) {
			params = JSON.parse('{"' + decodeURI( url.replace(/&/g, "\",\"").replace(/=/g, "\":\"") ) + '"}');
			// need to make this check for proper ranges, test the view parameter...

			function testParameter(key, defaultValue) {
				if (key == 'view') {
					if (params[key].length<=0) {
						params[key] = defaultValue;
					}
				} else {
					try {
						var val = parseInt(params[key])
						if (isNaN(val) == true) {
							throw("Cannot parse params["+key+"]");
						} else {
							params[key] = parseInt(params[key]);
						}
					}
					catch(err) {
						console.log(err)
						params[key] = defaultValue;
					}				
				}
			}
			testParameter("view", "fourday")
			testParameter("d", today.getDate())
			testParameter("m", today.getMonth()+1)
			testParameter("y", today.getFullYear())
		} else {
			setParamsToToday(params);
			setParamsToDefaultView(params);
		}



		return params;
	}

	function resetParams(params, newparams) {
		for (var key in newparams) {
			if (newparams.hasOwnProperty(key)){
				params[key] = newparams[key]
			}
		}
		return params;
	}

	function encodeParamsToURL(params) {
		var urlStr = [];
		// for(var p in params)
		//    urlStr.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
		// return urlStr.join("&");
		return window.location.pathname+"?view="+params['view']+"/#d="+params['d']+"&m="+params['m']+"&y="+params['y'];
	}


	function getRelativeDate(origDate, deltaY, deltaM, deltaD) { //Amount should be negative for the past; positive for the future
		return 	new Date(origDate.getFullYear()+deltaY + Math.floor(deltaM/12), origDate.getMonth()+(deltaM%12), origDate.getDate()+deltaD)		
	}		


	function convertToAMPM(hour, min) {
		hour = parseInt(hour);
		min = parseInt(min)
		var am = "AM"
		if (hour>12) {
			hour -= 12;
			am = "PM";
		}
		if (hour==12) {am = "PM"}
		if (hour == 0 || hour==24) {
			hour = 12;
			am = "AM";
		}
		if (min<10) {
			min = "0"+min
		}
		return hour + ":" + min + " " + am;
	}

	function bindBlocks(obj) {
		var thisobj = $(obj);
		thisobj.on({
			click: function(){
				thisobj.toggleClass("blocked")
				if (thisobj.hasClass('blocked')==false) {
					// POST - block
					// UPDATE THE VIS
					thisobj.text("Unblocked")
				} else {
					// POST - unblock
					// UPDATE THE VIS
					thisobj.text("Blocked");
				}

			},
			mouseenter: function(){
				if (thisobj.hasClass('blocked')==true) {
					thisobj.text("Unblock");
				}
			},
			mouseleave: function(){
				if (thisobj.hasClass('blocked')==false) {
					thisobj.text("Block");
					thisobj.removeClass('unblockable')
				} else {
					thisobj.text("Blocked");
					thisobj.addClass('unblockable')

				}
		    }
		});
	}


	function bindStars(obj) {
		var thisobj = $(obj)
		// thisobj.on({
		// 	mouseenter: function(){
		// 		$(this).addClass('active-popup-stars');
		// 	},
		// 	mouseleave: function(){
		// 		$(this).removeClass('active-popup-stars');
		//     }
		// });
		
		thisobj.children("span")
			.each(function() {
				var ratedIndex = thisobj.attr("data-ratingVal")
				if( $(this).index() <= ratedIndex-1 ) {
					$(this).addClass('rated')
				}
			})
			// .on({
			// 	"mouseover": function() {
			// 		var specialstar = $(this)
			// 		specialstar.addClass('rated')
			// 		specialstar.prevAll('span').addClass('rated')
			// 		specialstar.nextAll('span').removeClass('rated')
						
			// 	},
			// 	"mouseout": function() {
			// 		var ratedIndex = $(this.parentNode).attr("data-ratingVal")
			// 		var specialstar = $(this).siblings('span').filter(":nth-child("+ratedIndex+")")
			// 		specialstar.addClass('rated')
			// 		specialstar.prevAll('span').addClass('rated')
			// 		specialstar.nextAll('span').removeClass('rated')
					
			// 	},
			// 	"click": function() {
			// 		var ratedIndex = $(this.parentNode).attr("data-ratingVal", $(this).index()+1)
			// 	} 
			// });
	}

	function removePopup() {
		$('#popup').css('visibility', 'hidden')
		$('#popup-overlay').css('visibility', 'hidden')
	}

	function updatePopup(d, obj) {
		$("#popup-overlay").css('visibility', 'visible')
		$('#popup').css('visibility', 'visible')

		// $('#popup-photo').css('background-image', 'url("imgs/sample-user-photo.png")')
		$('#popup-rider').text(d.Name)
		$('#popup-stars').attr('data-ratingVal', d.RatingFromDriver)

		var popupBlock = $('#popup-block > div.block')	
		popupBlock.text(function() {
				if (d.BlockedPassenger == 0) {
					return "Block";
				} else if (d.BlockedPassenger == 1) {
					popupBlock.addClass('blocked');
					return "Blocked"
				}
			}).each(function(){
				bindBlocks(this)
			})
		

		$('#popup-date').text(obj.siblings('.day-summary').find('.day-date').text())
		$('#popup-pickup-address').text(d.PickupAddress.split(",")[0])
		$('#popup-dropoff-address').text(d.DropoffAddress.split(",")[0])
		$('#popup-pickup-time').text(convertToAMPM(d.PurchaseHour, d.PurchaseMin)).addClass("floatright-time")
		$('#popup-dropoff-time').text(convertToAMPM(d.DisembarkHour, d.DisembarkMin)).addClass("floatright-time")
		// $('#popup-pickup-time').text(d.PurchaseHour+":"+d.PurchaseMin).css('width', $('#popup-pickup-time').width())
		// $('#popup-dropoff-time').text(d.DisembarkHour+":"+d.DisembarkMin).css('width', $('#popup-dropoff-time').width())

		

		$('#popup-paid').html(function(){
			amount = parseFloat(d.AmountPaid);
			if (amount == -1) {
				$('#popup-donation').text('');
				return "Not yet donated";
			} else if (amount == 0) {
				$('#popup-donation').text("$"+amount);
				return "Donated";
			} else {
				$('#popup-donation').text("$"+amount);
				var donationRatio = ((parseFloat(d.AmountPaid) - parseFloat(d.SuggestedDonation)) / parseFloat(d.SuggestedDonation))*100					
				if (d.AmountPaid <= 0) {
					return ""
				} else if (donationRatio > 0 ){
					return "Donated <img style='vertical-align:-3px' src='images/imgs/paid-complete.png'/><img src='images/imgs/arrow-positive.png'/>" + donationRatio.toFixed(1) + "%";
				} else if (donationRatio < 0 ){
					return "Donated <img style='vertical-align:-3px'src='images/imgs/paid-complete.png'/><img src='images/imgs/arrow-negative.png'/>" + donationRatio.toFixed(1) + "%";
				} else {
					return "Donated <img style='vertical-align:-3px'src='images/imgs/paid-complete.png'/>"
				}

			}
		})
		
		$('#popup-ratio').html(function(d){
			
		});
		


		bindStars($("#popup-stars"))

		$('#popup-close').on("click", function(){
			removePopup();
		});

	}
	




	// ON LOAD
	var viewParameters = getParamsFromURL();
	var cssFile = d3.select('head').append("link").attr({
			"rel": "stylesheet",
			"type": "text/css",
			"href": filepath + '/externals/info/ridehistoryfiles/'+viewParameters.view+'.css'
		})

	drawView(viewParameters);
	// resetFrame(viewParameters);
	// Setting the state for the view selection in the #toggle
	var thisViewSelector = $('#'+viewParameters.view);
	$('.view-selection').removeClass('selected');
	thisViewSelector.addClass('selected');
	// Setting the time-selection arrow values
	var thisViewSelector = $('#'+viewParameters.view);
	$('.view-selection').removeClass('selected');
	thisViewSelector.addClass('selected');




	// // CHANGING THE VIEW (page reload)
	// $('.view-selection').on("click", function() {
	// 	viewParameters = resetParams(viewParameters, {"view": $(this).attr('id')})
	// 	window.location = (encodeParamsToURL(viewParameters));
	// });


	// // CHANGING THE DATE RANGE (updating object, pushing vals to hash)
	// $('#time-selection-left').on("click", function() {
	// 	if (viewParameters.view == 'fourday') {
	// 		viewParameters.d-=1;
	// 	} else {
	// 		viewParameters.m-=1;
	// 	}
	// 	drawView(viewParameters);
	// });

	// $('#time-selection-right').on("click", function() {
	// 	if (viewParameters.view == 'fourday') {
	// 		viewParameters.d+=1;
	// 	} else {
	// 		viewParameters.m+=1;
	// 	}
	// 	drawView(viewParameters);
	// });

	// $('#time-selection-today').on("click", function() {
	// 	viewParameters = setParamsToToday(viewParameters);
	// 	drawView(viewParameters);
	// 	// resetFrame(viewParameters);
	// });

	function drawView(viewParameters) {
		$('#vis').html("<div id='loader'><img src='"+filepath+"/images/imgs/loader.gif'></div>")
		var userID = 10147;
		// var origDate = (new Date(viewParameters.y, (viewParameters.m-1), viewParameters.d))
		var origDate = (new Date(viewParameters.y, (viewParameters.m-1), 18))
		var visibleData = [];
		
		if (viewParameters.view == "fourday") {
			
			var getDayData = function(dateObj) {

				$.ajax({
					type: "GET",
					url: "data/d-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate()+"-"+dateObj.getFullYear()+".json", 
					dataType: "json",
					success: function(data) {
						
						visibleData.unshift(data) // add it to the beginnging - reverse chron
						if (visibleData.length < 4) {
							var newDateObj = getRelativeDate(dateObj, 0, 0, -1);
							getDayData(newDateObj);
						} else if (visibleData.length == 4) {
							$.getScript(filepath+"/externals/info/ridehistoryfiles/fourday.js", function() {
								drawData(visibleData);
							});
						}
					}
				});
			}

			getDayData(origDate);			
	
		} else if (viewParameters.view == "month") {
	
			$.ajax({
				type: "GET",
				url: "data/m-"+viewParameters.m+"-"+viewParameters.y+".json", 
				dataType: "json",
				success: function(data) {
					visibleData=data.Weeks
					$.getScript(filepath+'/externals/info/ridehistoryfiles/month.js', function() {
						drawData(visibleData);
					})
				}
			});
			
		} else if (viewParameters.view == "list") {
	
			$.ajax({
				type: "GET",
				url: "data/m-"+viewParameters.m+"-"+viewParameters.y+".json", 
				dataType: "json",
				success: function(data) {
					visibleData=data.Weeks
					$.getScript(filepath+'/externals/info/ridehistoryfiles/list.js', function() {
						drawData(visibleData);
					})
				}
			});
			
		}


	}







	