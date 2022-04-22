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
      if(value!==0){
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
function createGeojsonTest(array, kommuner, sorting) {
  let rawData = fs.readFileSync("./KommuneEndring/KommunerNorge.json");
  const kommunerEndringer = JSON.parse(rawData);
  const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
  const arrayOfEntries = sorting.options.map(({ id, options }) => options.map(option => [[id, option]]));
  const cartesianProduct = cartesian(...arrayOfEntries);
  const arrayOfObjects = cartesianProduct.map(arr => Object.fromEntries(arr))
  const unique = [...new Set(array.map(item => item.RegionNumber))];
  const newArray = []
  //fs.writeFileSync('./data3.json', JSON.stringify(array, null, 2), 'utf-8');
  unique.forEach((currentKommune) => {
    const currentArray = array.filter((e) => e.RegionNumber === currentKommune)
    if (currentArray.length > 0) {
      const values = arrayOfObjects.map(function (objectFilter) {
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
        const objectFilters = Object.values(objectFilter)
        if (Object.keys(ContentObjects).length !== 0) {
          return Object.assign({ ...ContentObjects, filters: objectFilters });
        }
      })
      const checkKommune = element => element.properties.Kommunenummer == currentArray[0].RegionNumber;
      if (!kommuner.features.some(checkKommune)) {
        const value = FindNewest(kommunerEndringer, currentArray[0].RegionNumber)
        currentArray[0].RegionNumber = value["newNr"]
        currentArray[0].Region = value["newNavn"]
      }
      if (values.length !== null) {
        newArray.push({
          "Region": currentArray[0].Region,
          "RegionNumber": currentArray[0].RegionNumber,
          verdier: values
        })
      }
    }
  })
  
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
  const problemArray = []
  const duplicatesArray = newArray.filter(item => NotUnique.includes(item.RegionNumber));
 
  NotUnique.map((duplicate) => {
    const duplicates = duplicatesArray.filter((e) => e.RegionNumber === duplicate);
    const verdier = []
    arrayOfObjects.map((SortingObject) => {
      const arrayOfValues = []
      const filterObject = Object.values(SortingObject);
      duplicates.map((value) => {
        arrayOfValues.push(...value.verdier)
      })
      const filtered =arrayOfValues.filter(e => e.filters.every(
        filter => filterObject.includes(filter)
      ))
      sorting.ContentsCodes.map((ContentCode) => {
        const filteredByContentCode = filtered.map(function (obj) {
          return obj[ContentCode.label]
        })
        const contentCodeLabel = {}
        contentCodeLabel[ContentCode.label]=average(byYear(filteredByContentCode))
        verdier.push({filters:filterObject,...contentCodeLabel })
      })
    })
    let sammenSlaattKommune = {
      "Region": duplicates[0].Region,
      "RegionNumber": duplicates[0].RegionNumber,
      "verdier": verdier
    }
    problemArray.push(sammenSlaattKommune)
  })
  const temp = newArray.filter(obj1 => !problemArray.some(obj2 => obj1.RegionNumber === obj2.RegionNumber))
  const newObject = [...problemArray, ...temp]
  //just a change
  //fs.writeFileSync('./data4.json', JSON.stringify(newObject, null, 2), 'utf-8');
  const secondNewArray = kommuner.features.map((kommune) => {
    let obj = newObject.find(o => o.RegionNumber === kommune.properties.Kommunenummer);
    return {
      ...kommune,
      properties: {
        ...kommune.properties,
        ...obj
      }
    }
  })
  let geoJson = {
    "type": "FeatureCollection",
    "features": secondNewArray
  }
  return { "geoJson": geoJson, "sorting": arrayOfObjects }
}
//Test
app.get("/api/v1/incomejsonTest", async (req, res) => {
  try {
    const needsKommune = req.query.needsKommune
    const url = req.query.url
    //const sorting = JSON.parse(req.query.sorting)
    let rawData = fs.readFileSync("./Assets/Kommunenavn.geojson");
    const kommuner = JSON.parse(rawData);
    if (url && needsKommune === "true") {
      const values = await ssbCommunicate.fetchData(url);
      const test = createGeojsonTest(values.array, kommuner, values.sorting)
      //fs.writeFileSync('./data1.json', JSON.stringify(values.array, null, 2), 'utf-8');
    }
    res.status(200).send();
  }
  catch (err) {
    console.log(err)
    res.status(500).send();
  }
})
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
    if (url) {
      let rawData = fs.readFileSync("./Assets/kommuner2021.geojson");
      const kommuner = JSON.parse(rawData);
      const values = await ssbCommunicate.fetchData(url)
      //fs.writeFileSync('./data3.json', JSON.stringify(values.array, null, 2), 'utf-8');
      const TestValue = values.array.filter((value) => value.RegionNumber === "1729")
      //fs.writeFileSync('./data2.json', JSON.stringify(values.array, null, 2), 'utf-8');
      const data = createGeojsonTest(values.array, kommuner, values.sorting)
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
