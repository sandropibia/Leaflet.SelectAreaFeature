# Leaflet.SelectFeature
Plugin that selects feature(s) by drawing an area on the map

This plugin let the user draw an area on the map. As a developer you can get the layers that are within the bounding box of that area. Once you have the instances of the layers you can manupulate them separately.

## Usage

Include Leaflet.SelectFeature in your JavaScript project using `npm install leaflet-selectfeature`.

You can then include Leaflet.SelectFeature in your web application by adding the following HTML tags (paths below are relative to your project's root):

...
<script src="./lib/js/Leaflet.SelectFeature.js"></script>
...

Put it after leaflet is loaded.
Once your page is loaded you can easily use it by enable it like:

var selectfeature = map.selectFeature.enable();

After the plugin is enabled the user can draw an area by holding the left mouse button and start drawing. You can disable the plugin by:

selectfeature.disable();

Than the mouse events for drawing stop working with the map.


### Options
The following options are available with SelectFeature (showing you here with the default settings):

  options{
    color : "green",
    weight : 2,
    dashArray : ' 5, 5, 1, 5',
    selCursor : 'crosshair',
    normCursor: ''
  }

You may modify the options once the plugin is enabled by, for example;

  selectfeature.options.color = '#663399' ;
  selectfeature.options.weight = 1 ;



