
export const GeoJsonPath = './data/traffic_accidents.geojson',
PopupFieds = ['5065','5055','5074'], //Popup will display these fields
CategoryField = '5074', //This is the fieldname for marker category (used in the pie and legend)
IconField = '5065', //This is the fieldame for marker icon
TileServer = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//tileAttribution = 'Map data: <a href="http://openstreetmap.org">OSM</a>',
RMax = 30; //Maximum radius for cluster pies