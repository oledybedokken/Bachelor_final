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
const test = require("./tools/test.js");
const { time } = require("console");
const port = process.env.PORT || 3001;
//import kommuner_json from "./kommuner_komprimert.json";
// F� alle plasser
app.get("/api/v1/sources", async (req, res) => {
  try {
    const plasser = await db.query("SELECT * FROM sources limit 10;");
    res.status(200).json({
      status: "success",
      plasser: plasser.rows.length,
      data: {
        plass: GeoJSON.parse(plasser.rows, { Point: ["lat", "long"] }), //plasser.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

//Alle fylker
app.get("/api/v1/fylker", async (req, res) => {
  fetch("https://ws.geonorge.no/kommuneinfo/v1/fylker")
    .then((res) => res.json())
    .then((fylker) => {
      try {
        console.log(fylker);
        res.status(200).json({
          status: "success",
          data: {
            fylker: fylker,
          },
        });
      } catch (error) {
        console.log(error);
      }
    });
});

// Alle kommuner
app.get("/api/v1/kommuner", async (req, res) => {
  let rawdata = fs.readFileSync("./Assets/KommunerNorge.geojson");
  let kommuner = JSON.parse(rawdata);
  for (let i = 1; i < kommuner.features.length; i++) {
    console.log(kommuner.features[i].properties.navn[0]["navn"]);
    //console.log(kommuner.features[i].geometry.coordinates)
    let polygon = kommuner.features[i].geometry.coordinates;
    let kommunenavn = kommuner.features[i].properties.navn[0]["navn"];
    console.log(JSON.stringify(kommunenavn) + ": " + JSON.stringify(polygon));
    console.log();
  }
});
app.post("/api/v1/kommuner", async (req, res) => {
  try {
    await db.query("DROP TABLE IF EXISTS kommuner;");
    await db.query(
      "CREATE TABLE kommuner(kommune_id INT NOT NULL,kommune_navn VARCHAR(50),coordinates polygon, coordinates_text TEXT);"
    );
    let rawdata = fs.readFileSync("./Assets/KommunerNorge.geojson");
    let kommuner = JSON.parse(rawdata);
    /* let kommunenummer =kommuner.features[0].properties.kommunenummer
      let navn = kommuner.features[0].properties.navn
      let coordinates = JSON.stringify(kommuner.features[0].geometry.coordinates)
      let del1Coordinates = coordinates.replaceAll('[','(')
      let del2Coordinates = del1Coordinates.replaceAll(']',')')
      console.log(del2Coordinates.slice(2,-2))
      await db.query("INSERT INTO kommuner(kommune_id,kommune_navn,coordinates) values ($1,$2,$3)",
        [
          kommunenummer,
          navn,
          del3coordinates
        ])  */
    kommuner.features.map(async (kommune) => {
      let kommunenummer = kommune.properties.kommunenummer;
      let navn = kommune.properties.navn;
      let coordinates = JSON.stringify(kommune.geometry.coordinates);
      /* let del1Coordinates = coordinates.replaceAll('[','(')
      let del2Coordinates = del1Coordinates.replaceAll(']',')') */
      await db.query(
        "INSERT INTO kommuner(kommune_id,kommune_navn,coordinates_text) values ($1,$2,$3)",
        [kommunenummer, navn, coordinates]
      );
    });
    res.status(200).json({
      status: "success",
      data: {
        value: "Oppdatert",
      },
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//N�r du skriver denne i rapport husk: https://stackoverflow.com/questions/2002923/using-an-integer-as-a-key-in-an-associative-array-in-javascript
app.get("/api/v1/testWeatherData", async (req, res) => {
  try {
    const dato = req.query.dato;
    const resultDay = new Date(dato[0] * 1e3).toISOString();
    const data = await db.query(
      "SELECT long,lat,name,s.source_id,s.valid_from,w.element,w.weather_id,value,time FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time =$2 AND d.element =$1;",
      [req.query.weatherType, resultDay.split("T")[0]]
    );
    // Finn alle sources
    //Deretter hent alle values og lag d til ett object
    res.status(200).json({
      status: "success",
      data: {
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
/* const result = SourceData.rows.reduce((acc, curr) => {
       const time = Math.floor(new Date(curr.time).getTime() / 1000)
       acc[time] = curr.value;
       return acc;
     }, {}) */
/*  const weatherData = { weatherData: result } */
/*       if(Object.keys(weatherData.weatherData).length>0){
   Object.assign(both, source, weatherData)} */
/* const sourceInfo = await db.query("SELECT long,lat,name,s.source_id,w.element,w.weather_id FROM sources s INNER JOIN weather w on w.source_id = s.source_id LIMIT 10;"); */
/* let newArray = []
for (let source of sourceInfo.rows) {
  const SourceData = await db.query("SELECT value,time from weather_data where weather_id = $1 AND time=$2 ORDER BY time LIMIT 5", [source.weather_id,resultDay.split("T")[0]]);
  const both = {}
  console.log(SourceData.rows)
  source["value"] = SourceData.rows[0].value
  newArray.push(both)
} */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
/* await db.query("DROP TABLE IF EXISTS weather_data;");
  await db.query("DROP TABLE IF EXISTS weather;");
  await db.query(
    `CREATE TABLE weather(
        weather_id SERIAL UNIQUE PRIMARY KEY NOT NULL,
        source_id VARCHAR(10) NOT NULL,
        valid_from VARCHAR(50),
        element VARCHAR(50),
        CONSTRAINT fk_source
                FOREIGN KEY(source_id) 
                REFERENCES sources(source_id)
                ON DELETE CASCADE 
    );
          `
  ); */
app.post("/api/v1/getAllValues", async (req, res) => {
  try {
    fetch(
      `https://frost.met.no/sources/v0.jsonld?types=SensorSystem&elements=mean(air_temperature%20P1D)&country=NO&fields=id%2Cvalidfrom`,
      {
        method: "get",
        body: JSON.stringify(),
        headers: {
          Authorization:
            "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
        },
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        await db.query(
          `CREATE TABLE weather_data(weather_id INT, element VARCHAR(50),time VARCHAR(50),value INT,CONSTRAINT fk_weather FOREIGN KEY(weather_id) REFERENCES weather(weather_id) ON DELETE CASCADE );`
        );
        data.data.map(async (station) => {
          if (station.geometry) {
            sleep(5000);
            let input = await db.query(
              "INSERT INTO weather(source_id, valid_from, element) values($1,$2,$3)",
              [station.id, station.validFrom, "mean(air_temperature P1D)"]
            );
          }
        });
        res.status(200).json({
          status: "success",
          data: {
            value: "Oppdatert",
          },
        });
      });
  } catch (err) {
    console.log(err);
  }
});
//Had some problems som asked on stackoverflow and got help fairly quickly, this might give plagirism but most of the work is ours considering we wrote the question but incase not here is the source: https://stackoverflow.com/questions/71273624/problems-combing-fetch-and-res
app.post("/api/v1/getSpecificData", async (req, res) => {
  try {
    let sources = await db.query(
      "SELECT * FROM weather where element = 'mean(air_temperature P1M)';"
    );
    for (let source of sources.rows) {
      let res = await fetch(
        `https://frost.met.no/observations/v0.jsonld?sources=${
          source.source_id
        }&referencetime=${
          source.valid_from.split("T")[0]
        }%2F2022-02-20&elements=mean(air_temperature%20P1D)&fields=value%2C%20referenceTime`,
        {
          method: "get",
          headers: {
            Authorization:
              "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
          },
        }
      );
      let tempData = await res.json();
      if (tempData.data) {
        tempData.data.map(async (currentWeatherData) => {
          await db.query(
            "INSERT INTO weather_data(weather_id,element,time,value) values ($1,'max(air_temperature P1M)',$2,$3);",
            [
              source.weather_id,
              currentWeatherData.referenceTime.split("T")[0],
              parseInt(currentWeatherData.observations[0].value),
            ]
          );
          count += 1;
        });
      }
    }
    if (count === sources.rows.length) {
      res.status(200).json({
        status: "success",
        data: {
          value: "Oppdatert",
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.post("/api/v1/admin", async (req, res) => {
  try {
    fetch(
      "https://frost.met.no/sources/v0.jsonld?types=SensorSystem&country=NO",
      {
        method: "get",
        body: JSON.stringify(),
        headers: {
          Authorization:
            "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
        },
      }
    )
      .then((res) => res.json())
      .then(async (data) => {
        try {
          await db.query("DROP TABLE IF EXISTS sources;");
          await db.query(
            `CREATE TABLE sources(
              source_id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,
              type VARCHAR(50),name VARCHAR(60) NOT NULL,
              shortName VARCHAR(50),country VARCHAR(70) NOT NULL,
              countryCode VARCHAR(80),long VARCHAR(90) NOT NULL,
              lat VARCHAR(100) NOT NULL,geog geography(point) NOT NULL,
              valid_from TIMESTAMP,
              county VARCHAR(100),
              countyId INT,
              municipality VARCHAR(100) ,
              municipalityId INT);`
          );
          data.data.map(async (source) => {
            if (source.geometry) {
              let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`;
              const results = await db.query(
                "INSERT INTO sources(source_id,type,name,shortName,country,countryCode,long,lat,geog,valid_from,county,countyId,municipality,municipalityId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);",
                [
                  source.id,
                  source.type,
                  source.name,
                  source.shortName,
                  source.country,
                  source.countryCode,
                  source.geometry.coordinates[0],
                  source.geometry.coordinates[1],
                  Point,
                  source.validFrom,
                  source.county,
                  source.countyId,
                  source.municipality,
                  source.municipalityId,
                ]
              );
            }
          });
        } catch (err) {
          console.log(err);
        }
        res.status(200).json({
          status: "success",
          data: {
            value: "Data oppdatert!",
          },
        });
      });
  } catch (error) {
    console.log(error);
  }
});
const kommunerSammenSlaaing = [
  { gammel: ["Sandefjord", "Andebu", "Stokke"], ny: "Sandefjord", aar: 2017 },
  { gammel: ["Larvik", "Lardal"], ny: "Larvik", aar: 2018 },
];
app.get("/api/v1/incomejson", async (req, res) => {
  try {
    //const value = req.query.sorting;
    //let rawdata = fs.readFileSync("./Assets/KommunerNorge.geojson", "utf8");
    //let student = JSON.parse(rawdata);
    //const newArray = [];
    /* const values = await db.query(
      "SELECT * FROM inntekt_data where husholdningstype = $1 ORDER BY region",
      [value]
    ); */ //This makes us not have to query so many times
    const values = await test.test();
    //let testValues = values.filter((data)=>data.ContentsCode==="Samlet inntekt, median (kr)" && data.HusholdType===req.query.sorting)
    
    /* student.features.map((kommune) => {
      let currArray = [];
      let testObject = {};
      let dataArray = testValues.filter((data)=>data.Region === kommune.properties.navn)
      dataArray.map((data)=>{        
        testObject[parseInt(data.Tid)] = data.value;
      })
      kommune.properties.inntekt = testObject;
    }) */
      /* console.time("SecondTest")
      student.features.map((kommune) => {
        let currArray = [];
        let testObject = {};
        let antHus = 0;  
      values.rows.map((data) => {
        if (data.region === kommune.properties.navn) {
          testObject[data.tid] = data.inntekt;
          antHus = data.antallhus;
        }
      });
      kommune.properties.inntekt = testObject;
      kommune.properties.anntallHus = antHus;
    }); 
    console.timeEnd("SecondTest") */
    res.status(200).json({
      status: "success",
      data: values,
    });
  } catch (err) {
    console.log(err);
  }
});
/* Inntekt */
/* for (let verdi in student.features){
      if (values.rows.length > 0) {
        const result = values.rows.reduce((acc, curr) => {
          acc[curr.tid] = curr.inntekt;
          return acc;
        }, {})  
        student.features[verdi].properties.inntekt = result
          newArray.push(student.features[verdi])
      }
      else{
        console.log(student.features[verdi].properties.navn)
      }
    } */
/* async function FetchDataInntekt() {
  const CombiningTheFiles = [];
  const response = fs.readFileSync("./Assets/Inncomes.txt", "utf8");
  const kommunerdata = fs.readFileSync(
    "./Assets/KommunerNorge.geojson",
    "utf8"
  );
  let kommuner = JSON.parse(kommunerdata);
  let table = response.split("\n").slice(1);
  const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
  console.log(KommuneReformen)
  let tabletogether = [];
  for (let index = 0; index < table.length; index++) {
    if (index % 2 === 1) {
      newArray = table[index - 1].concat(table[index]);
      tabletogether.push(newArray);
    }
  }
  try {
    await db.query("DROP TABLE IF EXISTS inntekt_data;");
    await db.query(
      "CREATE TABLE inntekt_data(regionid INT NOT NULL,region VARCHAR(50) NOT NULL,husholdningstype VARCHAR(100),husholdningstypeid VARCHAR(10),tid int,inntekt int,antallhus int);"
    );
    tabletogether.map(async (ikt) => {
      const regionId = ikt.split(";")[0].split(" ")[0].slice(1);
      let regionstart = ikt
        .split(";")[0]
        .substring(ikt.split(";")[0].indexOf(" ") + 1);
      if (regionstart.split(" ").length > 2) {
        if (regionstart.split(" ")[1][0] === "(") {
          region = regionstart.split(" ")[0];
        } else {
          region = regionstart.split(" ").slice(0, -1).join(" ");
        }
      } else {
        region = regionstart.split(" ")[0];
      }

      if (region.includes('"')) {
        region = region.slice(0, region.length - 1);
      }
      const husholdningstypeid = ikt.split(";")[1].split(" ")[0].slice(1);
      const husholdningstypeArray = ikt.split(";")[1];
      let husholdningstype = husholdningstypeArray
        .replace('"' + husholdningstypeid + "", "")
        .replace('"', "")
        .slice(1);
      if (
        husholdningstype == NaN ||
        husholdningstype == null ||
        husholdningstype == undefined
      ) {
        husholdningstype = "";
      }
      const aarArray = ikt.split(";")[2].split(" ")[0];
      const tid = parseInt(aarArray.substring(1, aarArray.length - 1));
      let inntekt = parseInt(ikt.split(";")[4].split(" ")[0].split('"')[0]);
      if (
        inntekt === NaN ||
        inntekt === "Nan" ||
        inntekt === "NaN" ||
        Number.isNaN(inntekt) ||
        inntekt === null
      ) {
        inntekt = 0;
      }
      let antallHus = parseInt(ikt.split(";")[8].split(" "));
      if (
        antallHus === NaN ||
        antallHus === "Nan" ||
        antallHus === "NaN" ||
        Number.isNaN(antallHus) ||
        antallHus === null
      ) {
        antallHus = 0;
      }
      const checkThatKommuneStillExists = (obj) =>obj.properties.navn === region;
      if (antallHus !== 0 || inntekt !== 0) {
        if (!kommuner.features.some(checkThatKommuneStillExists)) {
          KommuneReformen.map((currentReform) => {
            currentReform.GammelKommune.split(",").map((currentKommune) => {
              if (currentKommune === region) {
                let currentTest = {};
                currentTest["id"] = currentReform.newKommune;
                currentTest["KommueNr"] = currentReform.newKommuneId;
                currentTest["time"] = tid;
                currentTest["income"] = inntekt;
                currentTest["antallHus"] = antallHus;
                currentTest["husholdningstype"] = husholdningstype;
                currentTest["husholdningstypeid"] = husholdningstypeid;
                CombiningTheFiles.push(currentTest);
              }
            });
          });
        }
        await db.query(
          "INSERT INTO inntekt_data(regionid,region,husholdningstype,husholdningstypeid,tid,inntekt,antallhus) values ($1,$2,$3,$4,$5,$6,$7)",
          [
            regionId,
            region,
            husholdningstype,
            husholdningstypeid,
            tid,
            inntekt,
            antallHus,
          ]
        );
      }
    });
    const newResult = [];
    const allTime = CombiningTheFiles.filter(
      (a, i) => CombiningTheFiles.findIndex((s) => a.time === s.time) === i
    );
    const AllHusholdningsTyper = CombiningTheFiles.filter(
      (a, i) =>
        CombiningTheFiles.findIndex(
          (s) => a.husholdningstype === s.husholdningstype
        ) === i
    );
    CombiningTheFiles.filter((a, i) => CombiningTheFiles.findIndex((s) => a.id === s.id) === i).map((nyKommune) => {
      allTime.map((cTid) => {
        AllHusholdningsTyper.map((cHusHoldningsType) => {
          const AverageKommuneArray = {};
          const getReform = (elem) => elem.id === nyKommune.id;
          const getTime = (elem) => elem.time === cTid.time;
          const getHusholdningsType = (elem) =>
            elem.husholdningstype === cHusHoldningsType.husholdningstype;
          const average = (a, b, i, self) => a + b.income / self.length;
          AverageKommuneArray["tid"] = cTid.time;
          AverageKommuneArray["name"] = nyKommune.id;
          AverageKommuneArray["KommueNr"] = nyKommune.KommueNr;
          AverageKommuneArray["husholdningstype"] =
            cHusHoldningsType.husholdningstype;
          AverageKommuneArray["husholdningstypeid"] =
            cHusHoldningsType.husholdningstypeid;
          AverageKommuneArray["antallHus"] = nyKommune.antallHus;
          AverageKommuneArray["inntekt"] = CombiningTheFiles.filter(getReform)
            .filter(getTime)
            .filter(getHusholdningsType)
            .reduce(average, 0);
          if (
            CombiningTheFiles.filter(getReform)
              .filter(getTime)
              .filter(getHusholdningsType)
              .reduce(average, 0)
          ) {
           
            newResult.push(AverageKommuneArray);
          }
        });
      });
    }); */ /* console.log("tid"+cTid.time+"navn:"+nyKommune.id+"HusholdningsType:"+cHusHoldningsType.husholdningstype+"inntekt"+CombiningTheFiles.filter(getReform).filter(getTime).filter(getHusholdningsType).reduce(average,0)) */
    /* newResult.map(async (input) => {
      const added =await db.query(
        "INSERT INTO inntekt_data(regionid,region,husholdningstype,husholdningstypeid,tid,inntekt,antallhus) values ($1,$2,$3,$4,$5,$6,$7) returning region",
        [
          input.KommueNr,
          input.name,
          input.husholdningstype,
          input.husholdningstypeid,
          input.tid,
          input.inntekt,
          input.anntallHus,
        ]
      );
    });
    return "all added"
  } catch (err) {
    console.log(err);
  }
} */

app.post("/api/v1/addinntekt", async (req, res) => {
  try {
    const result = await test.test()
    await db.query("DROP TABLE IF EXISTS inntekt_data;");
    await db.query(
      "CREATE TABLE inntekt_data(region VARCHAR(50) NOT NULL,husholdningstype VARCHAR(100),ContentsCode VARCHAR(100),tid int,value int);"
    );

    if(result){
      console.log(result)
      result.map(async (inntekt)=>{
        await db.query(
          "INSERT INTO inntekt_data(region,husholdningstype,ContentsCode,tid,value) values ($1,$2,$3,$4,$5)",
          [
            inntekt.Region,
            inntekt.HusholdType,
            inntekt.ContentsCode,
            parseInt(inntekt.Tid),
            inntekt.value
          ]
        );
      }) 
    }
    res.status(200).json({
      status: "success",
      data: {
        value: "Oppdatert",
      },
    });
  } catch (error) {
    res.status(500)
    console.log(error);
  }
});

app.get("/api/v1/inntekt", async (req, res) => {
  try {
    const plasser = await db.query(
      "SELECT * FROM inntekt_data where husholdningstype = ' Alle husholdninger' limit 30 ;"
    );
    console.log(plasser.rows);
    //region, husholdningstype, husholdningstypeid, tid, inntekt,antallhus
    //geometry, properties.kommunenummer, properties.navn.navn
    res.status(200).json({
      status: "success",
      plasser: plasser.rows.length,
      data: {
        plass: plasser.rows, //GeoJSON.parse(plasser.rows, { Point: ["lat", "long"] }),
      },
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
/* const url = "https://data.ssb.no/api/v0/dataset/49678.csv?lang=no";
  let dataresult = null
  const data = await fetch(url, {
    method: "GET",
    headers: { "Accept-Charset": "text/html; charset=UTF-8" }
  }) */
/* await fetch("https://data.ssb.no/api/v0/dataset/49678.csv?lang=no",
    {
      headers: { "Content-Type": "text/html; charset=UTF-8" }
    }
  )
    .then(response => response.arrayBuffer())
    .then(buffer => {

      let decoder = new TextDecoder("iso-8859-1")
      let text = decoder.decode(buffer)
      console.log(text)
    }) */
