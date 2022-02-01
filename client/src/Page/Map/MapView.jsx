import React, { useContext, useEffect, useRef } from 'react';
import './MapViews.css';
import { useNavigate } from 'react-router-dom';
import ReactMapGL, { Marker, Layer, Source } from 'react-map-gl';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from './Layers';
const MapView = () => {
  const navigate = useNavigate()
  const { sources, setSources } = useContext(SourceContext)
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 12,
    bearing: 0,
    pitch: 0
  });
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
  const mapRef = useRef(null);

  const ShowMore = event => {
    if(mapRef.current.getMap().queryRenderedFeatures(event.point,{layers:['unclustered-point']}).length>=2){
      mapRef.current.getMap().getCanvas().style.cursor="pointer"
      const aktuelle = mapRef.current.getMap().queryRenderedFeatures(event.point,{layers:['unclustered-point']})
      console.log(aktuelle[0].properties.id)
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
    <ReactMapGL  {...viewport} width="100%" height="100%" getCursor={getCursor} interactiveLayerIds={[clusterLayer.id,unclusteredPointLayer.id]} mapboxApiAccessToken={"pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"} clickRadius={2} onViewportChange={setViewport} mapStyle="mapbox://styles/mapbox/streets-v11" onClick={ShowMore} ref={mapRef}>
      <Source id="stasjoner" type="geojson" data={sources} cluster={true} clusterMaxZoom={14} clusterRadius={50}  >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer} />
      </Source>
    </ReactMapGL>

  );
};

export default MapView;
