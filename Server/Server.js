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
const sammenSlaaing = require("./sammenSlaaing.js");
const inntektLaging = require("./tools/inntekt.js");
const SsbCombining = require("./tools/SsbCombining.js")
const vaerFunctions = require("./tools/vaer.js");
const ssbCommunicate = require("./tools/ssbCommunicate.js");
const { time } = require("console");
const { json } = require("express");
const { match } = require("assert");
const { forEach } = require("lodash");
const {parse} = require('csv-parse')
 
const port = process.env.PORT || 3005;
//WEATHER Push test
app.get("/",async(req,res)=>{
  res.status(200).json({
    status:"success",
    data:"Welcome"
  })
})
app.post("/api/v1/sources", async (req, res) => {
  let status = await vaerFunctions.fetchSources();
  console.log(status)
  if (status === "sucsess") {
    res.status(200).json({
      status: "success",
      data: {
        value: "Data oppdatert!",
      },
    });
  }
});
app.post("/api/v1/getAllSourcesWithValues", async (req, res) => {
  try {
    let status = await vaerFunctions.fetchData();
    if (status === "all added") {
      res.status(200).json({
        status: "success",
        data: {
          value: "Oppdatert",
        },
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/getWeatherDataForSource", async (req, res) => {
  try {
    let status = await vaerFunctions.fetchWeatherData();
    if (status === "success") {
      res.status(200).json({
        status: "success",
        data: {
          value: "Oppdatert",
        },
      });
    }
  }
  catch (err) {
    console.log(err)
  }
});
//SSB


app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const url = req.query.url
    const mapFormat=req.query.mapFormat
    console.log(mapFormat)
    if (url) {
      let rawData = fs.readFileSync("./Assets/kommuner2021.geojson");
      const kommuner = JSON.parse(rawData);
      const values = await ssbCommunicate.fetchData(url)
      //fs.writeFileSync('./data3.json', JSON.stringify(values.array, null, 2), 'utf-8');
      
      //const tempArray = values.array.filter((value)=>value.Region==="Malvik")
      const data = SsbCombining.createGeojsonTest(values.array, kommuner, values.sorting,mapFormat)
      //fs.writeFileSync('./data2.json', JSON.stringify(data, null, 2), 'utf-8');
      //testchange
      res.status(200).json({
        status: "sucsess",
        geoJson: data.geoJson,
        sorting: data.sorting,
        options: values.sorting
      })
    }
    else {
      const yourMessage = "Manglet link"
      res.status(400).send(yourMessage);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
