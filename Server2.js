require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
const fetch = require("node-fetch");
var GeoJSON = require("geojson");
const fs = require("fs");
const sammenSlaaing = require("./sammenSlaaing.js");
const inntektLaging = require("./tools/inntekt.js");
const vaerFunctions = require("./tools/vaer.js");
const ssbCommunicate = require("./tools/ssbCommunicate.js");
const { time } = require("console");
const port = process.env.PORT || 3001;
//WEATHER
app.post("/api/v1/sources", async (req, res) => {
  let status =await vaerFunctions.fetchSources();
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
app.post("/api/v1/getWeatherDataForSource",async(req,res)=>{
    try{
        let status = await vaerFunctions.fetchWeatherData();
        if(status==="success"){
            res.status(200).json({
                status: "success",
                data: {
                  value: "Oppdatert",
                },
              });
        }
    }
    catch(err){
        console.log(err)
    }
});
//SSB
app.get("/api/v1/kommuner",async(req,res)=>{
  try{
    let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
    let kommuner = JSON.parse(rawData);
    res.status(200).json({
      status:"sucsess",
      kommuner:kommuner});
  }catch(err){
    console.log(err)
    res.status(500)
  }
})
function createGeojson(newArray,kommuner){
  let validKommuner = []
  for (kommune in kommuner.features) {
    let currentKommune = null
    if (newArray.find((e) => parseInt(e.RegionNumber) === kommuner.features[kommune].properties.kommunenummer)) {
      currentKommune = kommuner.features[kommune]
      currentKommune.properties = newArray.find((e) => parseInt(e.RegionNumber) === kommuner.features[kommune].properties.kommunenummer)
      validKommuner.push(currentKommune)
    }
  }
  let geoJson = {
    "type": "FeatureCollection",
    "features": validKommuner
  }
  return geoJson
}
app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const needsKommune = req.query.needsKommune
    const sorting = req.query.sortValue
    const url = req.query.url
    const sortingTypes = req.query.sortingTypes
    if(url && sorting && needsKommune==="true"){
      let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
      let kommuner = JSON.parse(rawData);
      const values = await ssbCommunicate.fetchData(url);
      const geoJson = createGeojson(values.filter((items)=>items[sortingTypes]===sorting),kommuner)
      res.status(200).json({
        status:"sucsess",
        sortedArray:geoJson,
        unSortedArray:values,
        kommuner:kommuner})
    }
    else if(url && sorting && needsKommune==="false"){
      const values = await ssbCommunicate.fetchData(url);
      const geoJson = createGeojson(values.filter((items)=>items[sortingTypes]===sorting),kommuner)
      res.status(200).json({
        sortedArray:geoJson,
        unSortedArray:values})
    }
    else{
      const yourMessage="Manglet link eller sorting"
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
