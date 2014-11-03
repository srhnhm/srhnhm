

    function addPin(pin, i, circleData, pace) {
        var g = output.append('g');

        function updatePin() {
            var loc = {lat: pin.location[0], lon: pin.location[1]};
            var pos = map.locationPoint(loc);
            var scaling = ((map.coordinate.zoom*map.coordinate.zoom))/300
            g.attr('transform', 'translate('+parseInt(pos.x)+', '+parseInt(pos.y)+') scale('+ scaling +')' );    
        }
        
        map.addCallback('panned', updatePin);
        map.addCallback('zoomed', updatePin);                
        updatePin();

        var r = 10; //control for overall droplet size, to which the diff paths are related
        var t = pace/20;  //control for overall "seeping in" time

        function dropBlob (radius, noise, color, strokeColor, stroke, filter, opacInitial, opacFinal, duration) {

            var line = d3.svg.line()
                .x(function(d){ return (radius + Math.random()*noise)*d.x;})
                .y(function(d){ return (radius + Math.random()*noise)*d.y})
                .interpolate("cardinal-closed")
                .tension(.99);

            g.data([circleData]).append("path")
                .attr("d", function(d) {
                    return line(d)  + "Z";
                })
                .attr('fill', color)
                .attr('stroke', strokeColor)
                .attr('stroke-width', stroke+'px')
                .attr('filter', 'url(#'+filter+')')
                .attr('fill-opacity', opacInitial)
                .transition().duration(duration)
                .attr('fill-opacity', opacFinal)
        }

        function dropOutline (radius, noise, color, strokeColor, stroke, filter, opacInitial, opacFinal, duration) {
            var line = d3.svg.line()
                .x(function(d){ return (radius + Math.random()*noise)*d.x;})
                .y(function(d){ return (radius + Math.random()*noise)*d.y})
                .interpolate("cardinal-closed")
                .tension(.99);

            g.data([circleData]).append("path")
                .attr("d", function(d) {
                    return line(d)  + "Z";
                })
                .attr('fill', color)
                .attr('stroke', strokeColor)
                .attr('stroke-width', stroke+'px')
                .attr('filter', 'url(#'+filter+')')
                .attr('stroke-opacity', opacInitial)
                .transition().duration(duration)
                .attr('stroke-opacity', opacFinal)

        }

        // dropBlob(r, 10, pin.hex, 'none', 0, 'f2', .9, .4, 100*t);
        dropBlob(r, 10, pin.hex, 'none', 0, 'f2', .9, .2, 600*t);
        // dropBlob(1.5*r, 50, pin.hex, 'none', 0, 'f1', 0.000001, .1, 100*t);
        // dropBlob(2*r, 50, pin.hex, 'none', 0, 'f1', 0.000001, .15, 200*t);
        dropBlob(4.5*r, 10, pin.hex, 'none', 0, 'f0', 0.000001, .3, 450*t);
        dropOutline(5*r, 10, 'none', pin.hex, 1.5, 'f2', 0.000001, .4, 600*t);  

        g.append('circle')
            .attr('cx', g.attr('width')/2)
            .attr('cy', g.attr('height')/2)
            .attr('r', 8)
            .attr('class', 'dot')
            .attr('fill', 'white')
            .attr('fill-opacity', 0)
            .on('mouseover', function(d) {
                $(this).attr('fill-opacity', 1);
            })
            .on('mouseout', function(d) {
                $(this).attr('fill-opacity', 0);
            })
            .on('click', function() {
                alert(pin.text);
            });

        //IF YOU WANT TO REMOVE OLD BLOBS //////////////////////
        // g.transition().duration(600*t)
        //     .attr('fill-opacity', 0)
        //     .attr('stroke-opacity', 0)
        //     .transition().duration(1000*t)
        //     .remove();
    
    }
    
       
    function animateStream(pin, i) {
        $('#stream-'+pin.color).animate({
            left: '+='+pin.newWidth 
        }, 500);
        $('#stream-'+pin.color+' > #t-'+pin.term+' > div.count').text(pin.count)
        // if (pin.count >= 2) {
        //     var hold = $('#stream-'+pin.color+' > #t-'+pin.term).remove();
        //     $('#stream-'+pin.color).prepend(hold);
        // }
        var featured = $('#featured');
        featured.animate({
            opacity: 0
        }, 200, function() {
            featured.html(pin.text + '<br/><br/><div><span class="username">@'+pin.user+'</span><span class="username">|</span><span class="date">' + pin.date + "</span></div>");
            featured.animate({
                opacity: 1
            }, 200);
        });
    }

    function iterateOverTweets(pins, nextPage) {

        var pace = 2000;

        function myLoop () {setTimeout(function () {
            addPin(pins[i], i, circleData, pace);
            animateStream(pins[i], i, pace);                                    
            i++;
            
            if (i == pins.length) {
                console.log('NEW TWEET PULL '+nextPage)
                pullTweets(nextPage);
            }
            else if (i < pins.length) {
                myLoop();
            }
        }, pace)}

        if (pins.length == 0) {
            console.log('NOT A SINGLE TWEET '+nextPage)
            pullTweets(nextPage);
        }
        else {
            var circleData = [];
            for (var q=0; q<360; q+=3) {
                circleData.push({ "x": Math.cos(q*Math.PI/180), "y": Math.sin(q*Math.PI/180) });
            }
            var i = 0;
            myLoop();
        }
        
    }

    function prepTweetData(data, colors) {
        var pins = [];

        $(data.results).each(function(i,v){

            var tweetDate = v.created_at;
            var tweetUser = v.from_user;
            var tweetText = v.text;
            var searchstring = tweetText.toLowerCase();
            var tweetGeo = v.geo;
            var tweetLocation = v.location;
            
            for (var c = 0; c<colors.length; c++) {
                if (searchstring.indexOf(colors[c].searchterm) != -1) {
                    var tweetColor = colors[c].searchterm;
                    var tweetHex = colors[c].hex;
                    var colorKey = c;
                } 
            }
            if (tweetGeo != null) {
                var tweetLat = tweetGeo.coordinates[0];
                var tweetLong = tweetGeo.coordinates[1];
            }
            else if ( (tweetLocation) && ( (tweetLocation.indexOf("T:") != -1) || (tweetLocation.indexOf("Phone:") != -1) ) ) {
                var locArray = tweetLocation.substr(tweetLocation.indexOf(":") + 1).split(',');
                var tweetLat = parseFloat(locArray[0]);
                var tweetLong = parseFloat(locArray[1]);
            }
            if (tweetLat && tweetLong && tweetColor) {
                pins.push({
                        user: tweetUser,
                        text: tweetText,
                        location: [tweetLat, tweetLong], 
                        color: tweetColor,
                        hex: tweetHex,
                        date: tweetDate,
                        key: colorKey,
                        newWidth: 0,
                        count: '',
                        term: '',
                        tweetshtml: ''
                });
            }
        });

        function tabulateTweet(pin, i, pace) {        
        // FIND THE COLOR; PROVISIONS FOR WEIRD PUNCTUATION ETC.
            var tweetArray = pin.text.toLowerCase().split(' ');
            var colorindex = (tweetArray.indexOf(pin.color))
            if (colorindex == -1) {
                for (var h = 0; h<tweetArray.length; h++) {
                    if(tweetArray[h].indexOf(pin.color) != -1) {
                        colorindex = h;
                    }
                }
            } 
            
            var buildSet = function(first, last) {
                var s = [];
                for (var w=first; w<=last; w++) {
                    if(tweetArray[colorindex+w] && (tweetArray[colorindex+w].indexOf("@") == -1 || w==0)){
                        s.push(tweetArray[colorindex+w]);
                    }                
                }
                return s;
            }
            var buildTerm = function(word) {
                var protoTerm = ''
                for (var ch=0; ch<word.length; ch++) {
                    if (/^[0-9]/.test(word[ch])==true && ch==0) {
                        protoTerm+='_'+word[ch]
                    } else if (/^[a-zA-Z0-9]/.test(word[ch])==true) {
                        protoTerm+=word[ch];
                    }
                }
                if (protoTerm.length == 0) {
                    protoTerm = 'undefined'
                }
                return protoTerm;
            }


        // CHECK WHETHER COLOR IS THE ONLY WORD, LAST WORD, FOLLOWED BY "AND", THE FIRST WORD
            
            if (tweetArray.length == 1) {
                var set = buildSet(1, 1);
                var term = buildTerm(tweetArray[0])
            } else if (colorindex == ((tweetArray.length)-1)) {
                var set = buildSet(-2, 0);
                var term = buildTerm(tweetArray[colorindex-1])
            } else if (tweetArray[colorindex+1] == 'and') {
                var set = buildSet(0, 2);
                var term = buildTerm(tweetArray[colorindex+2])
            } else if (colorindex == 0) {
                var set = buildSet(0, 1);
                var term = buildTerm(tweetArray[colorindex+1])
            } else {
                var set = buildSet(-1, 1);
                var term = buildTerm(tweetArray[colorindex+1]);
            }

            
        // INCREMENT EXISTING WORDPAIR VERSUS ADD A NEW ONE
            var thisTerm = colors[pin.key].terms[term];
            pin.term = term;

            if (thisTerm) {
                thisTerm.count += 1;
                pin.count = thisTerm.count;
                thisTerm.tweetshtml += '<li><span class="username">@'+pin.user+':</span> '+pin.text+'</li><li>|</li>'
            } else {
                colors[pin.key].terms[term] = {};
                thisTerm = colors[pin.key].terms[term];
                thisTerm.count = 1;
                // thisTerm.tweets = [pin];
                thisTerm.tweetshtml = '<li><span class="username">@'+pin.user+':</span> '+pin.text+'</li><li>|</li>'

                // var newTerm = $('<div id="t-'+term+'" style="border-color:'+pin.hex+'"><div class="accent tweet-'+pin.color+' " >'+ set.join(' ') + '</div><div class="count"></div></div>')
                //     .prependTo('#stream-'+pin.color);
                var newTerm = $('<div id="t-'+term+'"><div class="accent tweet-'+pin.color+' " >'+ set.join(' ') + '</div><div class="count"></div></div>')
                    .prependTo('#stream-'+pin.color);
                var thisWidth = newTerm.width() + 15;
                pin.newWidth = thisWidth;
                newTerm.css('width', thisWidth);
                colors[pin.key].offset += (thisWidth);
                
                newTerm.on({
                    click: function(){  
                        console.log('click')
                        $(this).css({
                            'background-color': pin.hex,
                            'color': 'white'
                        });

                        var thisBar = $('#tweetbar-'+pin.color);
                        thisBar.find('ul').html(thisTerm.tweetshtml);
                        thisBar.animate({
                                height: '2em'
                            }, pace/4);
                        thisBar.siblings('.tweetBar').animate({
                                height: '0em'
                            }, pace/4);


                    },
                    mouseenter: function(){
                        $(this).css({
                            'background-color': pin.hex,
                            'color': 'white',
                        });
                    },
                    mouseleave: function(){
                        $(this).css({
                            'background-color': 'transparent',
                            'color': '#4d4d4d'
                        });
                    }
                });

                $('#streaming').on({
                    mouseleave: function(){
                        $('.tweetBar').animate({
                            height: 0
                        }, 500);
                    }
                });

            }

            
        }   

        
        for (var p=0; p<=pins.length; p++) {
            if (p == pins.length) {
                for (var c=0; c<colors.length; c++) {
                    var thisColor = colors[c]
                    $('#stream-'+thisColor.searchterm).css('left', "-="+thisColor.offset+'px');
                }
            } else {
                tabulateTweet(pins[p], p);
            }
        }

        return(pins);
    }

    function pullTweets(query) {

        $.getJSON("http://search.twitter.com/search.json"+query+"&callback=?", function(data){
            var nextPage = data.next_page;
            var pins = prepTweetData(data, colors);
            iterateOverTweets(pins, nextPage);
        });
    
    }



    var colors = [
        {searchterm: 'red', hex: '#E63E3E', terms: {}, offset: 0},
        {searchterm: 'blue', hex: '#0a559b', terms: {}, offset: 0},
        {searchterm: 'green', hex: '#536B10', terms: {}, offset: 0},
        {searchterm: 'orange', hex: '#E06428', terms: {}, offset: 0},
        {searchterm: 'yellow', hex: '#f9ca1d', terms: {}, offset: 0},
        {searchterm: 'purple', hex: '#52105E', terms: {}, offset: 0},
        {searchterm: 'pink', hex: '#cc399d', terms: {}, offset: 0}
    ];

    var cities = [
        {key: 'boston', city: 'Boston', country: 'USA', center: [42.36552,-71.074376] },
        {key: 'jakarta', city: 'Jakarta', country: 'Indonesia', center: [-6.138848,106.850967] },
        {key: 'london', city: 'London', country: 'UK', center: [51.506659, -0.085917] },
        {key: 'mumbai', city: 'Mumbai', country: 'India', center: [18.962955,72.830772] },
        {key: 'nairobi', city: 'Nairobi', country: 'Kenya', center: [-1.282032,36.829777] },
        {key: 'newyork', city: 'New York', country: 'USA', center: [40.713305,-73.976011] },
        {key: 'sanfrancisco', city: 'San Francisco', country: 'USA', center: [37.78293448874155, -122.42748358471674] },
        {key: 'singapore', city: 'Singapore City', country: 'Singapore', center: [1.289926,103.860283] },
        {key: 'sydney', city: 'Sydney', country: 'Australia', center: [-33.874299,151.19359] },
        {key: 'vancouver', city: 'Vancouver', country: 'Canada', center: [49.267693,-123.127556] }
    ]
    // var colors = [   //PASTEL
        //     {searchterm: 'red', hex: '#E94E35', terms: {}, offset: 0},
        //     {searchterm: 'blue', hex: '#8BA1C7', terms: {}, offset: 0},
        //     {searchterm: 'green', hex: '#69B59B', terms: {}, offset: 0},
        //     {searchterm: 'orange', hex: '#ed7a23', terms: {}, offset: 0},
        //     {searchterm: 'yellow', hex: '#D8EB6A', terms: {}, offset: 0},
        //     {searchterm: 'purple', hex: '#7D6898', terms: {}, offset: 0}
        // ];

    // BUILD THE MAP // *************************************************************
    var layer = new MM.TemplatedLayer('http://tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg');
    var map = new MM.Map('map', layer);
    

    // SETUP THE SVG LAYER // *************************************************************
    var output = d3.select('#map').append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('class', 'output')
        .style('position', 'relative')
        .style('z-index', 100000)
    var defs = output.append('svg:defs');
    var filter = defs.selectAll('filter').data([20, 9, 2]).enter().append('svg:filter')
        .attr('id', function(d, i) {
            return 'f'+i;
        })
        .attr('x', "-100%")
        .attr('y', "-100%")
        .attr('width', "300%")
        .attr('height', "300%")
        .append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', function(d, i) { return d });     


