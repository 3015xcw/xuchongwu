var btn, field, type, data, chartExpand;
var p = new Array();
var field = "GDP";
var type = "bar";
require([
	"esri/Map",
	"esri/layers/GeoJSONLayer",
	"esri/views/MapView",
	"esri/widgets/Legend",
	"esri/widgets/Expand",
	"esri/layers/CSVLayer",
	"esri/geometry/geometryEngine",
	"esri/Graphic"
], function(Map, GeoJSONLayer, MapView, Legend, Expand, CSVLayer, geometryEngine, Graphic) {
	var basemaps = [
		"osm",
		"hybrid",
		"streets"
	];
	var slt = document.getElementById("slt");
	slt.addEventListener('change', function(e) {
		var index = slt.selectedIndex;
		field = slt.options[index].text;
		if (field == "GDP") {
			p[0] = data.GDP2012;
			p[1] = data.GDP2013;
			p[2] = data.GDP2014;
			p[3] = data.GDP2015;
			p[4] = data.GDP2016;
			getChart(p, field, type);
		} else if (field == "GDP增速") {
			p[0] = data.speed2012;
			p[1] = data.speed2013;
			p[2] = data.speed2014;
			p[3] = data.speed2015;
			p[4] = data.speed2016;
		} else if (field == "人口POP") {
			p[0] = data.POP2012;
			p[1] = data.POP2013;
			p[2] = data.POP2014;
			p[3] = data.POP2015;
			p[4] = data.POP2016;
		}
		getChart(p, field, type);
	});
	var slt2 = document.getElementById("slt2");
	slt2.addEventListener('change', function(e) {
		var index = slt2.selectedIndex;
		type = slt2.options[index].value;
		getChart(p, field, type);
	})

	btn = function(value, key, d) {
		data = d;
		p[0] = data.GDP2012;
		p[1] = data.GDP2013;
		p[2] = data.GDP2014;
		p[3] = data.GDP2015;
		p[4] = data.GDP2016;
		getChart(p, field, type);
	}

	var ppt = {
		title: "{NAME_2}",
		content: [{
				type: "fields",
				fieldInfos: [{
						fieldName: "area",
						label: "面积(单位：平方千米)"
					},
				]
			},
			{
				type: "text",
				text: '{2012GDP:btn}'
			}
		]
	};
	var defaultSym = {
		type: "simple-fill",
		outline: {
			color: "#AEEEEE",
			width: "0.5px"
		}
	};
	var renderer = {
		type: "simple",
		symbol: defaultSym,
		label: "湖北省各市区",
		visualVariables: [{
			type: "color",
			field: "area",
			legendOptions: {
				title: "面积"
			},
			stops: [{
					value: 10000,
					color: "rgb(255,192,203)",
					label: "10000"
				},
				{
					value: 20000,
					color: "rgb(220,120,140)",
					label: "20000"
				},
				{
					value: 30000,
					color: "rgb(150,60,80)",
					label: "30000"
				}
			]
		}]
	};
	chartExpand = new Expand({
		expandIconClass: "esri-icon-chart",
		expandTooltip: "Population pyramid chart",
		expanded: false,
		view: view,
		content: document.getElementById("mychart")
	});
	var geojsonLayer = new GeoJSONLayer({
		title: "武汉市中心城区",
		url: "https://3015xcw.github.io/gis/hubeishi.json",
		popupTemplate: ppt,
		renderer: renderer
	});
	
	var map = new Map({
		basemap: basemaps[0]
	});
	var view = new MapView({
		container: "viewDiv",
		center: [112, 31],
		zoom: 7,
		map: map
	});
	var layers = [
		"武汉市中心城区",
		"武汉轨道交通站点"
	];
	view.ui.add(chartExpand, "top-right");
	view.ui.add(
		new Legend({
			view: view
		}),
		"bottom-left"
	);
	//显示比例尺，经纬度
	var coordsWidget = document.createElement("div");
	coordsWidget.id = "coordsWidget";
	coordsWidget.className = "esri-widget esri-component";
	coordsWidget.style.padding = "7px 15px 5px";

	view.ui.add(coordsWidget, "bottom-right");

	function showCoordinates(pt) {
		var coords = "Lat/Lon " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) +
			" | Scale 1:" + Math.round(view.scale * 1) / 1 +
			" | Zoom " + view.zoom;
		coordsWidget.innerHTML = coords;
	}

	view.watch("stationary", function(isStationary) {
		showCoordinates(view.center);
	});

	view.on("pointer-move", function(evt) {
		showCoordinates(view.toMap({
			x: evt.x,
			y: evt.y
		}));
	});
	document.querySelector(".btns").addEventListener("click", function(event) {
		var id = event.target.getAttribute("value");
		if (id) {
			view.map.basemap = basemaps[id];
		}
	});
	var select = document.getElementById("test");
	var FeatureLayers = [geojsonLayer];
	var x = 0;
	document.querySelector(".checks").addEventListener("click", function(event) {
		var id = event.target.getAttribute("id");
		if (document.getElementById(id).checked) {
			select.options.add(new Option(layers[id], id));
			select.options[x].selected = "selected";
			x++;
			view.map.add(FeatureLayers[id]);
		} else {
			for (var i = 0; i < select.length; i++) {
				if (select.options[i].value == id) {
					select.options.remove(i);
					x--;
					view.map.remove(FeatureLayers[id]);
				}
			}
		}
	});
	
});
