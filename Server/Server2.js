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

app.get("/api/v1/kommuner", async (req, res) => {
  try {
    let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
    let kommuner = JSON.parse(rawData);
    res.status(200).json({
      status: "sucsess",
      kommuner: kommuner
    });
  } catch (err) {
    console.log(err)
    res.status(500)
  }
})

function createGeojsonTest(array, kommuner,sorting) {
  const fn = ([{ options }, ...rest]) => options.reduce((a, v) => ({
    ...a,
    [v]: rest.length ? fn(rest) : null
  }), {});
  const result = fn(sorting.options);
  const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
  const arrayOfEntries = sorting.options.map(({ id, options }) => options.map(option => [[id, option]]));
  const cartesianProduct = cartesian(...arrayOfEntries);
  const arrayOfObjects = cartesianProduct.map(arr => Object.fromEntries(arr))
<<<<<<< Updated upstream
  const newArray = kommuner.features.map((kommune)=>{
    const currentArray = array.filter((e)=>e.RegionNumber===kommune.properties.kommunenummer)
=======
  const unique = [...new Set(array.map(item => item.RegionNumber))];
  const newArray = []
  unique.forEach((currentKommune) => {
    const currentArray = array.filter((e) => e.RegionNumber === currentKommune)
    const resultCopy = JSON.parse(JSON.stringify(result))
    if (currentArray.length > 0) {
      arrayOfObjects.forEach((objectFilter) => {
        const matching = currentArray.filter((item) => Object.entries(objectFilter).every(([key, value]) => item[key] === value));
        let ContentObjects = {}
        sorting.ContentsCodes.map((ContentCode) => {
          const values = matching.filter((e) => e.ContentsCode === ContentCode.label)
          if (values.hasOwnProperty("gyldigTil")) {
            if (Object.keys(Object.fromEntries(values.filter((item) => parseInt(item["Tid"]) < item["gyldigTil"]).map((item) => [item["Tid"], item["value"]]))).length !== 0) {
              ContentObjects[ContentCode.label] = Object.fromEntries(values.filter((item) => parseInt(item["Tid"]) < item["gyldigTil"]).map((item) => [item["Tid"], item["value"]]));
            }
          }
          else { ContentObjects[ContentCode.label] = Object.fromEntries(values.map((item) => [item["Tid"], item["value"]])); }
        })
        if (Object.keys(ContentObjects).length !== 0) {
          resultCopy[Object.values(objectFilter)[0]][Object.values(objectFilter)[1]] = ContentObjects
        }
      })
      const checkKommune = element => element.properties.Kommunenummer == currentArray[0].RegionNumber;
      if (!kommuner.features.some(checkKommune)) {
        const value = FindNewest(kommunerEndringer, currentArray[0].RegionNumber)
        if(value.newNr==="3014"){
          console.log(currentArray[0].RegionNumber)
        }
        currentArray[0].RegionNumber = value["newNr"]
        currentArray[0].Region = value["newNavn"]
      }
      if (resultCopy[Object.values(arrayOfObjects[0])[0]][Object.values(arrayOfObjects[0])[1]] !== null) {
        newArray.push({
          "Region": currentArray[0].Region,
          "RegionNumber": currentArray[0].RegionNumber,
          ...currentArray[0].properties,
          ...resultCopy
        })
      }
    }
  })

  //fs.writeFileSync('./data3.json', JSON.stringify(newArray, null, 2), 'utf-8');
  const foundDuplicateName = newArray.reduce((p, next) => {
    if (p.RegionNumber.includes(next.RegionNumber)) {
      p.dups.push(next)
    } else {
      p.RegionNumber.push(next.RegionNumber);
    }
    return p;
  }, {
    RegionNumber: [],
    dups: []
  })
  const NotUnique = [...new Set(foundDuplicateName.dups.map(item => item.RegionNumber))];
  console.log(NotUnique)
  const problemArray = []
  NotUnique.slice(0,1).map((duplicate)=>{
    const duplicates = newArray.filter((e)=>e.RegionNumber===duplicate);
    const keys = Object.keys(duplicates[0]).filter((e)=>e!=="Region"&&e!=="RegionNumber")
    keys.map((key)=>{
      if(Object.keys(duplicates[0][key]).length>0){
        Object.keys(duplicates[0][key]).map((test)=>{

        })
      }
    })
    problemArray.push(duplicates)
  })
  //just a change
  fs.writeFileSync('./data4.json', JSON.stringify(problemArray, null, 2), 'utf-8');
  const secondNewArray = kommuner.features.map((kommune) => {
    let obj = newArray.find(o => o.RegionNumber === kommune.properties.Kommunenummer);
    return {
      ...kommune,
      properties: {
        ...kommune.properties,
        ...obj
      }
    }
  })
  
  /* const newArray = kommuner.features.map((kommune) => {
    const currentArray = array.filter((e) => e.RegionNumber === kommune.properties.Kommunenummer)
>>>>>>> Stashed changes
    const resultCopy = result
    if(currentArray.length>0){
      arrayOfObjects.forEach((objectFilter)=>{
        const matching = currentArray.filter((item) => Object.entries(objectFilter).every(([key, value]) => item[key] === value));
        let ContentObjects={}
        sorting.ContentsCodes.map((ContentCode)=>{
          const values = matching.filter((e)=>e.ContentsCode===ContentCode.label)
          ContentObjects[ContentCode.label]=Object.fromEntries(values.map((item) => [item["Tid"], item["value"]]));
          })
          resultCopy[Object.values(objectFilter)[0]][Object.values(objectFilter)[1]]=ContentObjects
        })
      return {
        ...kommune,
        properties:{
          ...kommune.properties,
          ...resultCopy
        }
      }
    }
    else{
      return{...kommune}
    }
  })
  let geoJson = {
    "type": "FeatureCollection",
    "features": newArray
  }
  return {"geoJson":geoJson,"sorting":arrayOfObjects}
}
//Test
function createGeojson(array, kommuner, filter, sorting) {
  let validKommuner = []
  const testFilter = {}
  for (kommune in kommuner.features) {
    let currentKommune = null
    if (array.filter((e) => parseInt(e.RegionNumber) === kommuner.features[kommune].properties.kommunenummer)) {
      const ContentObjects = {}
      sorting.ContentsCodes.map((ContentCode) => {
        const KommuneFiltered = array.filter((e) => parseInt(e.RegionNumber) === kommuner.features[kommune].properties.kommunenummer && e.ContentsCode === ContentCode);
        ContentObjects[ContentCode] = Object.fromEntries(Filterd.map((item) => [item["Tid"], item["value"]]));
      })
      currentKommune = kommuner.features[kommune]
      if (filter !== "none") { currentKommune.properties = { ...currentKommune.properties, ...ContentObjects, ...filter } }
      else { currentKommune.properties = { ...currentKommune.properties, ...ContentObjects } }
      validKommuner.push(currentKommune)
    }
  }
  let geoJson = {
    "type": "FeatureCollection",
    "features": validKommuner
  }
  return geoJson
}
app.get("/api/v1/incomejsonTest", async (req, res) => {
  try {
    const needsKommune = req.query.needsKommune
    const url = req.query.url
    //const sorting = JSON.parse(req.query.sorting)
    let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
    const kommuner = JSON.parse(rawData);
    if (url && needsKommune === "true") {
      const values = await ssbCommunicate.fetchData(url);
      console.log(values.sorting)
      const test=createGeojsonTest(values.array,kommuner,values.sorting)
      //fs.writeFileSync('./data1.json', JSON.stringify(test, null, 2), 'utf-8');
    }
    res.status(200).send();
  }
  catch (err) {
    console.log(err)
    res.status(500).send();
  }
})


app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const url = req.query.url
    console.log(url)
    if (url) {
<<<<<<< Updated upstream
      let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
    const kommuner = JSON.parse(rawData);
    const values = await ssbCommunicate.fetchData(url);
      const data=createGeojsonTest(values.array,kommuner,values.sorting)
=======
      let rawData = fs.readFileSync("./Assets/kommuner2021.geojson");
      const kommuner = JSON.parse(rawData);
      const values = await ssbCommunicate.fetchData(url);
      //const TestValue = values.array.filter((value) => value.Region === "Sola")
      fs.writeFileSync('./data2.json', JSON.stringify(values.array, null, 2), 'utf-8');
      const data = createGeojsonTest(values.array, kommuner, values.sorting)
>>>>>>> Stashed changes
      res.status(200).json({
        status: "sucsess",
        geoJson: data.geoJson,
        sorting:data.sorting,
        options:values.sorting
      })
    }
    else {
      const yourMessage = "Manglet link"
      res.status(400).send(yourMessage);
    }
  } catch (err) {
    console.log(err.StatusCode);
    res.status(500).send();
  }
});
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});

//fs.writeFileSync('./data1.json', JSON.stringify(values, null, 2), 'utf-8');
      //let geoJson = null
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
      /* else if (url && sorting && needsKommune === "false") {
      const values = await ssbCommunicate.fetchData(url);
      const geoJson = createGeojson(values.filter((items) => items[Object.keys(sortingTypes)[0]] === sorting), kommuner)
      res.status(200).json({
        sortedArray: geoJson,
        unSortedArray: values
      })
    } */