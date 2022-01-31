import React, {useContext,useEffect } from 'react';
import './MapViews.css'
import ReactMapGL,{Marker,Layer,Source} from 'react-map-gl';
import SourceFinder from '../../Apis/SourceFinder';
import { SourceContext } from '../../context/SourceContext';
const MapView = () => {
    const {sources, setSources} = useContext(SourceContext)
    const [viewport, setViewport] = React.useState({
        longitude: 10.757933,
        latitude: 59.91149,
        zoom: 14,
      });
    useEffect( () => {
      const fetchData =  async () => {
        try {
          const response = await SourceFinder.get("/sources");
          setSources(response.data.data.plass);
        } catch (error) {}
      };
  
    fetchData();    
    }, [])
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {type: 'Feature', geometry: {type: 'Point', coordinates: [-122.4, 37.8]}},
        {type:'Feature',geometry:{type:'Point', coordinates:[-120.4,36.5]}},
        {type:'Feature',geometry:{type:'Point', coordinates:[10.757933,59.91149]}},
      ]
    };
    const layerStyle = {
      id: 'point',
      type: 'circle',
      paint: {
        'circle-radius': 20,
        'circle-color': '#007cbf'
      }
    };
      const markers = React.useMemo(() => sources.map(city => {
          return(
          <Marker key={city.name} longitude={parseFloat(city.long)} latitude={parseFloat(city.lat)} offsetTop={-10}>
            <img src="https://pngimg.com/uploads/dot/small/dot_PNG29.png" />
          </Marker>)
      }
      ), [sources]);
      return (
        <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={"pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"} onViewportChange={setViewport} mapStyle="mapbox://styles/mapbox/streets-v11">
            <Source id="my-data" type="geojson" data={geojson} >
        <Layer {...layerStyle} />
      </Source>
        </ReactMapGL>
        
      );
};

export default MapView;
