
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
</head>
<body>

<h1 id="header-1"><a href="#header-1"></a>Leaflet.SelectFeature</h1>
Plugin that selects feature(s) by drawing an area on the map

This plugin let the user draw an area on the map. As a developer you can get the layers that are within the bounding box of that area. Once you have the instances of the layers you can manupulate them separately.


<h2 id="header-2"><a href="#header-2"></a>Usage</h2>

Include Leaflet.SelectFeature in your JavaScript project using `npm install leaflet-selectfeature`.

You can then include Leaflet.SelectFeature in your web application by adding the following HTML tags (paths below are relative to your project's root):

...
<script src="./lib/js/Leaflet.SelectFeature.js"></script>
...

Put it after leaflet is loaded.
Once your page is loaded you can easily use it by enable it like:
<div class="language-js highlighter-rouge"><pre class="highlight"><code>
<span class="kd">var</span> <span class="nx">selectfeature</span> <span class="o">=</span> <span class="kd">map.selectFeature.enable();</span>
</code></pre>
</div>
After the plugin is enabled the user can draw an area by holding the left mouse button and start drawing. You can disable the plugin by:

selectfeature.disable();

Than the mouse events for drawing stop working with the map.

<h3 id="header-3"><a href="#header-3"></a>Options</h3>
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

<p>  selectfeature.options.color = '#663399' ;</p>
<p>  selectfeature.options.weight = 1 ;</p>

<h3 id="header-3"><a href="#header-3"></a>Methods</h3>
<p>The following methods are supported by the plugin:</p>




</body>
</html>
