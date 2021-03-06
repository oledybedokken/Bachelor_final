require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());
const db = require("./db");
const fetch = require("node-fetch");
var GeoJSON = require("geojson");
const fs = require("fs");
//const inntektLaging = require("./Waste/inntekt.js");
const SsbCombining = require("./tools/SsbCombining.js")
const vaerFunctions = require("./tools/vaer.js");
const ssbCommunicate = require("./tools/ssbCommunicate.js");
const { time } = require("console");
const { json } = require("express");
const { match } = require("assert");
const { forEach, times, union } = require("lodash");
const { parse } = require('csv-parse');
const { default: axios } = require("axios");

const port = process.env.PORT || 3005;
//WEATHER Push test
app.get("/", async (req, res) => {
  console.log("The api has been hit debug!")
  res.status(200).json({
    status: "success",
    data: "Welcome"
  })
})
//This is part of fetching data from frost.met.api
app.post("/api/v1/sources", async (req, res) => {
  //let status = await vaerFunctions.fetchSources();
  const status = "this has been disabled for now as it is for future work"
    res.status(200).json({
      status: "success",
      data: {
        statusMessage: status,
      },
    });
});
app.post("/api/v1/getAllSourcesWithValues", async (req, res) => {
  try {
    const fetchDetails = ["mean(air_temperature P1M)", "max(air_temperature P1M)", "min(air_temperature P1M)"]
    //let status = await vaerFunctions.fetchData(fetchDetails);
    const status = "this has been disabled for now as it is for future work"
      res.status(200).json({
        status: "success",
        data: {
          statusMessage: status,
        },
      });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/getWeatherDataForSource", async (req, res) => {
  try {
    const fetchDetails = ["mean(air_temperature P1M)", "max(air_temperature P1M)", "min(air_temperature P1M)"]
    //let status = await vaerFunctions.fetchWeatherData(fetchDetails);
    const status = "this has been disabled for now as it is for future work"
      res.status(200).json({
        status: "success",
        data: {
          statusMessage: status,
        },
      });
    }
  catch (err) {
    console.log(err)
  }
});
app.get("/api/v1/getSpecificStations",async(req,res)=>{
  try{
    const graphData = await db.query("SELECT * FROM weather_data w INNER JOIN weather s on w.weather_id=s.weather_id where w.element='mean(air_temperature P1M)' and s.source_id='SN61630' ORDER BY w.time;")
    res.status(200).json({
      status:"success",
      data:{
        graph_values:graphData.rows
      }
    })
  }
  catch(err){
    res.sendStatus(500);
  }
})
//Weather data get
app.get("/api/v1/getWeatherData", async (req, res) => {
  try {
    const dato = req.query.dato;
    const resultDay = new Date(dato * 1e3).toISOString();
    const queryDate = resultDay.split("T")[0].split("-")[0] + '-' + resultDay.split("T")[0].split("-")[1] + '-01';
    /* var firstDay = new Date(resultDay.getFullYear(), resultDay.getMonth(), 1);
    console.log(firstDay) */
    const data = await db.query(
      "SELECT DISTINCT(d.time),long,lat,name,s.source_id,s.valid_from,w.element,w.weather_id,value,time FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time =$2 AND d.element =$1;",
      [req.query.element, queryDate]
    );
    //const data2 = await db.query('SELECT (st_dump(ST_VoronoiPolygons(st_collect(geog::geometry)))).geom FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time =$2 AND d.element =$1;',[req.query.element, queryDate]);
    // Finn alle sources
    const timesData = await db.query("SELECT DISTINCT time from weather_data where element =$1", [req.query.element]);
    const pointsForInterpolate = data.rows.map((row) => {
      return { lat: parseFloat(row.lat), lon: parseFloat(row.long), val: row.value }
    })
    //fs.writeFileSync('./data4.json', JSON.stringify(pointsForInterpolate, null, 2), 'utf-8');
    //Deretter hent alle values og lag d til ett object
    //const test = 'SELECT ST_AsText((ST_DumpPoints(ST_ConvexHull(st_collect(geog::geometry)))).geom) FROM(SELECT geog FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time ='+queryDate+' AND d.element ='+req.query.element+')As x';
    const delimitation = await db.query("SELECT ST_AsText((ST_DumpPoints(ST_ConvexHull(st_collect(geog::geometry)))).geom),ST_X((ST_DumpPoints(ST_ConvexHull(st_collect(geog::geometry)))).geom),ST_Y((ST_DumpPoints(ST_ConvexHull(st_collect(geog::geometry)))).geom) FROM(SELECT geog FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time =$2 AND d.element =$1)As x;", [req.query.element, queryDate])
    const RasterReponse = await db.query(`
WITH myvalues AS(
  SELECT
  st_Collect(ST_PointZ(st_x(geog::geometry), st_y(geog::geometry), "zvalue"::float)) as geom
  from (SELECT geog,d.value as zvalue FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time ='${queryDate}' AND d.element ='${req.query.element}') as sources
  ),inputs AS (
    SELECT
      500::float8 AS pixelsize,
      'invdist:power:3:smoothing:2.0' AS algorithm,
      ST_Expand(geom, 10000) AS ext
    FROM myvalues
  ),
  sizes AS (
    SELECT
      ceil((ST_XMax(ext) - ST_XMin(ext))/pixelsize)::integer AS width,
      ceil((ST_YMax(ext) - ST_YMin(ext))/pixelsize)::integer AS height,
      ST_XMin(ext) AS upperleftx,
      ST_YMax(ext) AS upperlefty
    FROM inputs
  ),
 interpolate AS(
SELECT ST_InterpolateRaster(
    geom,
    'invdist:power:3:smoothing:2.0',
    ST_AddBand(ST_MakeEmptyRaster(100, 100, 1.5, 72, 0.3, -0.17, 0, 0), '16BSI')
) as geom from myvalues,sizes,inputs)

SELECT row_to_json(fc) 
  FROM 
    (SELECT 'FeatureCollection' as type, array_to_json(array_agg(feats)) as features 
      FROM 
         (SELECT 'Feature' as type, 
                 st_asgeojson((gv).geom)::json as geometry, 
                 row_to_json((SELECT props FROM (SELECT (gv).val as value) as props )) as properties  
            FROM 
                (SELECT 
                    ST_PixelAsPolygons(
                       ST_SetValue(
                         ST_SetValue(
                             ST_AddBand(
                                 (select geom from interpolate), 
                            '8BUI'::text, 1, 0),
                        2, 2, 10), 
                     1, 1, NULL)
               ) gv 
          ) json
    ) feats 
) fc;
  `)
    //const delimitation = await db.query("SELECT ST_AsText((ST_DumpPoints(ST_ConvexHull(st_collect(geog::geometry)))).geom) FROM(SELECT geog FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time ='1999-12-01' AND d.element ='mean(air_temperature P1M)')As x;")
    let reformattedTime = timesData.rows.map(obj => {
      return obj.time
    })
    console.log(RasterReponse.rows[0].row_to_json.features.length)
    const convertedDelimitation = delimitation.rows.map((row) => { return { lat: row.st_y, lon: row.st_x } })
    res.status(200).json({
      status: "success",
      data: {
        rasterResponse: RasterReponse.rows[0].row_to_json,
        points: pointsForInterpolate,
        delimitation: convertedDelimitation,
        timesData: reformattedTime,
        sourceData: GeoJSON.parse(data.rows, {
          Point: ["lat", "long"],
          include: ["source_id", "name", "value", "time"],
        }),
      },
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});
app.get("/api/v1/elements", async (req, res) => {
  const data = await db.query("Select * from elements;")
  res.status(200).json({
    status: "success",
    data: {
      elements: data.rows
    }
  })
});

/* app.get("/api/v1/testQuery", async (req, res) => {
  try {

    //console.log(testrestult.rows[0].row_to_json.features.length)
    res.status(200).json({
      status: "sucsess",
      geoJson: testrestult.rows[0].row_to_json
    })
    //fs.writeFileSync('./data4.json', JSON.stringify(testrestult.rows[0].row_to_json, null, 2), 'utf-8');
  } catch (err) {
    console.log(err)
    res.status(400).send(err)
  }
}) */
//SSB
app.get
app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const url = req.query.url
    const mapFormat = req.query.mapFormat
    let regionType = req.query.regionType
    if (url) {
      const values = await ssbCommunicate.fetchData(url)
      if (!regionType) {
        regionType = values.regionType
      }
      //
      //const tempArray = values.array.filter((value)=>value.Region==="N??r??y")
      //console.log(tempArray)
      const data = SsbCombining.createGeojsonTest(values.array, regionType, values.sorting, mapFormat)
      //testchange
      res.status(200).json({
        status: "sucsess",
        geoJson: data.geoJson,
        sorting: data.sorting,
        options: values.sorting,
        name: values.name
      })
    }
    else {
      const yourMessage = "Manglet link"
      res.status(400).send(yourMessage);
    }
  } catch (err) {
    console.log(err)
    res.status(500).send();
  }
});
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
