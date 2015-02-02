(function(window, document, undefined){
 
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
		// We pick up the SVG from the map object
		var svg = d3.select("#map_leaflet").select("svg"),
		g = svg.append("g");	
		data.forEach(function(entry) {
		   entry.LatLng = new L.LatLng(entry.lat,
		      entry.long)
		  })	
		var radius = 10;
		var color = "#d95525";		  
		var feature = g.selectAll("circle")
		   .data(data)
		   .enter().append("circle")
		   .style("stroke", color)  
		   .style("opacity", .8) 
		   .style("fill", color) 
		   //.style("fill", function(d){ return color(d.colour);}) 
		   .attr("r", function(d){ return radius})
		   .attr("class", "location_circle")
   			.on("click", function(d){ 
   				console.log(d.name) 				
        	});   
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
   		var svg_flav = d3.select("#flavour-map").select("svg"),
		g_flav = svg_flav.append("g");
		var radius = 10;
		var flavour_scale = 40;
		var color = "#d95525";		  
		var feature = g_flav.selectAll("circle")
		  .data(data)
		  .enter().append("circle")
		  .attr('cx',function(d){ return (d.rich*flavour_scale)})
		   .attr('cy',function(d){ return (d.smoky*flavour_scale)})
		  .style("stroke", color)  
		  .style("opacity", .8) 
		  .style("fill", color) 
		   //.style("fill", function(d){ return color(d.colour);}) 
		  .attr("r", function(d){ return radius})
		  .attr("class", "location_circle")
   			;
	
});



	
	d3.csv('data/whisky-data.csv',function(csv){		
		make_map(csv);
	});

	d3.csv('data/whisky-data.csv',function(csv){		
		make_flav_map(csv);
	});

	
      
})(this, document);