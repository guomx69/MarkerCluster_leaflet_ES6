import L from "leaflet";
import * as d3 from "d3";
import { groups} from "d3-array";
import {pie} from "d3-shape";

import {RMax, PopupFieds,IconField,CategoryField,GeoJsonPath} from "./piesconsts";

const _bake_pies=(options)=>{
  /*data and valueFunc are required*/
  if (!options.data || !options.valueFunc) return '';
  const {data,valueFunc,outerRadius=28,innerRadius=outerRadius-10,pieLabel=d3.sum(data,valueFunc),strokeWidth=1,pathClassFunc=()=>(''),pathTitleFunc=()=>(''),pieClass='marker-cluster-pie', pieLabelClass='marker-cluster-pie-label' }=options;
   
  let origo = (outerRadius+strokeWidth), //Center coordinate
   w = origo*2,h = w, //width and height of the svg element
   donut = pie(),
   arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
   
//Create an svg element
var svg = document.createElementNS(d3.namespaces.svg, 'svg');
//console.log(data);
//Create the pie chart
let vis = d3.select(svg).data([data]).attr('class', pieClass).attr('width', w).attr('height', h);

let arcs = vis.selectAll('g.arc').data(donut.value(valueFunc)).enter().append('svg:g')
           .attr('class', 'arc').attr('transform', 'translate(' + origo + ',' + origo + ')');

    arcs.append('svg:path').attr('class', pathClassFunc).attr('stroke-width', strokeWidth).attr('d', arc)
           .append('svg:title').text(pathTitleFunc);
                  
    vis.append('text').attr('x',origo).attr('y',origo).attr('class', pieLabelClass)
        .attr('text-anchor', 'middle').attr('dy','.3em').text(pieLabel);
  //Return the svg-markup rather than the actual element
  return _serialize_xmlnode(svg);
}

const _define_cluster_marker=({cluster,metadata})=>{
  //console.log("abc",metadata);
  let children = cluster.getAllChildMarkers(),
      mrkCount = children.length; //Get number of markers in cluster
  let strokeWidth = 1, //Set clusterpie stroke width
  r = RMax-2*strokeWidth-(mrkCount<10?12:(mrkCount<100?8:(mrkCount<1000?4:0))); //Calculate clusterpie radius...
  ////Build a dataset for the pie chart (replace d3.nest)
  let data=groups(children,d=>d.feature.properties[CategoryField]).map(d=>({key:d[0],values:d[1]}));
  //bake some svg markup
  let html = _bake_pies({data: data,
                      valueFunc: d=>d.values.length,
                      strokeWidth: strokeWidth,
                      outerRadius: r,
                      innerRadius: r-10,
                      pieClass: 'cluster-pie',
                      pieLabel: mrkCount,
                      pieLabelClass: 'marker-cluster-pie-label',
                      pathClassFunc: d=>"category-"+d.data.key,
                      pathTitleFunc: d=>metadata.fields[CategoryField].lookup[d.data.key]+' ('+d.data.values.length+' accident'+(d.data.values.length!=1?'s':'')+')'
                    }),
  //Create a new divIcon and assign the svg markup to the html property
  iconDim = (r+strokeWidth)*2, //...and divIcon dimensions (leaflet really want to know the size)
  myIcon = new L.DivIcon({
                        html: html,
                        className: 'marker-cluster', 
                        iconSize: new L.Point(iconDim, iconDim)
                    });

   return myIcon;

}

const _define_feature_popup=({feature, layer,metadata})=>{
  //console.log("abc",metadata);
  let props = feature.properties,fields = metadata.fields, popupContent = '';
    
  PopupFieds.map((key)=>{
      if (props[key]) {
        let val = props[key], label = fields[key].name;
        if (fields[key].lookup) val = fields[key].lookup[val];

        popupContent += '<span class="attribute"><span class="label">'+label+':</span> '+val+'</span>';
      }
  });
  popupContent = '<div class="map-popup">'+popupContent+'</div>';
  layer.bindPopup(popupContent,{offset: L.point(1,-2)});
}
const _define_feature_marker=(feature, latlng)=> {
      let categoryVal = feature.properties[CategoryField],
        iconVal = feature.properties[IconField];
      let myClass = 'marker category-'+categoryVal+' icon-'+iconVal;
      let myIcon = L.divIcon({
          className: myClass,
          iconSize:null
      });
      return L.marker(latlng, {icon: myIcon});
}


 /*Function for generating a legend with the same categories as in the clusterPie*/
const _render_legend=(mtdata)=>{
    var data = Object.entries(mtdata.fields[CategoryField].lookup),
      legenddiv = d3.select('body').append('div').attr('id','legend');
      
      legenddiv.append('div').classed('legendheading', true).text(mtdata.fields[CategoryField].name);

      var legenditems = legenddiv.selectAll('.legenditem').data(data);
        
       //console.log("abc",data);
       legenditems.enter().append('div').attr('class',(d)=>'category-'+d[0]).classed('legenditem',true).text((d)=>d[1]);

       return legenddiv;
  }
/*Helper function*/
const _serialize_xmlnode=(xmlNode)=>{
    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}



const pie_markers= async(map)=>{
    let metadata;
    const mrkClsterLyr=L.markerClusterGroup({
                      maxClusterRadius: 2*RMax,
                      iconCreateFunction: (cluster)=>_define_cluster_marker({cluster,metadata}), //this is where the magic happens(keep in the context)
                    });
    map.addLayer(mrkClsterLyr);
    try{
        const data = await d3.json(GeoJsonPath);
        //console.log(data)
        if (data.properties) {
            const geojson = data;
            metadata = data.properties;
            
            let markers = L.geoJson(geojson, {
                            pointToLayer: _define_feature_marker,
                            onEachFeature: (feature, layer)=>_define_feature_popup({feature, layer,metadata}) //keep in the context
                        });
            mrkClsterLyr.addLayer(markers);
            map.fitBounds(markers.getBounds());
            map.attributionControl.addAttribution(metadata.attribution);
            // let cstLegend=L.control({position:'bottomleft'});
            // cstLegend.onAdd=_render_legend(metadata);
            // cstLegend.addTo(map);
            _render_legend(metadata);
              
          } 
          else {
            console.log('Could not load data...');
          }
      }catch(error){
          console.log("error:",error);
    }
}

export {
  pie_markers
};