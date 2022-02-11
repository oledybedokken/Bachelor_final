import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import "./MapViews.css";
import ReactMapGL, { Marker, Layer, Source, Popup } from "react-map-gl";
import SourceFinder from "../../Apis/SourceFinder";
import { SourceContext } from "../../context/SourceContext";
import {
  clusterLayer,
  clusterCountLayer,
  unclusteredPointLayer,
} from "./Layers";
import RenderLineChart from "../SourceTesting/RenderLineChart";
const MapView = () => {
  const { sources, setSources } = useContext(SourceContext);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [viewport, setViewport] = React.useState({
    longitude: 10.757933,
    latitude: 59.91149,
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });
  const mapRef = useRef(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await SourceFinder.get("/sources");
        setSources(response.data.data.plass);
      } catch (error) {}
    };
    if(sources === null){fetchData();}
  }, []);
  /* const RecordsAfterPagingAndSorting=()=>{
    return sources.filter
  } */
  const onMouseEnter = useCallback(event =>{
    if (event.features[0].layer.id === "unclustered-point"){
      const hoverInfoNu = {
        id:event.features[0].id
      } //Må ha denne for å sørge for å oppdatere

      setHoverInfo({
        long:event.features[0].geometry.coordinates[0],
        lat:event.features[0].geometry.coordinates[1],
        id:hoverInfoNu.id,
        name:event.features[0].properties.name
      });
      const map = mapRef.current.getMap();
      map.getCanvas().style.cursor = "pointer";
      map.setFeatureState({
        source:"stasjoner",
        id:hoverInfoNu.id
      },
      {hover:true})
    }
  })
  const onMouseLeave = useCallback(event =>{
    if(hoverInfo){
      const map = mapRef.current.getMap();
      map.getCanvas().style.cursor = "";
      setHoverInfo({
        id:hoverInfo.id,
        name:null
      });
      map.setFeatureState({
        source:"stasjoner",
        id:hoverInfo.id
      },
      {hover:false})
    }
    }
  );
  const ShowMore = (event) => {
    if (event.features[0].layer.id === "unclustered-point") {
      const feature = event.features[0];
      mapRef.current.getMap()
      
    } else {
      const feature = event.features[0];
      const clusterId = feature.properties.cluster_id;
      const mapboxSource = mapRef.current.getMap().getSource("stasjoner");
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }
        setViewport({
          ...viewport,
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1],
          zoom,
          transitionDuration: 500,
        });
      });
    }
  };
  const selectedSource = (hoverInfo && hoverInfo.name) || "";
  return (
    <ReactMapGL
      {...viewport}
      width="100%"
      height="100%"
      onMouseLeave={onMouseLeave}
      interactiveLayerIds={["unclustered-point", "clusters"]}
      mapboxApiAccessToken={
        "pk.eyJ1Ijoib2xlZHliZWRva2tlbiIsImEiOiJja3ljb3ZvMnYwcmdrMm5vZHZtZHpqcWNvIn0.9-uQhH-WQmh-IwrA6gNtUg"
      }
      clickRadius={2}
      onViewportChange={setViewport}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      onClick={ShowMore}
      onMouseEnter={onMouseEnter}
      ref={mapRef}
    >
      <Source
        id="stasjoner"
        type="geojson"
        data={sources}
        generateId={true}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...unclusteredPointLayer}/>
      </Source>
      {selectedSource && (
        <Popup
          longitude={hoverInfo.long}
          latitude={hoverInfo.lat}
          closeButton={false}
          className="county-info"
        >
          <RenderLineChart data={hoverInfo}></RenderLineChart>
        </Popup>
      )}
    </ReactMapGL>
  );
};

export default MapView;
