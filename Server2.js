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
const { json } = require("express");
const { match } = require("assert");
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
function createGeojson(array,kommuner,filter,sorting){
  let validKommuner = []
  for (kommune in kommuner.features) {
    let currentKommune = null
    if(array.filter((e)=>parseInt(e.RegionNumber)===kommuner.features[kommune].properties.kommunenummer)){
      const ContentObjects ={}
      sorting.ContentsCodes.map((ContentCode)=>{
        const KommuneFiltered = array.filter((e)=>parseInt(e.RegionNumber)===kommuner.features[kommune].properties.kommunenummer && e.ContentsCode===ContentCode);
        ContentObjects[ContentCode]=Object.fromEntries(KommuneFiltered.map((item) => [item["Tid"], item["value"]]));
      })
      currentKommune = kommuner.features[kommune]
      if (filter!=="none"){currentKommune.properties={...currentKommune.properties,...ContentObjects,...filter}}
      else{currentKommune.properties={...currentKommune.properties,...ContentObjects}}
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
    const url = req.query.url
    const sorting = JSON.parse(req.query.sorting)
    if(url && sorting && needsKommune==="true"){
      let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
      const kommuner = JSON.parse(rawData);
      const kommuner2 = JSON.parse(rawData);
      const values = await ssbCommunicate.fetchData(url);
      //fs.writeFileSync('./data1.json', JSON.stringify(values, null, 2), 'utf-8');
      let geoJson =null
      /* if(sorting.value !=="NoSortNeeded"){
        let filter={}
        if(sorting.options.length>0){
          sorting.options.map((option)=>{
            filter[option.id]=option.value
          })
        }
        const matching = values.filter((item) => Object.entries(filter).every(([key, value]) => item[key] === value));
        geoJson = createGeojson(matching,kommuner,filter,sorting)
        //fs.writeFileSync('./data2.json', JSON.stringify(geoJson, null, 2), 'utf-8');
      }
      else{
        geoJson = createGeojson(values,kommuner,"none",sorting)
      } */
      res.status(200).json({
        status:"sucsess",
        unSortedArray:values,
        kommuner:kommuner2})
    }
    else if(url && sorting && needsKommune==="false"){
      const values = await ssbCommunicate.fetchData(url);
      const geoJson = createGeojson(values.filter((items)=>items[Object.keys(sortingTypes)[0]]===sorting),kommuner)
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
