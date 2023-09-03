(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
    "use strict";
    L.SelectAreaFeature = L.Handler.extend({
    
	options: {
               color: 'green', 
			   weight: 2, 
			   dashArray: '5, 5, 1, 5' ,
			   selCursor: 'crosshair',
			   normCursor: ''
    },

    initialize: function (map, options) {
	    this._map = map;
		
		this._pre_latlon = null;
		this._post_latlon = null;
		this._ARR_latlon_line = [];
		this._ARR_latlon = [];
		this._flag_new_shape = false;
		this._area_pologon_layers = [];
		
		this._area_line = null;
		this._area_line_new = null;

		// define a variable to hold the drawn polygon
        this._drawnPolygon = null;
		
		L.setOptions(this, options);
    },
	
    addHooks: function() {
		
	    this._map.on('mousedown', this._doMouseDown, this );
		this._map.on('mouseup', this._doMouseUp, this );
		
		this._map.dragging.disable();
		
        this._map._container.style.cursor = this.options.selCursor;
    },

    removeHooks: function() {
		this._map.off('mousemove');
		this._map.off('mousedown');
		this._map.off('mouseup');
        this._map._container.style.cursor = this.options.normCursor;
		
		this._map.dragging.enable();
    },

    _onDrawEnd: function(evData) {
  	  this._map.fire("onDrawEnd", evData);
    },

    _doMouseUp: function(ev) {
  	  this._pre_latlon = null;
	  this._post_latlon = null;
	  this._ARR_latlon_line = [];
	  if (this._flag_new_shape) {
		  this._area_pologon_layers.push(L.polygon(this._ARR_latlon, {color: this.options.color}).addTo(this._map));

		  // if a polygon is already drawn, remove it
		  if (this._drawnPolygon) {
			this._map.removeLayer(this._drawnPolygon);
		  }

		  this._flag_new_shape = false;
		  this._map.off('mousemove');
		  this._onDrawEnd(this._ARR_latlon);
		}
	},

    _onDrawStart: function(evData) {
  	  this._map.fire("onDrawStart", evData);
    },

    _doMouseDown: function(ev) {
	  this._onDrawStart({"latlng" : ev.latlng, "containerPoint" : ev.containerPoint, "layerPoint" : ev.layerPoint});

	  this._ARR_latlon = [];
	  this._flag_new_shape = true;
	  this._area_pologon = null;
	  this._area_line_new = null;
	  this._area_line = null;

      // if a polygon is already drawn, remove it
      if (this._drawnPolygon) {
        this._map.removeLayer(this._drawnPolygon);
      }

      // create a new polygon
	  this._drawnPolygon = L.polygon([ev.latlng], {
		color: this.options.color, 
		weight: this.options.weight, 
		dashArray: this.options.dashArray,
		fillOpacity: 0.2
	  }).addTo(this._map);
	  
	  this._map.on('mousemove', this._doMouseMove, this );
    },

	_doMouseMove: function(ev) {
	  // push latlon to area to make a polygon to later stadium
	  this._ARR_latlon.push(ev.latlng);

      // add the new point to the polygon
      this._drawnPolygon.addLatLng(ev.latlng);
	},
	
	getAreaLatLng: function() {
		return this._ARR_latlon;
	},

    removeAllArea: function() {
		var _i = 0;
		while ( _i < this._area_pologon_layers.length  ) {
		  this._map.removeLayer(this._area_pologon_layers[_i]);
		  _i++;
		}
		this._area_pologon_layers.splice( 0, _i );
	},
	
	removeLastArea: function() {
		var index = this._area_pologon_layers.length - 1;
		this._map.removeLayer(this._area_pologon_layers[index]);
		this._area_pologon_layers.splice(index, 1);
	},
	
	getFeaturesSelected: function(layertype) {
	   var layers_found = [];
	   var pol;
	   var polLayer;
	   var _i = 0;
	   var insideChecker = this.isMarkerInsidePolygon;
       
	   while ( _i < this._area_pologon_layers.length  ) {
		polLayer = this._area_pologon_layers[_i];
		pol = polLayer.getBounds();
	   
	     this._map.eachLayer(function(layer){
           if ( (layertype == 'polygon' || layertype == 'all') && layer instanceof L.Polygon && !pol.equals(layer.getBounds()) ) {
		     if ( pol.contains(layer.getBounds()) ) {
              layers_found.push(layer);
		     }	 
	       }
           if ( (layertype == 'polyline' || layertype == 'all') && layer instanceof L.Polyline && !pol.equals(layer.getBounds()) ) {
		     if (  pol.contains(layer.getBounds()) ) {
              layers_found.push(layer);
		     }  
		   }   
           if ( (layertype == 'circle' || layertype == 'all') && layer instanceof L.Circle && !pol.equals(layer.getBounds()) ) {
		     if ( pol.contains(layer.getBounds()) ) {
              layers_found.push(layer);
		     }  
		   }   
           if ( (layertype == 'rectangle' || layertype == 'all') && layer instanceof L.Rectangle && !pol.equals( layer.getBounds()) ) {
	         if ( pol.contains(layer.getBounds()) ) {
              layers_found.push(layer);
		     }  
		   }  
           if ( (layertype == 'marker' || layertype == 'all') && layer instanceof L.Marker  ) {
			if (pol.contains(layer.getLatLng()) && insideChecker(layer, polLayer)) {
		     layers_found.push(layer);
		    }
		  }  
		/*
		  if ((layertype == 'marker' || layertype == 'all') && layer instanceof L.MarkerCluster) {
			var child = layer.getAllChildMarkers();
			if (child) {
				_.forEach(child, function (m) {
					if (pol.contains(m.getLatLng()) && insideChecker(m, polLayer)) {
						layers_found.push(m);
					}
				});
			}
		  }  
        */

		//getAllChildMarkers

		if ((layertype == 'circlemarker' || layertype == 'all') && layer instanceof L.CircleMarker) {
		  if ( pol.contains(layer.getLatLng()) ) {
		   layers_found.push(layer);
		  }
		}  
	  });
	  _i++;
	}
	   if ( layers_found.length == 0  ){
		   layers_found = null;
	   }
		   
	   return layers_found;
	},

	isMarkerInsidePolygon: function (marker, poly) {
        var polyPoints = poly.getLatLngs()[0];
        var x = marker.getLatLng().lat, y = marker.getLatLng().lng;

        var inside = false;
        for (var i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            var xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            var xj = polyPoints[j].lat, yj = polyPoints[j].lng;

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    }
	
	});
	
}, window));

L.Map.addInitHook('addHandler', 'selectAreaFeature', L.SelectAreaFeature);
