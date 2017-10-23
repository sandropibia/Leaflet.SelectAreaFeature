
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
</head>
<body>

# Leaflet.SelectAreaFeature
Plugin that selects feature(s) by drawing an area on the map.

Supports Leaflet 1.0.0+ branches, tested with 1.2.0.

This plugin let the user draw an area, once it is activated, on the map by holding the left mouse button on moving it. As a developer you can get the layers that are within the bounding box of that area. Once you have the instances of the layers you can manipulate them separately.

## Features
* easy enable it
* easy disable it
* draw an area around the objects
* get instance(s) of all selected objects or only instances of polygon(s), polyline(s), marker(s), rectangle(s) and circle(s) 
* manipulate slected features 
* customisable

## Example
<p>Here you can find an example https://sandropibia.github.io/Leaflet.SelectAreaFeature/examples/index.html showing the features of the plugin.</p>

## Usage

Include Leaflet.SelectAreaFeature in your JavaScript project using `npm install leaflet-selectareafeature`.

You can then include Leaflet.SelectAreaFeature in your web application by adding the following HTML tags (paths below are relative to your project's root):

```
<script src="./lib/js/Leaflet.SelectAreaFeature.js"></script>
```

Put it after leaflet is loaded.
Once your page is loaded you can easily use it by enable it like:
```javascript
var selectfeature = map.selectAreaFeature.enable();
```

After the plugin is enabled the user can draw an area by holding the left mouse button and start drawing. You can disable the plugin by:
```javascript
selectfeature.disable();
```

Than the mouse events for drawing stop working with the map.

### Options
The following options are available with SelectAreaFeature (showing you here with the default settings):

| Property      | Description                             | Default value | Example                |
|---------------|-----------------------------------------|---------------|----------------------- |
| color         | The color of the line when drawing. For example 'blue' , ' #333333'| 'green'|```selectfeature.options.color = '#663399' ;```|
| weight | The weight of the line | 2 |```selectfeature.options.weight = 1 ;``` | 
| dashArray | Sets  | '5, 5, 1, 5' | |


### Methods
<p>The following methods are supported by the plugin:</p>
<ul>
<li><strong>getBoundsAreaLatLon</strong></li> gets all LatLngs for the area that was last drawn on the map
<li><strong>doRemoveAllSelection</strong></li> removes all area's drawn on the map
<li><strong>doRemoveLastSelection</strong></li> removes the las area drawn on the map
<li><strong>getFeaturesSelected('layertype')</strong></li> returns an array of the layers wich are in the bounding box of the area drawn
layertype can be: 'polygon'/'polyline'/'circle'/'rectangle' 
</ul>

</body>
</html>
