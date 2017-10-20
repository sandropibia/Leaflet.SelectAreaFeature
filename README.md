
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
</head>
<body>

# Leaflet.SelectAreaFeature
Plugin that selects feature(s) by drawing an area on the map

This plugin let the user draw an area on the map. As a developer you can get the layers that are within the bounding box of that area. Once you have the instances of the layers you can manupulate them separately.

## Example
<p>Here you can find an example </p>

## Usage

Include Leaflet.SelectFeature in your JavaScript project using `npm install leaflet-selectfeature`.

You can then include Leaflet.SelectFeature in your web application by adding the following HTML tags (paths below are relative to your project's root):

```
<script src="./lib/js/Leaflet.SelectFeature.js"></script>
```

Put it after leaflet is loaded.
Once your page is loaded you can easily use it by enable it like:
```javascript
var selectfeature = map.selectFeature.enable();
```

After the plugin is enabled the user can draw an area by holding the left mouse button and start drawing. You can disable the plugin by:
```javascript
selectfeature.disable();
```

Than the mouse events for drawing stop working with the map.

### Options
The following options are available with SelectFeature (showing you here with the default settings):

<dl>
  <dt>options{</dt>
    <dd>color : "green",</dd>
    <dd>weight : 2,</dd>
    <dd>dashArray : ' 5, 5, 1, 5',</dd>
    <dd>selCursor : 'crosshair',</dd>
    <dd>normCursor: ''</dd>
  <dt>}</dt>
</dl>  

You may modify the options once the plugin is enabled, for example;
```javascript
  selectfeature.options.color = '#663399' ;
  selectfeature.options.weight = 1 ;
```

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
