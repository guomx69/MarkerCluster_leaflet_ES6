/*ES6 Version : http://bl.ocks.org/gisminister/10001728*/
import L from "leaflet";

import "leaflet.heat";
import "leaflet.markercluster";

import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";//not needed if you use your own iconCreateFunction instead of the default one

import "./static/piescluster.css";
import "./static/heatermarkers.css";
import { TileServer} from "./libs/piesconsts";
import { pie_markers} from "./libs/pies";
import { heaterMarker } from "./libs/heatermarkers";

const key=""

const  url= `https://api.gateway.attomdata.com/parceltiles/{z}/{x}/{y}.png?apiKey=${key}`;

//const map=L.map("map").setView([59.95, 10.78], 8); //setView([59.95, 10.78], 8)  
const map=L.map("map").setView([29.73,-95.78], 15);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 14,attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
L.tileLayer(url,{ maxZoom:15}).addTo(map);
//L.tileLayer(TileServer,{ maxZoom:15}).addTo(map);
//heaterMarker(map); map.setView([41.3,69.3],12)
pie_markers(map);
