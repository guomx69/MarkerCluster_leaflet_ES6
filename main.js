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

const map=L.map("map").setView([59.95, 10.78], 8);
L.tileLayer(TileServer,{ maxZoom:19}).addTo(map);
//heaterMarker(map); map.setView([41.3,69.3],12)
pie_markers(map);
