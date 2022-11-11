import L from "leaflet";
import { arr } from "../data/heaterdata";

export const heaterMarker=(map)=>{
  const polygon = arr.map(({ bLatitude, bLongitude }) => [
    bLatitude,
    bLongitude,
    15
  ]);

      
    L.heatLayer(polygon).addTo(map);
    
    const markers=L.markerClusterGroup({
      chunkedLoading:true,
      singleMarkerMode:true,
      spiderfyOnMaxZoom:false
    });
    polygon.forEach(point=>{
      markers.addLayer(L.marker(point));
    });
    map.addLayer(markers);
} 