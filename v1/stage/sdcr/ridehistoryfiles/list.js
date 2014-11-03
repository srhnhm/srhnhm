

	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

	d3.select("#content-controls")
		.style('height', 103);


	var vis = d3.select('#vis')
	vis.html("");

	var rowheadergrid = d3.select("#rowheader div")
	
	rowheadergrid.html("")
		.style('width', '100%')

	rowheadergrid.append('div')
		.classed({'entry-date': true, 'control': true, 'text-white':true})
		.text("Date");
		
	rowheadergrid.append('div')
		.classed({'entry-time': true, 'control': true, 'text-white':true})
		.text("Time");
		
	rowheadergrid.append('div')
		.classed({'entry-name': true, 'control': true, 'text-white':true})
		.text("Rider");

	rowheadergrid.append('div')
		.classed({'entry-rating': true, 'control': true, 'text-white':true})
		.text("Rated them");
		
	rowheadergrid.append('div')
		.classed({'entry-block': true, 'control': true, 'text-white':true})

	rowheadergrid.append('div')
		.classed({'entry-pickup-dropoff': true, 'control': true, 'text-white':true})
		.text("Location");
		
	rowheadergrid.append('div')
		.classed({'entry-donation': true, 'control': true, 'text-white':true})
		.text("Donation");

	rowheadergrid.append('div')
		.classed({'entry-drivercut': true, 'control': true, 'text-white':true})
		.text("Driver's Cut");



	function drawData(visibleData) {

		var currentMonth = visibleData[0].StartMonth; // 0-indexing
		$('#daterange').text(months[currentMonth-1] + " " + visibleData[0].StartYear);

		function formatData(data) {
			var currentMonth = data[0].EndMonth;
			var formattedData = {"totals": {
				"MinutesOnJobs": 0, 
				"MinutesOnline": 0, 
				"NumRides": 0, 
				"TotalDonations": 0, 
				"TotalDriverCut": 0, 

			}, "data": []}
			for (var week = 0 ; week<data.length; week++) {
				for (var day = 0; day<7; day++) {
					if (data[week].Days[day].Month == currentMonth) {
						
						formattedData.totals["MinutesOnJobs"] += data[week].Days[day].MinutesOnJobs;
						formattedData.totals["MinutesOnline"] += data[week].Days[day].MinutesOnline;
						formattedData.totals["NumRides"] += data[week].Days[day].NumRides;
						formattedData.totals["TotalDonations"] += data[week].Days[day].TotalDonations;
						formattedData.totals["TotalDriverCut"] += data[week].Days[day].TotalDriverCut;
					
						if(data[week].Days[day].NumRides > 0) {
							for (var entry=0; entry<data[week].Days[day].RideArray.length; entry++) {
								data[week].Days[day].RideArray[entry]["Date"] = data[week].Days[day]["Date"]
								data[week].Days[day].RideArray[entry]["Month"] = data[week].Days[day]["Month"]
								data[week].Days[day].RideArray[entry]["Year"] = data[week].Days[day]["Year"]
								formattedData.data.push(data[week].Days[day].RideArray[entry])
							}
						}
					}
				}
			}
			return formattedData;
		}

		formattedData = formatData(visibleData)

		var vis = d3.selectAll('#vis')

		var monthList = vis.append('div')
			.classed('month-list', true)

		var entry = monthList.selectAll('div.listitem')
			.data(formattedData.data)
			.enter()
			.append('div')
			.attr('class', 'listitem')

		entry.append('div')
			.html(function(d){
				// console.log(d)
				return d.Month+ "/" + d.Date+ "/" + d.Year;
			})
			.classed("entry-date", true)

		entry.append('div')
			.classed("entry-time", true)
			.html(function(d){
				function checkAM(hour) {
					if (hour>12) {
						hour -= 12;
						am = "PM";
					}
					if (hour==12) {am = "PM"}
					if (hour==24) {am = "AM"}
					return am;
				}

				return d.PurchaseHour + ":" + d.PurchaseMin + " " + checkAM(d.PurchaseHour);
			})

		entry.append('div')
			.classed("entry-name", true)
			.text(function(d){
				return d.Name;
			})
			.on('click', function(d) {
				console.log(d)
				updatePopup(d, $(this));
			})

		var rating = entry.append('div')
			.classed("entry-rating", true)
		
		rating.attr('data-ratingVal', function(d){
				return d.RatingFromDriver;
			});

		rating.selectAll('span.stars')
			.data(d3.range(5))
			.enter()
			.append('span')
			.classed('stars', true)
			.text('★');
		
		rating.each(function(){
				console.log(bindStars)
				bindStars(this);
			});

		entry.append('div').classed("entry-block", true)
			.append('div')
			.classed({'block': true, 'control': true})
			.text(function(d) {
				if (d.BlockedPassenger == 0) {
					return "Block";
				} else if (d.BlockedPassenger == 1) {
					popupBlock.addClass('blocked');
					return "Blocked"
				}
			}).each(function(d) {
				bindBlocks(this);
			})

			
		entry.append('div')
			.classed("entry-pickup-dropoff", true)
			.text(function(d){
				var pickup = d.PickupAddress.split(',')[0].split(' ')
				pickup.splice(0, 1)
				var dropoff = d.DropoffAddress.split(',')[0].split(' ')
				dropoff.splice(0,1)
				return pickup.join(" ")  + " to " + dropoff.join(" ");
			})
			
		entry.append('div')
			.classed("entry-donation", true)
			.text(function(d){
				return "$" + (parseFloat(d.AmountPaid)).toFixed(2);
			})
	
		entry.append('div')
			.classed("entry-drivercut", true)
			.text(function(d){
				return "$" + (parseFloat(d.DriverCut)).toFixed(2);
			})
		
		entry.append('div')
			.classed("entry-paid", true)
			.html(function(d){
				if (d.AmountPaid == -1) {
					return "<div></div>";
				} else if (d.AmountPaid == 0) {
					return "<div></div>";
				} else {
					var percentage = (d.AmountPaid/d.SuggestedDonation - 1).toFixed(1);
					if (percentage > 0) {
						return "<div><img src='imgs/paid-complete.png'/></div><div><img src='arrow-positive.png'/></div>"+ percentage + "%";
					} else if (percentage < 0) {
						return "<div><img src='imgs/paid-complete.png'/></div><div><img src='arrow-negative.png'/></div>"+ percentage + "%";
					} else {
						return "<div><img src='imgs/paid-complete.png'/></div>";
					}
					
				}
			})


		var totals = monthList.selectAll('div.listtotals')
			.data([formattedData.totals])
			.enter()
			.append('div')
			.classed('listtotals', true)
			.classed("listitem", true)

		totals.append('div')
			.classed("entry-date", true)
			
		totals.append('div')
			.classed("entry-time", true)
			
		totals.append('div')
			.classed("entry-name", true)
			.text(function(d){
				return d.NumRides + " total rides"
			})
		
		totals.append('div')
			.classed("entry-rating", true)
			
		totals.append('div')
			.classed("entry-block", true)

		totals.append('div')
			.classed("entry-pickup-dropoff", true)
			
		totals.append('div')
			.classed("entry-donation", true)
			.text(function(d){
				return "$"+ d.TotalDonations;
			})

		totals.append('div')
			.classed("entry-drivercut", true)
			.text(function(d){
				return "$"+ d.TotalDriverCut;
			})

	}







