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
const { forEach } = require("lodash");
const {parse} = require('csv-parse');
const { default: axios } = require("axios");
 
const port = process.env.PORT || 3005;
//WEATHER Push test
app.get("/",async(req,res)=>{
  res.status(200).json({
    status:"success",
    data:"Welcome"
  })
})
//This is part of fetching data from frost.met.api
app.post("/api/v1/sources", async (req, res) => {
  let status = await vaerFunctions.fetchSources();
  console.log(status)
  if (status >0) {
    res.status(200).json({
      status: "success",
      data: {
        rows:status,
      },
    });   
  }
});
app.post("/api/v1/getAllSourcesWithValues", async (req, res) => {
  try {
    const fetchDetails=["mean(air_temperature P1M)","max(air_temperature P1M)","min(air_temperature P1M)"]
    let status = await vaerFunctions.fetchData(fetchDetails);
    console.log(status)
    if (status>0) {
      console.log("happend")
      res.status(200).json({
        status: "success",
        data: {
          value: status,
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/getWeatherDataForSource", async (req, res) => {
  try {
    const fetchDetails=["mean(air_temperature P1M)","max(air_temperature P1M)","min(air_temperature P1M)"]
    let status = await vaerFunctions.fetchWeatherData(fetchDetails);
    console.log(status)
    if (status>0) {
      res.status(200).json({
        status: "success",
        data: {
          value: status,
        },
      });
    }
  }
  catch (err) {
    console.log(err)
  }
});
//Weather data get
app.get("/api/v1/getWeatherData", async (req, res) => {
  try {
    const dato = req.query.dato;
    
    const resultDay = new Date(dato * 1e3).toISOString();
    const queryDate = resultDay.split("T")[0].split("-")[0]+'-'+resultDay.split("T")[0].split("-")[1]+'-01'
    console.log(resultDay.split("T")[0].split("-")[0]+'-'+resultDay.split("T")[0].split("-")[1]+'-01');

    /* var firstDay = new Date(resultDay.getFullYear(), resultDay.getMonth(), 1);
    console.log(firstDay) */
    const data = await db.query(
      "SELECT long,lat,name,s.source_id,s.valid_from,w.element,w.weather_id,value,time FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time =$2 AND d.element =$1;",
      [req.query.element, queryDate]
    );
    console.log(data)
    //console.log(data.rows)
    // Finn alle sources
    points = [{
      lat: 62.470663,
      lon: 6.176846,
      val: 16
    },
    {
      lat: 48.094903,
      lon: -1.371596,
      val: 20
    }];
    const pointstest = data.rows.map((row)=>{
      return {lat:parseFloat(row.lat),lon:parseFloat(row.long),val:-1}
    })
    //Deretter hent alle values og lag d til ett object
    res.status(200).json({
      status: "success",
      data: {
        points:pointstest,
        plass: GeoJSON.parse(data.rows, {
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
app.get("/api/v1/elements",async(req,res)=>{
  const data = await db.query("Select * from elements;")
  res.status(200).json({
    status:"success",
    data:{
      elements:data.rows
    }
  })
});
//SSB
app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const url = req.query.url
    const mapFormat=req.query.mapFormat
    let regionType= req.query.regionType
    if (url) {
      const values = await ssbCommunicate.fetchData(url)
      if(!regionType){
        regionType=values.regionType
      }
      //fs.writeFileSync('./data4.json', JSON.stringify(values.array, null, 2), 'utf-8');
      //const tempArray = values.array.filter((value)=>value.Region==="Nærøy")
      //console.log(tempArray)
      const data = SsbCombining.createGeojsonTest(values.array,regionType,values.sorting,mapFormat)
      //testchange
      res.status(200).json({
        status: "sucsess",
        geoJson: data.geoJson,
        sorting: data.sorting,
        options: values.sorting,
        name:values.name
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
