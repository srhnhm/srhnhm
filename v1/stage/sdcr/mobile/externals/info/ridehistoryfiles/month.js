
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

	var maxBarHeight = 80;
	var minBarHeight = 2;
	var maxEarnings = 200;
	var heightMultiplier = d3.scale.linear()
		.domain([0,maxEarnings])
	 	.range([minBarHeight,maxBarHeight])

// PUT INTO HTML ////////////////////////////

	var vis = d3.select('#vis')
	vis.html("");

	var rowheadergrid = d3.select("#rowheader div")
	rowheadergrid.html("")

	rowheadergrid.append('div')
		.classed('grid-wrapper-left', true)

	rowheadergrid.append('div')
		.classed('grid-wrapper-right', true)
		.selectAll('div.week-grid')
		.data(days)
		.enter()
		.append('div')
		.classed({'week-grid': true, 'control': true, 'text-white':true})
		.text(function(d){return d;})



// ////////////////////////////

	

	function drawData(visibleData) {

		var currentMonth = visibleData[1].StartMonth; // 1-indexed
		$('#daterange').text(months[currentMonth-1] + " " + visibleData[0].StartYear);


		var newweeks = vis.selectAll('div.week-entry')
			.data(visibleData)
			.enter()
			.append('div')
			.style('height', $('.week-entry').css('min-height'))
			.classed('week-entry', true)
			.style('height', $('.week-entry').height());
			
		newweeks.each(function(d, i){
				// interate over the days array to get sums
				// to display later
				var totalRides = 0;
				var totalDonations = 0;
				var totalMinutesOnline = 0;
				var totalMinutesOnJobs = 0;

				for (var day=0; day<d.Days.length; day++) {
					totalRides += d.Days[day].NumRides;
					totalDonations += d.Days[day].TotalDonations;
					totalMinutesOnline += d.Days[day].MinutesOnline;
					totalMinutesOnJobs += d.Days[day].MinutesOnJobs;

				}
				visibleData[i].TotalRides = totalRides;
				visibleData[i].TotalDonations = totalDonations;
				visibleData[i].TotalMinutesOnline = totalMinutesOnline;
				visibleData[i].TotalMinutesOnJobs = totalMinutesOnJobs;

			})

		newweeks.append('div')
			.classed('week-entry-line', true)

		var weekLeft = newweeks.append('div')
			.classed('grid-wrapper-left', true)

		weekLeft.append('div')
			.classed({'total-rides': true, "week-grid-upper": true, "data-large": true})
			.text(function(d){
				return d.TotalRides + " rides";
			})
		weekLeft.append('div')
			.classed({'total-donations': true, "week-grid-upper": true, "data-small": true})			
			.text(function(d){
				if (d.TotalDonations == 0) {
					return "";
				} else {
					return "$"+d.TotalDonations;
				}
			})	
		weekLeft.append('div')
			.classed({'total-timedriving': true, "week-grid-upper": true, "data-small": true})
			.text(function(d){
				var hrs = (d.TotalMinutesOnJobs/60).toFixed(1)
				if (hrs > 0) {return hrs + " hours driving";}
				else {return ""}
			})		
		weekLeft.append('div')
			.classed({'total-dates': true, 'week-grid-lower': true, 'control': true})
			.text(function(d){
				return d.StartMonth + "/"+ d.StartDate +" - "+ d.EndMonth+"/"+d.EndDate;
			})




		var weekRight = newweeks.append('div')
			.classed('grid-wrapper-right', true)

		var day = weekRight.selectAll('div.day')
			.data(function(d){return d.Days})
			.enter()
			.append('div')
			.classed('week-grid', true)
			.classed('day', true)
		
		day.each(function(d){
			if (d.Month != currentMonth) {
				d3.select(this).classed('other-month', true)
			}
		})


		day.append('div')
			.classed('daily-bar', true)
			.each(function(d) {
				console.log(heightMultiplier(d.TotalDonations), maxBarHeight)
			})
			.style('height', function(d){
				var barheight = heightMultiplier(d.TotalDonations)
				if (barheight>maxBarHeight) {
					barheight = maxBarHeight;
					d3.select(this).classed('maxbar', true)
				}
				if (barheight == 0) {
					barheight = minBarHeight;
					d3.select(this).classed('minbar', true)
				}
				return barheight+"px";
			})

		day.append('div')
			.classed({'daily-label': true, 'week-grid-lower':true, 'data-label':true})
			.text(function(d){
				if (d.TotalDonations == 0) {
					return ""
				} else {
					return "$"+d.TotalDonations;
				}
			})
	}


	function refreshData(buttonID) {
		console.log(buttonID)
		if (buttonID == "timecontrol-right") {
	 		//   <-----  shows more future
 			// visibleData.push(fetchedDataFuture); 
	  		// visibleData.splice(0,1);
		}
		else if (buttonID == "timecontrol-left") {
			//   ------>
		    var visibleData = $.ajax({
				type: "GET",
				url: "monthpast.json",
				dataType: "json", 
				success: function(data) {
					// visibleData = data.Weeks;
					drawData(data.Weeks);
				}
			});
		} 
		else if (buttonID == "timecontrol-today") {
		}

	}