$(document).ready(function() {
    
    function findCity() {
        var path =  window.location.pathname.split('/')[3];
        var cityObj = cities[6]; // default
        var menu = $('div#citylist').find('ul');
        for (var i=0; i<cities.length; i++) {
            console.log(cities[i].key)
            // menu.append('<a class="accent" href="'+window.location.host+window.location.pathname+'?'+cities[i].key+'"><li>'+cities[i].city+'</li></a>');
            if (path.toLowerCase().match(cities[i].key) != null) {
                cityObj = cities[i];

            }
        }

        $('div#title').html(cityObj.city)
        citylist = $('div#citylist');
        citylist.css('height', 46*10+'px')
        $('div#change').on({
            click: function() {
                citylist.slideToggle(500)
            }
        });
        return cityObj;
    }    
    
    var city = findCity();
    map.setCenterZoom(new MM.Location(city.center[0], city.center[1]), 13);

    var colorString = function(colors) { 
        var colorsearch = [];
        for (var c=0; c<colors.length; c++) {
            colorsearch.push(colors[c].searchterm);
            colors[c].offset = 0;
            $('div#streaming').append('<div class="colorStream" id="stream-'+colors[c].searchterm+'" style="border-bottom-color:'+colors[c].hex+'"></div><div class="tweetBar" id="tweetbar-'+colors[c].searchterm+'"style="border-top-color:'+colors[c].hex+';background-color:'+colors[c].hex+'"><div class="tweetList"><ul></ul></div></div>');
        }
        return colorsearch.join('%20OR%20')
    }
            
    var query = "?q="+colorString(colors)+"&rpp=100&geocode="+city.center[0]+","+city.center[1]+",3mi"
    
    // KICK IT OFF // *************************************************************    
    pullTweets(query);
});


                
                
