import React, {useContext } from 'react';
import './MapViews.css'
import ReactMapGL,{Marker} from 'react-map-gl';
import { SourceContext } from '../../context/SourceContext';
const MapView = () => {
    const {sources, setSources} = useContext(SourceContext)
    const [viewport, setViewport] = React.useState({
        longitude: -122.45,
        latitude: 37.78,
        zoom: 14,
      });
    console.log(sources)
      const markers = React.useMemo(() => sources.map(city => {
          return(
          <Marker key={city.name} longitude={parseFloat(city.long)} latitude={parseFloat(city.lat)}>
            <img src="https://pngimg.com/uploads/dot/small/dot_PNG29.png" />
          </Marker>)
      }
      ), [sources]);
      return (
        <ReactMapGL {...viewport} width="100%" height="100%" mapboxApiAccessToken={"pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"} onViewportChange={setViewport} mapStyle="mapbox://styles/mapbox/streets-v11">
            {markers}
        </ReactMapGL>
      );
};

export default MapView;
