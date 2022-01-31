import React, {useContext,useEffect } from 'react';
import './MapViews.css'
import ReactMapGL,{Marker,Layer,Source} from 'react-map-gl';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './Layers';
const MapView = () => {
    const {sources, setSources} = useContext(SourceContext)
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 12,
        bearing: 0,
        pitch: 0
      });
    useEffect( () => {
      const fetchData =  async () => {
        try {
          const response = await SourceFinder.get("/sources");
          console.log(response);
          setSources(response.data.data.plass);
        } catch (error) {}
      };
  
    fetchData();    
    }, [])
      return (
        <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={"pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"} onViewportChange={setViewport} mapStyle="mapbox://styles/mapbox/streets-v11">
            <Source id="stasjoner" type="geojson" data={sources} cluster={true} clusterMaxZoom={14} clusterRadius={50} >
            <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
      </Source>
        </ReactMapGL>
        
      );
};

export default MapView;
