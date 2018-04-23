function isMarkerInsidePolygon(poly) {
    return function (layer) {
        var bounds = poly.getLatLngs();
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            var lat = layer.getLatLng().lat, lng = layer.getLatLng().lng;
            return contains(bounds, lat, lng);
        }
        else {
            var shapePoints = layer.getLatLngs();
            var inside = false;
            for (var i = 0; i < shapePoints.length; i++) {
                if (contains(bounds, shapePoints[i][0], shapePoints[i][1]))
                    inside = true;
                else
                    inside = false;
            }
            return inside;
        }
    }
}

function contains(bounds, lat, lng) {
    //https://rosettacode.org/wiki/Ray-casting_algorithm
    var count = 0;
    for (var b = 0; b < bounds[0].length; b++) {
        var vertex1 = bounds[0][b];
        var vertex2 = bounds[0][(b + 1) % bounds[0].length];
        if (west(vertex1, vertex2, lat, lng))
            ++count;
    }
    return count % 2;
}

function west(A, B, lngX, latY) {
    if ((A.lng > latY != (B.lng > latY))
    && (lngX < (B.lat - A.lat) * (latY - A.lng) / (B.lng - A.lng) + A.lat)){
        return true;
    } else 
        return false;
}


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
            dashArray: '5, 5, 1, 5',
            selCursor: 'crosshair',
            normCursor: ''
        },

        initialize: function (map, options) {
            this._map = map;

            this._pre_latlon = '';
            this._post_latlon = '';
            this._ARR_latlon_line = [];
            this._ARR_latlon = [];
            this._flag_new_shape = false;
            this._area_pologon_layers = [];

            this._area_line = '';
            this._area_line_new = '';

            L.setOptions(this, options);
        },

        addHooks: function () {

            this._map.on('mousedown', this._doMouseDown, this);
            this._map.on('mouseup', this._doMouseUp, this);

            this._map.dragging.disable();

            this._map._container.style.cursor = this.options.selCursor;
        },

        removeHooks: function () {
            this._map.off('mousemove');
            this._map.off('mousedown');
            this._map.off('mouseup');
            this._map._container.style.cursor = this.options.normCursor;

            this._map.dragging.enable();
        },

        _doMouseUp: function (ev) {

            this._pre_latlon = '';
            this._post_latlon = '';
            this._ARR_latlon_line = [];
            if (this._flag_new_shape) {
                this._area_pologon_layers.push(L.polygon(this._ARR_latlon, { color: this.options.color }).addTo(this._map));

                if (this._map.hasLayer(this._area_line)) {
                    this._map.removeLayer(this._area_line);
                }
                if (this._map.hasLayer(this._area_line_new)) {
                    this._map.removeLayer(this._area_line_new);
                }
                this._flag_new_shape = false;
            }
            this._map.off('mousemove');
        },

        _doMouseDown: function (ev) {

            this._ARR_latlon = [];
            this._flag_new_shape = true;
            this._area_pologon = '';
            this._area_line_new = '';
            this._area_line = '';

            this._map.on('mousemove', this._doMouseMove, this);
        },

        _doMouseMove: function (ev) {

            this._ARR_latlon.push(ev.latlng);
            if (this._pre_latlon == '' || this._pre_latlon == "undefined") {
                this._pre_latlon = ev.latlng;
                this._ARR_latlon_line.push(this._pre_latlon);
            }
            else if (this._pre_latlon != '' && (this._post_latlon == '' || this._post_latlon == "undefined")) {
                this._post_latlon = ev.latlng;
                this._ARR_latlon_line.push(this._post_latlon);
            }
            else {
                this._pre_latlon = this._post_latlon;
                this._post_latlon = ev.latlng;
                this._ARR_latlon_line.push(this._pre_latlon);
                this._ARR_latlon_line.push(this._post_latlon);
            }

            if (this._pre_latlon != '' && this._post_latlon != '') {
                if (this._area_line_new == '' && this._area_line == '') {
                    this._area_line = L.polyline(this._ARR_latlon_line, {
                        color: this.options.color,
                        weight: this.options.weight,
                        dashArray: this.options.dashArray
                    });

                    this._area_line.addTo(this._map);
                }
                if (this._area_line_new == '' && this._area_line != '') {
                    this._area_line_new = L.polyline(this._ARR_latlon_line, {
                        color: this.options.color,
                        weight: this.options.weight,
                        dashArray: this.options.dashArray
                    });

                    this._area_line_new.addTo(this._map);
                    this._map.removeLayer(this._area_line);
                }
                if (this._area_line_new != '' && this._area_line != '') {
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

        getAreaLatLng: function () {
            return this._ARR_latlon;
        },

        removeAllArea: function () {
            var _i = 0;
            while (_i < this._area_pologon_layers.length) {
                this._map.removeLayer(this._area_pologon_layers[_i]);
                _i++;
            }
            this._area_pologon_layers.splice(0, _i);
        },

        removeLastArea: function () {
            var index = this._area_pologon_layers.length - 1;
            this._map.removeLayer(this._area_pologon_layers[index]);
            this._area_pologon_layers.splice(index, 1);
        },

        getFeaturesSelected: function (layertype) {
            var layers_found = [];
            var pol;
            var _i = 0;

            while (_i < this._area_pologon_layers.length) {
                var currentPoly = this._area_pologon_layers[_i];
                if (currentPoly.getLatLngs()[0].length > 0) {
                    var inPol = isMarkerInsidePolygon(currentPoly);

                    this._map.eachLayer(function (layer) {
                        if ((layertype == 'polygon' || layertype == 'all') && layer instanceof L.Polygon && !currentPoly.getBounds().equals(layer.getBounds())) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                        if ((layertype == 'polyline' || layertype == 'all') && layer instanceof L.Polyline && !currentPoly.getBounds().equals(layer.getBounds())) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                        if ((layertype == 'circle' || layertype == 'all') && layer instanceof L.Circle && !currentPoly.getBounds().equals(layer.getBounds())) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                        if ((layertype == 'rectangle' || layertype == 'all') && layer instanceof L.Rectangle && !currentPoly.getBounds().equals(layer.getBounds())) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                        if ((layertype == 'marker' || layertype == 'all') && layer instanceof L.Marker) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                        if ((layertype == 'circlemarker' || layertype == 'all') && layer instanceof L.CircleMarker) {
                            if (inPol(layer)) {
                                layers_found.push(layer);
                            }
                        }
                    });
                    _i++;
                }
            }
            if (layers_found.length == 0) {
                layers_found = null;
            }

            return layers_found;
        }

    });

}, window));

L.Map.addInitHook('addHandler', 'selectAreaFeature', L.SelectAreaFeature);
