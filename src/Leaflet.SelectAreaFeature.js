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
		this._doTouchStartEndRef = null;
		this._drawnPolygon = null; // holds the drawn polygon
		L.setOptions(this, options);
	},
	
	addHooks: function() {
		this._map.dragging.disable();

		// Mouse events
		this._map.on('mousedown', this._doMouseDown, this);
		this._map.on('mouseup', this._doMouseUp, this);
		this._map._container.style.cursor = this.options.selCursor;
		
		// Touch events
		let thisRef = this;
		this._doTouchStartEndRef = function(ev){thisRef._doTouchStartEnd(ev, thisRef);};
		this._map._container.addEventListener("touchstart", this._doTouchStartEndRef);
		this._map._container.addEventListener("touchend", this._doTouchStartEndRef);
		this._map._container.addEventListener("touchcancel", this._doTouchStartEndRef);
	},

	_doTouchStartEnd: function(ev, thisRef) { // handler for touchstart and touchend events
		if (ev.cancelable) ev.preventDefault();
		
		// Get Lat Lng of touch event
		let relativeX = null;
		let relativeY = null;
		if (ev.type == "touchend") {
			relativeX = ev.changedTouches[0].clientX - thisRef._map._container.getBoundingClientRect().left; // X Page position of the touch point minus the page position of the map's left edge = pixels from left edge of map
			relativeY = ev.changedTouches[0].clientY - thisRef._map._container.getBoundingClientRect().top;  // Y Page position of the touch point minus the page position of the map's top edge = pixels from top of map
		} else {
			relativeX = ev.targetTouches[0].clientX - thisRef._map._container.getBoundingClientRect().left; // X Page position of the touch point minus the page position of the map's left edge = pixels from left edge of map
			relativeY = ev.targetTouches[0].clientY - thisRef._map._container.getBoundingClientRect().top;  // Y Page position of the touch point minus the page position of the map's top edge = pixels from top of map
		}
		
		let latlng = thisRef._coordToLatLng(relativeX, relativeY, thisRef._map); // When Leaflet method "layerPointToLatLng" is fixed, we can do this: let latlng = thisRef._map.layerPointToLatLng(L.point(relativeX, relativeY));
		thisRef._addNewPoint(latlng, thisRef);

		// Add/remove touchmove event handler
		let doTouchMoveRef = function(ev){thisRef._doTouchMove(ev, thisRef)};
		if (ev.type == "touchstart") {
			thisRef._onDrawStart({"latlng" : latlng, "containerPoint" : ev.containerPoint, "layerPoint" : ev.layerPoint});
			thisRef._startCommon(latlng, thisRef);
			thisRef._map._container.addEventListener("touchmove", doTouchMoveRef);
		} else if (ev.type == "touchend") {
			thisRef._map._container.removeEventListener("touchmove", doTouchMoveRef);
			thisRef._endCommon(thisRef);
		}
	},

	_doTouchMove: function(ev, thisRef) { // handler for touchmove event
		let relativeX = ev.targetTouches[0].clientX - thisRef._map._container.getBoundingClientRect().left; // X Page position of the touch point minus the page position of the map's left edge = pixels from left edge of map
		let relativeY = ev.targetTouches[0].clientY - thisRef._map._container.getBoundingClientRect().top;  // Y Page position of the touch point minus the page position of the map's top edge = pixels from top of map
		let latlng = thisRef._coordToLatLng(relativeX, relativeY, thisRef._map); // When Leaflet method "layerPointToLatLng" is fixed, we can do this: let latlng = thisRef._map.layerPointToLatLng(L.point(relativeX, relativeY));
		thisRef._addNewPoint(latlng, thisRef);
	},

	removeHooks: function() {
		// Mouse
		this._map.off('mousemove');
		this._map.off('mousedown');
		this._map.off('mouseup');
		this._map._container.style.cursor = this.options.normCursor;

		// Touch events
		this._map._container.removeEventListener("touchstart", this._doTouchStartEndRef);
		this._map._container.removeEventListener("touchend", this._doTouchStartEndRef);
		this._map._container.removeEventListener("touchcancel", this._doTouchStartEndRef);

		this._map.dragging.enable();
	},

	_onDrawEnd: function(evData) { // Raise external event on completion of drawing
		this._map.fire("onDrawEnd", evData);
	},

	_onDrawStart: function(evData) { // Raise external event at start of drawing
		this._map.fire("onDrawStart", evData);
	},

	_doMouseDown: function(ev) { // handler for mousedown event
		this._onDrawStart({"latlng" : ev.latlng, "containerPoint" : ev.containerPoint, "layerPoint" : ev.layerPoint});
		this._startCommon(ev.latlng, this);
		this._map.on('mousemove', this._doMouseMove, this );
	},

	_doMouseMove: function(ev) { // handler for mousemove event
		this._addNewPoint(ev.latlng, this);
	},

	_doMouseUp: function(ev) {
		this._endCommon(this);
	},

	_startCommon: function(latlng, thisRef) { // common code to run on mouse down and touchstart events
		thisRef._ARR_latlon = [];
		thisRef._flag_new_shape = true;
		thisRef._area_pologon = null;
		thisRef._area_line_new = null;
		thisRef._area_line = null;

		// if a polygon is already drawn, remove it
		if (thisRef._drawnPolygon) thisRef._map.removeLayer(thisRef._drawnPolygon);

		// create a new polygon
		thisRef._drawnPolygon = L.polygon([latlng], {
			color: thisRef.options.color, 
			weight: thisRef.options.weight, 
			dashArray: thisRef.options.dashArray,
			fillOpacity: 0.2
		}).addTo(thisRef._map);
	},

	_endCommon: function(thisRef) { // common code to run on mouse up and touchend events
		thisRef._pre_latlon = null;
		thisRef._post_latlon = null;
		thisRef._ARR_latlon_line = [];

		if (thisRef._flag_new_shape) {
			thisRef._area_pologon_layers.push(L.polygon(thisRef._ARR_latlon, {color: thisRef.options.color}).addTo(thisRef._map));
  
			// if a polygon is already drawn, remove it
			if (thisRef._drawnPolygon) thisRef._map.removeLayer(thisRef._drawnPolygon);
			thisRef._flag_new_shape = false;
			thisRef._onDrawEnd(thisRef._ARR_latlon);
		}
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
		if ( layers_found.length == 0 ) {
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

			var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
			if (intersect) inside = !inside;
		}
		return inside;
	},
		
	_addNewPoint(latlng, thisRef) { // Add new point to polygon data, if suffciently unique
		let addThisPoint = false;
		let lastEntry = null;
		let backingDataLength = thisRef._ARR_latlon.length;
		if (backingDataLength != 0) {
			lastEntry = thisRef._ARR_latlon[thisRef._ARR_latlon.length - 1];
			if (lastEntry.lat != latlng.lat || lastEntry.lng != latlng.lng) addThisPoint = true; // Only add point if not a duplicate
		} else addThisPoint = true; // Empty array: push latlon to array

		if (addThisPoint) {
			if (backingDataLength > 1) { // Don't change origin
				// Apply data reduction if lat or lon are identical
				if (lastEntry.lat == latlng.lat) { // modify last entry's lng instead of adding new point
					thisRef._ARR_latlon[thisRef._ARR_latlon.length - 1].lng = latlng.lng; // modify existing backing data with new lng
					if (thisRef._drawnPolygon != null) thisRef._drawnPolygon.addLatLng(latlng); // always update polygon drawing to follow user input
					addThisPoint = false;
				} else if (lastEntry.lng == latlng.lng) {  // modify last entry's lat instead of adding new point
					thisRef._ARR_latlon[thisRef._ARR_latlon.length - 1].lat = latlng.lat; // modify existing backing data with new lat
					if (thisRef._drawnPolygon != null) thisRef._drawnPolygon.addLatLng(latlng); // always update polygon drawing to follow user input
					addThisPoint = false;
				}
			}
			if (addThisPoint) {
				thisRef._ARR_latlon.push(latlng); // push latlon to area to make a polygon to later stadium
				if (thisRef._drawnPolygon != null) thisRef._drawnPolygon.addLatLng(latlng); // add the new point to the polygon
			}
		}
	},

	_coordToLatLng: function(xPosPx, yPosPx, map) { // Converts pixel coordinates on Leaflet control to Lat Lon.  Work around for Leaflet layerPointToLatLng method not returning accurate Lat/Lon values after map move or resize
		let bounds = map.getBounds();
		let lngWidth = bounds.getWest() - bounds.getEast();
		let latHeight = bounds.getNorth() - bounds.getSouth();
		let pxMapSizeX = map.getSize().x;
		let pxMapSizeY = map.getSize().y;
		let latPos = bounds.getNorth() - (latHeight * yPosPx / pxMapSizeY); // Top map boundary minus scaled vertical offset
		let lngPos = bounds.getWest() - (lngWidth * xPosPx / pxMapSizeX); // Left map boundary minus scaled horizontal offset
		let latlng = L.latLng(latPos, lngPos) ;
		return latlng;
	}
	
	});
	
}, window));

L.Map.addInitHook('addHandler', 'selectAreaFeature', L.SelectAreaFeature);
