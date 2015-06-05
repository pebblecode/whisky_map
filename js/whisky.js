(function(window, document, undefined){



var tooltip = d3.select("#tooltip-whole")
	.style("visibility", "hidden");
var tooltip_text = 	d3.select("#tooltip")
  	.text("testing");

var make_map = (function(data){
	var map = L.map('map_leaflet', {
        zoomControl:false, //we have to remove the standard one to put in our new one where we want
        }).setView([56.992281 , -4.5], 7); //start point and zoom to mar lodge
    var mapLink = 
        '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom:2
        }).addTo(map);
  	//add new zoom controls
     //new L.Control.Zoom({ position: 'topright' }).addTo(map);
    // Initialize the SVG layer
	map._initPathRoot() 


	// **************   MAP SIDE OF THINGS   ****************//
  //set flavour map div to map size  
    var flavW = $('#flavour-map-svg').width();
    var flavH = $('#flavour-map-svg').height();

	// We pick up the SVG from the map object
	var svg = d3.select("#map_leaflet").select("svg"),
	g = svg.append("g");	
	data.forEach(function(entry) {
	   entry.LatLng = new L.LatLng(entry.lat,
	      entry.long)
	  })	
	var radius = 10 * flavW / 400; //10 is for max size of 400, so we scale down for smaller ones
	var color = "#d95525";		  
	var feature = g.selectAll("circle")
	   .data(data)
	   .enter().append("circle") 
	   .style("opacity", .8) 
	   .style("fill", color) 
	   //.style("fill", function(d){ return color(d.colour);}) 
	   .attr("r", function(d){ return radius})
	   .attr("class", "location_circle")
	   .attr("id",function(d){ return d.name + "2"})
	   .on("mouseover", function(d){ 
				matchname(d.name, radius);
				boxhide();
				boxname(d.name);
    		})
		  .on("mouseout", function(d){ 
				unmatch(d.name, radius, color);
				boxhide();
    		})
    	;   
	// *********************  other  ***********************// 
		map.on("viewreset", update);
		update();
		function update() {
		   	feature.attr("transform", 
		   	function(d) { 
		       	return "translate("+ 
		    	map.latLngToLayerPoint(d.LatLng).x +","+ 
		    	map.latLngToLayerPoint(d.LatLng).y +")";
		    })
		}
     });

// **************   FLAVOUR SIDE OF THINGS   ****************//   	
var make_flav_map = (function(data){


    //set flavour map div to map size  
    var flavW = $('#flavour-map-svg').width();
    var flavH = $('#flavour-map-svg').height();

    var percentOf = 0.8;
    var marginSet = flavW * ( 1 - percentOf ) / 2

    $('#flavour-container').width(flavW*percentOf).height(flavH*percentOf);
    $('#flavour-map').width(flavW*percentOf).height(flavH*percentOf);
    $('#flavour-map').css("top", marginSet).css("left", marginSet)


   	var svg_flav = d3.select("#flavour-map").select("svg"),
		    g_flav = svg_flav.append("g");
		var radius = 10 * flavW / 400; //10 is for max size of 400, so we scale down for smaller ones
		var flavour_scale = (flavW * 0.8 / 10); //size of svg / 10
		var color = "#d95525";		  
		var feature = g_flav.selectAll("circle")
		  .data(data)
		  .enter().append("circle")
		  .attr('cx',-20) //start off screen so i animated in
		  .attr('cy',-20)
		  .style("opacity", 0.8) 
		  .style("fill", color) 
		   //.style("fill", function(d){ return color(d.colour);}) 
		  .attr("r", function(d){ return radius})
		  .attr("class", "location_circle")
		  .attr("id",function(d){ return d.name})
		  .on("mouseover", function(d){ 
				matchname(d.name, radius);
				boxhide();
				boxname(d.name);
    		})
		  .on("mouseout", function(d){ 
				unmatch(d.name, radius, color);
				boxhide();
    		})
		  .transition()
		  	.duration(2000)
		  	.attr('cx',function(d){ return (d.rich*flavour_scale)})
		  	.attr('cy',function(d){ return ((10-d.smoky)*flavour_scale)})
   			;
	
});

	
	
function matchname(name, radius){
	var matching1 = d3.select("#"+name)
		.transition()
        .duration(500)
        .attr("r", radius*1.2)
        .style("fill", "#7920b1") 
    ;    
	var matching2 = d3.select("#"+name+"2")
		.transition()
        .duration(500)
        .attr("r", radius*1.8)
        .style("fill", "#7920b1")
    ;    
};

function unmatch(name, radius, color){
	var matching1 = d3.select("#"+name)
		.transition()
        .duration(500)
        .attr("r", radius)
        .style("fill", color) 
    ;  
	var matching2 = d3.select("#"+name+"2")
		.transition()
        .duration(500)
        .attr("r", radius)
        .style("fill", color) 
    ;    
};

//************************ TOOLTIP MOVING ETC *****************************//
function boxmove(e) {
  var cursorX = e.clientX;
  var cursorY = e.clientY;
  var width_adjust = tooltip.style("width");
  width_adjust = parseInt(width_adjust, 10);
  width_adjust = (width_adjust*0.5 + 5);
  return tooltip.style("top", (cursorY + 10)+"px").style("left",(cursorX - width_adjust)+"px");
};
document.addEventListener("mousemove", boxmove);



function boxhide(){
	var hiddenbox = tooltip.style("visibility");
	if (hiddenbox == "hidden"){
	  return tooltip.style("visibility", "visible");
	  }
	  else {
	  return tooltip.style("visibility", "hidden");
	  }
};//close boxhide	



function boxname(name){
	name = name.replace(/_/g, " ");
	tooltip_text.text(name);
}


//******************** RUN DATA ********************//
d3.csv('data/whisky-data.csv',function(csv){		
		make_map(csv);
		make_flav_map(csv);
	});


$(window).resize(function() {

  //clear current data
  var svg_clear = d3.select("#flavour-map").select("svg");
  svg_clear.html("");

  d3.csv('data/whisky-data.csv',function(csv){   
    make_flav_map(csv);
  });
});

      
})(this, document);