import React, { useContext, useEffect, useRef,useState,useCallback } from 'react';
import './MapViews.css';
import { useNavigate } from 'react-router-dom';
import ReactMapGL, { Marker, Layer, Source } from 'react-map-gl';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './Layers';
const MapView = () => {
  const navigate = useNavigate()
  const [color,setColor]=useState("#11b4da") //Dette er bare midlertidig tror jeg
  const { sources, setSources } = useContext(SourceContext)
  const [selectedSource,SetSelectedSource] = useState(null)
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });
  const mapRef = useRef(null);
  
  function getCursor({isHovering, isDragging}) {
    return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/sources");
        setSources(response.data.data.plass);
      } catch (error) { }
    };
    fetchData();
  }, [])
  
  const onMouseEnter = useCallback(event =>{
    const source = event.features && event.features[0]
    if (event.features[0].layer.id==="unclustered-point"){
        setColor("#FFFF00")
    }
  })

  const onMouseLeave=useCallback(event =>{
      setColor("#11b4da")
  })
  const ShowMore = event => {
    if(event.features[0].layer.id==="unclustered-point"){
      const feature = event.features[0];
      console.log(feature)
      mapRef.current.getMap().getCanvas().style.cursor="pointer"
    }else{
    const feature = event.features[0];
    const clusterId = feature.properties.cluster_id;
    const mapboxSource = mapRef.current.getMap().getSource('stasjoner');
    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }
      setViewport({
        ...viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom,
        transitionDuration: 500
      });
    });
  }
  };
  return (
    <ReactMapGL  {...viewport} width="100%" height="100%" onMouseLeave={onMouseLeave} getCursor={getCursor} onMouseEnter={onMouseEnter} interactiveLayerIds={[clusterLayer.id,unclusteredPointLayer.id]} mapboxApiAccessToken={"pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"} clickRadius={2} onViewportChange={setViewport} mapStyle="mapbox://styles/mapbox/streets-v11" onClick={ShowMore} ref={mapRef}>
      <Source id="stasjoner" type="geojson" data={sources} cluster={true} clusterMaxZoom={14} clusterRadius={50}  >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} paint={{"circle-color":color,"circle-radius":8,'circle-stroke-width': 1,'circle-stroke-color': '#fff'}}/>
      </Source>
      {selectedSource && (
          <Popup
            longitude={hoverInfo.longitude}
            latitude={hoverInfo.latitude}
            closeButton={false}
            className="county-info"
          >
            {selectedCounty}
          </Popup>
        )}
    </ReactMapGL>

  );
};

export default MapView;
