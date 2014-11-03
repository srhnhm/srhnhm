	console.log('opened 4day')

	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
	var days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

	var timeScale = d3.scale.linear()
	 	.domain([0,24])
	 	.range([2,65]);


	d3.select('#rowheader').style({
		"background-color": "transparent",
		"border-color": "transparent", 
		'width':'100%', 
		'display': 'inline-block'
	})


	var vis = d3.selectAll('#vis')
	vis.html('');

	var graphWrapper = vis.append("div")
		.attr("id", 'graph-wrapper')

	var graph = vis.append('div')
		.attr('id', 'graph')



	graphWrapper.append('div')
		.attr('id', 'y-axis')
		.selectAll('div.y-axis-label')
		.data(d3.range(3, 25, 3))
		.enter()
		.append('div')
		.attr('class', 'y-axis-label')
		.html(function(d){
			if (d==12 || d==24){
				return "12"
			}
			return convertToAMPM(d, 0).replace(":00", '').replace("M", "")
		})
		.style('top', function(d){
			return timeScale(d)+"%"
		})
		.classed('control', 'true')

	var graphBG = graphWrapper.append('div')
		.attr('id', 'graph-background')
		
	graphBG.selectAll('div.y-axis-lines')
		.data(d3.range(3, 25, 3))
		.enter()
		.append('div')
		.attr('class', 'y-axis-lines')
		.style('top', function(d){
			return timeScale(d)+"%"
		})

	graphBG.append('div')
		.attr('id', 'summary-bar')
		.style({'top': '75%', 'height':'25%'})



function drawData(visibleData) {
	var first = visibleData[0]
	var last = visibleData[visibleData.length-1];
	// can probably improve this to say "September 30 - October 2, 2012"
	var monthStart = first.Month
	var monthEnd = last.Month
	if (monthStart == monthEnd) {
		$('#daterange').text(months[monthStart-1]+ " " +first.Date+" - "+last.Date+", "+first.Year );
	
	} else {
		if (monthEnd == 1) {
			$('#daterange').text(months[monthStart-1]+" "+first.Date+", "+first.Year+" - "+months[monthEnd-1]+" "+last.Date+", "+last.Year);
		} else {
			$('#daterange').text(months[monthStart-1]+ " " +first.Date+" - "+months[monthEnd-1]+ " " +last.Date+", "+first.Year );
		}
	}
	
	// To accomodate for the window-dependent width of the graph
	
	// var graphHeight = parseInt(vis.style('height'))
	// var graphWidth = parseInt(vis.style('width'))- yaxisWidth-yaxisPadding;
	// var columnWidth = (graphWidth)/4;

	var horizScale = d3.scale.linear()
		.domain([0,6])
		// .range([0, graphWidth*1.5]);
		.range([0, 100*1.5])

	// graph.style({
	// 	"height": graphHeight,
	// 	"width": graphWidth,
	// 	"position": "absolute",
	// 	"top": "0px",
	// 	"left": "90px",
		// 'overflow': 'hidden'
	// })

	// Begin
	graph.html('');

	var newdays = graph.selectAll('div.day')
		.data(visibleData, function(d){return d;})

	newdays.enter()
		.append('div')
		.classed('day', true)


	newdays.exit()
		.remove()

	newdays.style({
		'left': function(d, i){return (horizScale(i))+"%"}, 
		})
		

	var summary = newdays.selectAll('div.day-summary')
		.data(function(d) {return [d]})
		.enter()
		.append('div')
		.classed('day-summary',true)
	
	summary.append('div')
		.classed('day-date',true)
		.classed('control', true)
		.html(function(d) {
			return "<span>"+days[d.DayOfWeek]+"</span><span>"+d.Month+"/"+d.Date+"/"+d.Year.toString().charAt(2)+d.Year.toString().charAt(3)+"</span>";
		})
	summary.append('div')
		.classed('day-donation-total',true)
		.classed('data-xl', true)
		.text(function(d) {
			return "$"+d.TotalDonations;
		})
	summary.append('div')
		.classed('day-hourly-wage',true)
		.classed('data-label', true)
		.text(function(d) {
			return "$"+d.HourlyRate+"/hr";
		})

	// var rideblocks = newdays.selectAll('div.timeblock')
	// 	.data(function(d){return d.TimeBlocks;})
	// 	.enter()
	// 	.append('div')
	// 	.classed('timeblock', true)
	// 	.style('height', function(d){
	// 		return (timeScale(d.StartHour + (d.StartMin/60)) - timeScale(d.EndHour + (d.EndMin/60)))+"%";
	// 	})
	// 	.style('top', function(d){
	// 		return timeScale(d.StartHour + (d.StartMin/60))+"%";
	// 	})

	var rides = newdays.selectAll('div.ride')
		.data(function(d){return d.RideArray;})
		.enter()
		.append('div')
		.classed('ride', true)
		.style('height', function(d) {
			return timeScale((d.DisembarkHour + (d.DisembarkMin/60))) - timeScale(d.PurchaseHour + (d.PurchaseMin/60))+"%";
		})
		.style('top', function(d) {
			return timeScale(d.PurchaseHour + (d.PurchaseMin/60))+"%";
		})

		// Mouseover Behaviors -- surfacing the data on indiv rides 
		rides.on({
				'mouseover': function(d) {
					d3.select(this).classed('selected-ride', true)
					updateRollover(d, $(this));	
				},
				'mouseout': function(){
					d3.select(this).classed('selected-ride', false)
					removeRollover();
				}, 
				'click': function(d) {
					updatePopup(d, $(this));
				}
			});

	$('.day').on({
		"mouseenter": function(){
			$('.selected-day').removeClass('selected-day');
			$(this).addClass('selected-day');
		}
	});

}


function updateRollover(d, obj) {
	var string = ""+ d.Name + " " + "$"+d.AmountPaid + " " + d.PickupAddress + " " +  d.DropoffAddress
	var objleft = obj.offset().left
	var objcenter = obj.offset().left + obj.width()/2
	$('#rollover').css({
		'visibility': 'visible',
		'top': obj.offset().top - $(window).scrollTop(),
		'left': objcenter
	})
	$('#rollover-rider').text(d.Name)
	$('#rollover-donation').text( function() {
		if (d.AmountPaid > 0) {
			return "$"+d.AmountPaid;
		} else {
			return ""
		}
	})
	$('#rollover-time').text(
		convertToAMPM(d.PurchaseHour, d.PurchaseMin)
	).css('width', "80px")
	// $('#rollover-time').text(d.PurchaseHour + ":" + d.PurchaseMin).css('width', $('#rollover-time').width())
}

function removeRollover(){
	$('#rollover').css('visibility', 'hidden');
}










