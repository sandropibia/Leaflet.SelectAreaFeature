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
		
		this._pre_latlon = '';
		this._post_latlon = '';
		this._ARR_latlon_line = [];
		this._ARR_latlon = [];
		
		this._area_pologon_layers = [];
		
		this._area_line = '';
		this._area_line_new = '';
		
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

    _doMouseUp: function(ev) {

  	  this._pre_latlon = '';
	  this._post_latlon = '';
	  this._ARR_latlon_line = [];
	  
	  this._area_pologon_layers.push(L.polygon(this._ARR_latlon, {color: this.options.color}).addTo(this._map));

	  if ( this._map.hasLayer(this._area_line) ){
		this._map.removeLayer(this._area_line);  
	  }
	  if ( this._map.hasLayer(this._area_line_new) ){
		this._map.removeLayer(this._area_line_new);  
	  }
	  this._map.off('mousemove');

	},

	_doMouseDown: function(ev) {

	  this._ARR_latlon = [];
	  this._area_pologon = '';
	  this._area_line_new = '';
	  this._area_line = '';
	  
	  this._map.on('mousemove', this._doMouseMove, this );
    },
	
	_doMouseMove: function(ev) {

	  this._ARR_latlon.push(ev.latlng);
	  if (this._pre_latlon == '' || this._pre_latlon == "undefined") {
		this._pre_latlon = ev.latlng;
		this._ARR_latlon_line.push(this._pre_latlon);
	  }
	  else if ( this._pre_latlon != '' && ( this._post_latlon == '' || this._post_latlon == "undefined") ) {
		this._post_latlon = ev.latlng;
		this._ARR_latlon_line.push(this._post_latlon);
	  }
	  else {
		this._pre_latlon = this._post_latlon;
		this._post_latlon = ev.latlng;
		this._ARR_latlon_line.push(this._pre_latlon);
		this._ARR_latlon_line.push(this._post_latlon);
	  }
	  
	  if ( this._pre_latlon != '' && this._post_latlon != '' ) {
        if ( this._area_line_new == '' && this._area_line == '' ) {
		  this._area_line = L.polyline(this._ARR_latlon_line, {
			                                 color: this.options.color, 
											 weight: this.options.weight, 
											 dashArray: this.options.dashArray
										   });
										   
		  this._area_line.addTo(this._map);
        }
        if ( this._area_line_new == '' && this._area_line != '' ) {
		  this._area_line_new = L.polyline(this._ARR_latlon_line, {
			                                 color: this.options.color, 
											 weight: this.options.weight, 
											 dashArray: this.options.dashArray
										   });
										   
		  this._area_line_new.addTo(this._map);
		  this._map.removeLayer(this._area_line);
        }
        if ( this._area_line_new != '' && this._area_line != '' ) {
		  this._area_line = L.polyline(this._ARR_latlon_line, {
			                                 color: this.options.color, 
											 weight: this.options.weight, 
											 dashArray: this.options.dashArray
										   });
		  this._area_line.addTo(this._map);								   
		  this._map.removeLayer(this._area_line_new);
		  this._area_line_new = '';
        }
		
	  }	  
      
	},
	
	getBoundsAreaLatLon: function() {
		return this._ARR_latlon;
	},

    doRemoveAllSelection: function() {
		var _i = 0;
		while ( _i < this._area_pologon_layers.length  ) {
		  this._map.removeLayer(this._area_pologon_layers[_i]);
		  //delete this._area_pologon_layers[_i];
		  _i++;
		}
	    this._area_pologon_layers = [];

	},
	
	doRemoveLastSelection: function() {
		var index = this._area_pologon_layers.length - 1;
		this._map.removeLayer(this._area_pologon_layers[index]);
		this._area_pologon_layers = [];
	},
	
	getFeaturesSelected: function(layertype) {
	   var layers_found = [];
       var pol;
	   
	   var index = this._area_pologon_layers.length;
	   pol = this._area_pologon_layers[index-1].getBounds();
	   
	   this._map.eachLayer(function(layer){
         if (layertype == 'polygon' && layer instanceof L.Polygon && !pol.equals(layer.getBounds()) ) {
		   if ( pol.contains(layer.getBounds()) ) {
            layers_found.push(layer);
		   }	 
	     }
         else if (layertype == 'polyline' && layer instanceof L.Polyline && !pol.equals(layer.getBounds()) ) {
		   if (  pol.contains(layer.getBounds()) ) {
            layers_found.push(layer);
		   }  
		 }   
	   
         else if (layertype == 'circle' && layer instanceof L.Circle && !pol.equals(layer.getBounds()) ) {
		   if ( pol.contains(layer.getBounds()) ) {
            layers_found.push(layer);
		   }  
		 }   
	   
         else if (layertype == 'rectangle' && layer instanceof L.Rectangle && !pol.equals( layer.getBounds()) ) {
	       if ( pol.contains(layer.getBounds()) ) {
            layers_found.push(layer);
		   }  
		 }  
       });
	   
	   if ( layers_found.length == 0  ){
		   layers_found = null;
	   }
		   
	   return layers_found;
	}
	
	});
	
}, window));

L.Map.addInitHook('addHandler', 'selectAreaFeature', L.SelectAreaFeature);

