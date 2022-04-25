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
const { forEach } = require("lodash");
const {parse} = require('csv-parse')


const port = process.env.PORT || 3005;
//WEATHER Push test
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
function byYear(array) {
  return array.reduce((acc, data) => {
    Object.entries(data).forEach(([year, value]) => {
      acc[year] = acc[year] || []
      if (value !== 0) {
        acc[year].push(value)
      }
    })
    return acc
  }, {})
}
function average(object) {
  const averages = {}
  for (let key in object) {
    if (object[key].length > 0) {
      averages[key] = object[key].reduce((sum, value) => sum + value) / object[key].length
      averages[key] = parseFloat(averages[key].toFixed(1))
    }
    else {
      object[key] = 0
    }
  }
  return averages
}
function organizeArray(sorting, matching) {
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
  return ContentObjects
}
function createGeojsonTest(array, kommuner, sorting,mapFormat) {
  let rawData = fs.readFileSync("./KommuneEndring/KommunerNorge.json");
  const kommunerEndringer = JSON.parse(rawData);
  let arrayOfObjects = []
  if (sorting.options) {
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
    const arrayOfEntries = sorting.options.map(({ id, options }) => options.map(option => [[id, option]]));
    const cartesianProduct = cartesian(...arrayOfEntries);
    arrayOfObjects = cartesianProduct.map(arr => Object.fromEntries(arr))
  }
  const unique = [...new Set(array.map(item => item.RegionNumber))];
  let dataArray = []
  //fs.writeFileSync('./data3.json', JSON.stringify(array, null, 2), 'utf-8');
  unique.forEach((currentKommune) => {
    const currentArray = array.filter((e) => e.RegionNumber === currentKommune)
    if (currentArray.length > 0) {
      let dataValues = null
      if (arrayOfObjects.length > 0) {
        dataValues = arrayOfObjects.map(function (objectFilter) {
          const matching = currentArray.filter((item) => Object.entries(objectFilter).every(([key, value]) => item[key] === value));
          const ContentObjects = organizeArray(sorting, matching)
          const objectFilters = Object.values(objectFilter)
          if (Object.keys(ContentObjects).length !== 0) {
            return Object.assign({ ...ContentObjects, filters: objectFilters });
          }
        })
      }
      else {
        dataValues = organizeArray(sorting, currentArray)
      }
      const checkKommune = element => element.properties.Kommunenummer == currentArray[0].RegionNumber;
      if (!kommuner.features.some(checkKommune)) {
        const value = FindNewest(kommunerEndringer, currentArray[0].RegionNumber)
        currentArray[0].RegionNumber = value["newNr"]
        currentArray[0].Region = value["newNavn"]
      }
      if (dataValues.length !== null) {
        dataArray.push({
          "Region": currentArray[0].Region,
          "RegionNumber": currentArray[0].RegionNumber,
          verdier: dataValues
        })
      }
    }
  })

  const foundDuplicateName = dataArray.reduce((p, next) => {
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
  if (foundDuplicateName.dups.length > 0) {
    const NotUnique = [...new Set(foundDuplicateName.dups.map(item => item.RegionNumber))];
    const problemArray = []
    const duplicatesArray = dataArray.filter(item => NotUnique.includes(item.RegionNumber));
    NotUnique.map((duplicate) => {
      const duplicates = duplicatesArray.filter((e) => e.RegionNumber === duplicate);
      const verdier = []
      if (arrayOfObjects.length > 0) {
      arrayOfObjects.map((SortingObject) => {
        const arrayOfValues = []
        duplicates.map((value) => {
          arrayOfValues.push(...value.verdier)
        })
        const filterObject = Object.values(SortingObject);
        const filtered = arrayOfValues.filter(e => e.filters.every(
          filter => filterObject.includes(filter)
        ))
        sorting.ContentsCodes.map((ContentCode) => {
          const filteredByContentCode = filtered.map(function (obj) {
            return obj[ContentCode.label]
          })
          const contentCodeLabel = {}
          contentCodeLabel[ContentCode.label] = average(byYear(filteredByContentCode))
          verdier.push({ filters: filterObject, ...contentCodeLabel })
        })
      })
    }
    else{
      const arrayOfValues = []
        duplicates.map((value) => {
          arrayOfValues.push(value.verdier)
        })
        sorting.ContentsCodes.map((ContentCode) => {
          const filteredByContentCode = arrayOfValues.map(function (obj) {
            return obj[ContentCode.label]
          })
          const contentCodeLabel = {}
          contentCodeLabel[ContentCode.label] = average(byYear(filteredByContentCode))
          verdier.push({...contentCodeLabel})
        })
    }
      let sammenSlaattKommune = {
        "Region": duplicates[0].Region,
        "RegionNumber": duplicates[0].RegionNumber,
        "verdier": Object.assign({}, ...verdier)
      }
      problemArray.push({...sammenSlaattKommune})
    })
    //console.log(problemArray)
    //console.log(problemArray[0].sammenSlaattKommune.verdier)
    const temp = dataArray.filter(obj1 => !problemArray.some(obj2 => obj1.RegionNumber === obj2.RegionNumber))
    //console.log(temp)
    //fs.writeFileSync('./data4.json', JSON.stringify(dataArray, null, 2), 'utf-8');
    //fs.writeFileSync('./data2.json', JSON.stringify(problemArray, null, 2), 'utf-8');
    //fs.writeFileSync('./data3.json', JSON.stringify(temp, null, 2), 'utf-8');
    dataArray = [...problemArray, ...temp]
  }
  //console.log(dataArray)
  //just a change
  let geoJson=null
if(mapFormat!=="heatmap"){
  let features = kommuner.features.map((kommune) => {
    let obj = dataArray.find(o => o.RegionNumber === kommune.properties.Kommunenummer);
    return {
      ...kommune,
      properties: {
        ...kommune.properties,
        ...obj
      }
    }
  })
  geoJson = {
    "type": "FeatureCollection",
    "features": features
  }}
  else{
    let rawData = fs.readFileSync("./Assets/heatMapSetup.json");
    const heatMapSetup = JSON.parse(rawData);
    const array = heatMapSetup.map((kommune)=>{
      return {...kommune,...dataArray.find(o => o.RegionNumber === kommune.kommunenr)};
    })
    //console.log(heatMapSetup)
    geoJson =GeoJSON.parse(array, {Point: ['lat', 'lon']});
  }
  
  return { "geoJson": geoJson, "sorting": arrayOfObjects }
}
//Test
function FindNewest(file, value) {
  let Newest = value
  let objectForNewest = {}
  file.map((merger) => {
    if (merger.gamle.hasOwnProperty(Newest)) {
      objectForNewest = merger
      Newest = merger.newNr
    }
  })
  return objectForNewest
}
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
      const data = createGeojsonTest(values.array, kommuner, values.sorting,mapFormat)
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
