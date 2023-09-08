# Leaflet.SelectAreaFeature
Plugin that selects feature(s) by drawing an area on the map.

Supports Leaflet 1.0.0+ branches, tested with 1.2.0 and 1.9.4.

This plugin let the user draw an area, once it is activated, on the map by holding the left mouse button and moving it. As a developer you can get the layers that are within the bounding box of that area. Once you have the instances of the layers you can manipulate them separately.

![selectareafeature](https://user-images.githubusercontent.com/30185440/229522748-0f3a8be2-21b1-4a7d-a1e5-5a7a4f1e77a2.PNG)

## Features
* easy enable it
* easy disable it
* draw an area around the objects
* get instance(s) of all selected objects or only instances of polygon(s), polyline(s), marker(s), rectangle(s) and circle(s) 
* manipulate slected features 
* customisable

## Example
Here you can find a [demo](https://sandropibia.github.io/Leaflet.SelectAreaFeature/examples/index.html)


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
| color         | The color of the line when drawing. For example 'blue' , '#333333'| 'green'|```selectfeature.options.color = '#663399' ;```|
| weight | The weight of the line | 2 |```selectfeature.options.weight = 1 ;``` | 
| dashArray | Sets or read the stroke dash pattern of the line  | '5, 5, 1, 5' |```selectfeature.options.dasArray = '2, 2, 4, 2' ;``` |


### Methods
The following methods are supported by the plugin:

| Method                          | Input parameter   | Mandatory | Returns              | Description                                   |
|---------------------------------|-------------------|-----------|----------------------|-----------------------------------------------|
| getAreaLatLng                   |                   |           | Array of latlng      | Gets all the latlng of the latest drawn area on the map|
| removeAllArea                   |                   |           |                      | Removes all the drawn area from the map       |
| removeLastArea                  |                   |           |                      | Remove the latest drawn area from the map     |
| getFeaturesSelected(<i>layertype<i>)| <i>layertype</i> String| Yes       | Array of layers selected of <layertype>| <i>layertype</i> is one of the following values: 'polyline', 'polygon', 'rectangle', ' marker', 'circle' or 'all' |

### Events
The following events are raised by the plugin:

| Method                          | Parameters                | Description                                                      | Example Data    |
|---------------------------------|---------------------------|------------------------------------------------------------------|-------------|
| onDrawStart                     | Starting Point            | Event fired when user begins selection                           | ```{"latlng":{"lat":33.01447033717771,"lng":-96.82496721390636}}``` |
| onDrawEnd                       | Array of selection points | Event fired when user ends selection.  Note: array can be large. | ```[{"lat":33.00295088449869,"lng":-96.8394228955731},{"lat":32.98536856753931,"lng":-96.71727228909732},{"lat":32.932621581506616,"lng":-96.89001782331617},{"lat":32.93504675534242,"lng":-96.89146340824665}]``` |

How to subscribe to these events:
```javascript
map.on('onDrawStart', function(evData) {
  // Your handling code here
};
map.on('onDrawEnd', function(selectionLatLng) {
  // Your handling code here
};
```

## License
Leaflet.SelectAreaFeature is free software, and may be redistributed under the GPL-3.0 license.
