// ///////////////////////////////////////

var dummydata2 = [
	{
		"data": [{	
			"value": 121, 
			"source": "all", 
			"color": "transparent",
			"innerrad": 0,
			"outerrad": 50,
			
		}], 
		"centertext": "121",
		"subtext": "total editors"
	},
	{
		"data": [{	
			"value": 55, 
			"source": "logged-in", 
			"color": "#96BBFB",
			"innerrad": 50,
			"outerrad": 80
		},{
			"value": 45, 
			"source": "anonymous", 
			"color": "#FABE78",
			"innerrad": 50,
			"outerrad": 80
		
		}]
	},

	{
		"data": [{
			"value": 40,
			"source": "logged-in",
			"color": "#508DF8",
			"innerrad": 80,
			"outerrad": 90
		},{
			"value": 60, 
			"source": "anonymous", 
			"color": "#F7931E",
			"innerrad": 80,
			"outerrad": 90
		}]
	}
]


var arc2 = d3.svg.arc()
    .outerRadius(function(d) {return d.data.outerrad})
    .innerRadius(function(d) {return d.data.innerrad});

var pie = d3.layout.pie()
	.value(function(d) { 
    	return d.value; 
    })
    .sort(null);

var allPies2 = d3.select("svg#editors2")
	.data([dummydata2])

var onionring = allPies2.selectAll('g.onionring')
   	.data(function(d) {
   		return d;
   	})                     
    .enter()                            
    .append("svg:g")                
    .attr("class", "onionring")

var arcs2 = onionring.selectAll('g.slice2')
   	.data(function(d) {
   		return pie(d.data)
   	})                     
    .enter()                            
    .append("svg:g")                
    .attr("class", "slice2")
    .attr('transform', function(d, i) {
		return 'translate('+($('svg#editors2').width()/2)+','+($('svg#editors2').height()/2)+')'
	});    //allow us to style things in the slices (like text)

arcs2.append("svg:path")
    .attr("fill", function(d, i) {
    	return d.data.color;	
    })
    .attr("d", arc2)
    .attr("stroke", "#F2F2F2")
    .attr("stroke-width", "4px");

onionring.each(function(d, i){	
    	if (d.centertext) {
    		d3.select(this).append('text')
    			.text(d.centertext)
    			.attr('text-anchor', 'middle')
    			.attr('dx', ($('svg#editors2').width()/2))
    			.attr('dy', ($('svg#editors2').height()/2))
    			.attr('class', 'stat');
    	}
    	if (d.subtext) {
    		d3.select(this).append('text')
    			.text(d.subtext)
    			.attr('text-anchor', 'middle')
    			.attr('dx', ($('svg#editors2').width()/2))
    			.attr('dy', ($('svg#editors2').height()/2)+15)
    			.attr('class', 'key');
    	}
    })




///////////////////////////////////////////


var citationsample = [
	{
		"title": "References",
		"values": [7, 5, 3, 4.5, 6] //good, ok, poor, average, observed
	},
	{
		"title": "External Links",
		"values": [9, 7, 4, 6.5, 6] //good, ok, poor, average, observed
	},
	{
		"title": "Internal Links",
		"values": [5, 4, 2, 3.5, 6] //good, ok, poor, average, observed
	}
]

var typeheight = 40;
var end = 180;
var barheight = 20;
var maxbar = 10;
var barcolors = [{"height": barheight, "label": 'Great'},  {"height": barheight, "label": 'Good'}, {"height": barheight, "label": 'Poor'}, {"height": barheight*7/8, "width":3, "label": "Average"}, {"height": barheight/2, "label": "Observed"}]
var xoffset = 90;

var citations = d3.select('#citations').data([citationsample])
var citType = citations.selectAll('g.type')
	.data(function(d){return d;})
	.enter()
	.append('g')
	.attr('class', 'type')
	.attr('transform', function(d, i) {
		return 'translate('+xoffset+', '+(i*typeheight)+')'
	})


var bars = citType.append('g')
	.attr('class', 'bars')
	.attr('transform', 'translate('+10+', 0)')

var label = citType.append('text')
	.text(function(d) {return d.title})
	.attr('class', 'label')
	.attr('text-anchor', 'end')
	.attr('dy', '1.5em')

var barscale = d3.scale.linear()
	.domain([0, 10])
	.range([0, end])

var contextbars = bars.selectAll('rect.bar')
	.data(function(d) {
		return d.values;
	})
	.enter()
	.append('rect')
	.attr('class', function(d, i) {
		return 'bar '+barcolors[i]['label'].toLowerCase()
	})
	.attr('height', function(d, i) {
		return barcolors[i]['height']
	})
	.attr('width', function(d, i) {
		if (barcolors[i]['width']) {return barcolors[i]['width']}
		else {return barscale(d/maxbar*10);}
	})
	.attr('transform', function(d, i){
		if (barcolors[i]['width']) {var xtrans = barscale(d)}
		else {var xtrans=0}
		return 'translate('+xtrans+', '+ (barheight-barcolors[i]['height'])/2 +')';
	})



var axis = d3.svg.axis()
	.scale(barscale)
	.orient("top")
	.ticks(3)
	.tickSubdivide(4)
	.tickPadding(-20);

var citations_axis = citations.append("g")
	.attr('class', 'axis')
    .attr("transform", "translate("+(xoffset+10)+","+(3*typeheight)+")")
    .call(axis.tickSize(5,5,10));


var legendentry = d3.select('#citations_legend')
	.selectAll('li')
	.data(barcolors)
	.enter().append('li')
	
legendentry.append('div')
	.attr('class', function(d) {
		return 'swatch '+d.label.toLowerCase()
	})
	.style('width', function(d){
		if (d.width) {return d.width}
		else {}
	})
	.style('margin-right', function(d){
		if (d.width) {return ( $('.swatch').width() + parseInt($('.swatch').css("margin-right") ) ) - d.width }
		else {}
	})

legendentry.append('span')
	.attr('class', 'key')
	.text(function(d){
		return d.label
	})
	

////////////////////////////////////////

var revhistorydata = []
var average_total = 0;
var average_reverts = 0;
var count = 0;
for (var y=0; y<5; y++) {
	emptyarr = []
	revhistorydata.push(emptyarr);
	for (var m=0; m<12; m++) {
		var total = Math.ceil(Math.random()*50)
		var reverts = Math.ceil(total*Math.random())
		revhistorydata[y].push([total, reverts])
		average_total += total;
		average_reverts += reverts;
		count++;
	}		
}

// calculate average
average_total = average_total/count;
average_reverts = average_reverts/count;


// var timescale = d3.time.scale()
// 	.domain([])
// 	.range([])


var revhistory = d3.select('#revisionhistory').data(revhistorydata)

revhistory.append('g').attr('class', 'bars')

