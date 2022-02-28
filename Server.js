require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
const fetch = require("node-fetch");
var GeoJSON = require("geojson");
const fs = require("fs");
const fastcsv = require("fast-csv");
const port = process.env.PORT || 3001;
//import kommuner_json from "./kommuner_komprimert.json";


// Få alle plasser
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
  let rawdata = fs.readFileSync('kommuner_komprimert.geojson');
  let kommuner = JSON.parse(rawdata);


  for (let i = 1; i < kommuner.features.length; i++) {
    //console.log(kommuner.features[i].properties.navn[0]["navn"])
    //console.log(kommuner.features[i].geometry.coordinates)
    let polygon = kommuner.features[i].geometry.coordinates
    let kommunenavn = kommuner.features[i].properties.navn[0]["navn"]
    console.log(JSON.stringify(kommunenavn) + ": " + JSON.stringify(polygon));
    console.log()
  }
});

/* fetch("https://ws.geonorge.no/kommuneinfo/v1/kommuner")
  .then((res) => res.json())
  .then((kommuner) => {
    try {
      //console.log(kommuner);

});*/

app.post("/api/v1/kommuner", async (req, res) => {
  try{
    await db.query("DROP TABLE IF EXISTS kommuner;");
    await db.query(
      "CREATE TABLE kommuner(kommuneId INT NOT NULL,kommune VARCHAR(50),coordinates POLYGON, coordinates_text TEXT);"
    );
    let rawdata = fs.readFileSync('kommuner_komprimert.geojson');
    let kommuner = JSON.parse(rawdata);
    kommuner.map(async (kommune)=>{
      let kommunenummer = kommune.features.properties.kommunenummer
      let navn =kommune.features.properties.navn[0]["navn"]
      let coordinates = kommune.features.geometry.coordinates
      await db.query("INSERT INTO kommuner(kommuneId,kommune,coordinates_text) values ($1,$2,$3)",
      [
        kommunenummer,
        navn,
        coordinates
      ])
    }) 

  }catch(error){}
});

//Får spesifikk plass
app.get("/api/v1/sources/:id", async (req, res) => {
  try {
    const plass = await db.query("SELECT * FROM sources WHERE id = $1", [
      req.params.id,
    ]);
    //
    res.status(200).json({
      status: "success",
      data: {
        plass: GeoJSON.parse(plass.rows, {
          Point: ["lat", "long"],
          include: ["name", "municipality", "county"],
        }), //plasser.rows,
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/testWeatherData",async(req,res)=>{
  try{
  /* const data = await db.query("SELECT long,lat,name,s.source_id,s.valid_from,w.element,w.weather_id,value,time FROM sources s INNER JOIN weather w on w.source_id = s.source_id INNER JOIN weather_data d ON w.weather_id = d.weather_id WHERE d.time >'2000.01.01';") */
  const sourceInfo = await db.query("SELECT long,lat,name,s.source_id,w.element,w.weather_id FROM sources s INNER JOIN weather w on w.source_id = s.source_id LIMIT 10;");
  let newArray = []
  for (let source of sourceInfo.rows) {
    const SourceData = await db.query("SELECT value,time from weather_data where weather_id = $1 AND time>'2020' ORDER BY time  LIMIT 5",[source.weather_id]);
    console.log(SourceData.rows)
    const both={}
    const result = SourceData.rows.reduce((acc, curr) => {
      const time = Math.floor(new Date(curr.time).getTime() / 1000)
      acc[time] = curr.value;
      return acc;
    }, {})
    console.log(result)
    const weatherData = {weatherData:result}
    Object.assign(both,source,weatherData)
    newArray.push(both)
    /* console.log(newArray) */
  }
  // Finn alle sources
    //Deretter hent alle values og lag d til ett object
    res.status(200).json({
      status: "success",
      data:{
        plass: GeoJSON.parse(newArray, {
          Point: ["lat", "long"],
          include: ["source_id", "name","weatherData","element"]
        })
      },
    })
}catch(err){console.log(err)
  res.sendStatus(500);}
})
async function FetchData() {
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
      console.log(data);
      try {
        await db.query("DROP TABLE IF EXISTS sources;");
        await db.query(
          "CREATE TABLE sources(source_id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,type VARCHAR(50),name VARCHAR(60) NOT NULL,shortName VARCHAR(50),country VARCHAR(70) NOT NULL,countryCode VARCHAR(80),long VARCHAR(90) NOT NULL,lat VARCHAR(100) NOT NULL,geog geography(point) NOT NULL,valid_from TIMESTAMP,county VARCHAR(100) ,countyId INT ,municipality VARCHAR(100) ,municipalityId INT);"
        );
        data.data.map(async (source) => {
          if (source.geometry) {
            let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`;
            const results = await db.query(
              "INSERT INTO sources(source_id,type,name,shortName,country,countryCode,long,lat,geog,valid_from,county,countyId,municipality,municipalityId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning name;",
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
      const value = "Hei";
      return value;
    })
    .catch((error) => console.log(error));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
app.post("/api/v1/getAllValues", async (req, res) => {
  await db.query("DROP TABLE IF EXISTS weather_data;");
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
  );
  try {
    fetch(`https://frost.met.no/sources/v0.jsonld?types=SensorSystem&elements=mean(air_temperature%20P1D)&country=NO&fields=id%2Cvalidfrom%2Cgeometry`,
      {
        method: "get",
        body: JSON.stringify(),
        headers: {
          Authorization:
            "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
        },
      })
      .then((res) => res.json())
      .then(async data => {
        await db.query(`CREATE TABLE weather_data(weather_id INT, element VARCHAR(50),time VARCHAR(50),value INT,CONSTRAINT fk_weather FOREIGN KEY(weather_id) REFERENCES weather(weather_id) ON DELETE CASCADE );`);
        data.data.map(async (station) => {
          if (station.geometry) {
            sleep(50000);
            let input = await db.query('INSERT INTO weather(source_id, valid_from, element) values($1,$2,$3)', [station.id, station.validFrom, "mean(air_temperature P1D)"])
          }
        })
        res.status(200).json({
          status: "success",
          data: {
            value: "Oppdatert",
          },
        });
      })

  } catch (err) {
    console.log(err)
  }
})
//Had some problems som asked on stackoverflow and got help fairly quickly, this might give plagirism but most of the work is ours considering we wrote the question but incase not here is the source: https://stackoverflow.com/questions/71273624/problems-combing-fetch-and-res
app.post("/api/v1/getWeatherData", async (req, res) => {
  try {
    let sources = await db.query(
      "SELECT * FROM weather where element = 'mean(air_temperature P1D)' LIMIT 10;")
    let count = 1
    for (let source of sources.rows) {
      await sleep(5000)
      let res = await fetch(
        `https://frost.met.no/observations/v0.jsonld?sources=${source.source_id}&referencetime=${(source.valid_from).split("T")[0]}%2F2022-02-20&elements=mean(air_temperature%20P1D)&fields=value%2C%20referenceTime`, {
        method: "get",
        headers: {
          Authorization: "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
        },
      });
      let tempData = await res.json();
      tempData.data.map(async (currentWeatherData) => {
        await db.query("INSERT INTO weather_data(weather_id,element,time,value) values ($1,'mean(air_temperature P1D)',$2,$3);", [source.weather_id, currentWeatherData.referenceTime.split("T")[0], parseInt(currentWeatherData.observations[0].value)])
      })
      count += 1
    }
    if (count >= 10) {
      console.log(count)
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
    const value = await FetchData();
    console.log(value);
    res.status(200).json({
      status: "success",
      data: {
        value: "Data oppdatert!",
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/incomejson", async (req, res) => {
  try {
    const incomes = await db.query("select * from inntekt_data;");
    const fs = require('fs');
    let rawdata = fs.readFileSync('kommuner_komprimert.json');
    let student = JSON.parse(rawdata);
    console.log(student);
  } catch (err) {
    console.log(err)
  }
})

/* Inntekt */

async function FetchDataInntekt() {
  const url = "https://data.ssb.no/api/v0/dataset/49678.csv?lang=no";
  const data = await fetch(url); //fs.readFile(url); //fs.createReadStream(url);
  let response = await data.text();
  let table = response.split("\n").slice(1);
  const test = table[0];
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
      //
      const regionId = ikt.split(";")[0].split(" ")[0].slice(1);
      let region = ikt.split(";")[0].split(" ")[1];
      if (region.includes('"')) {
        region = region.slice(0, region.length - 1);
      }
      const husholdningstypeid = ikt
        .split(";")[1]
        .split(" ")[0]
        .slice(1);
      const husholdningstypeArray = ikt.split(";")[1]
      let husholdningstype = husholdningstypeArray.replace('"' + husholdningstypeid + '', '').replace('"', '').slice(1);
      if (husholdningstype == NaN || husholdningstype == null || husholdningstype == undefined) {
        husholdningstype = "Empty Empty Empty Empty Empty Empty Empty Empty Empty Empty Empty"
      }
      const aarArray = ikt.split(";")[2].split(" ")[0]
      const tid = parseInt(aarArray.substring(1, aarArray.length - 1));
      let inntekt = parseInt(ikt.split(";")[4].split(" ")[0].split('"')[0])
      if (inntekt === NaN || inntekt === "Nan" || inntekt === "NaN" || Number.isNaN(inntekt) || inntekt === null) {
        inntekt = 0;
      }
      let antallHus = parseInt(ikt.split(";")[8].split(" "))
      if (antallHus === NaN || antallHus === "Nan" || antallHus === "NaN" || Number.isNaN(antallHus) || antallHus === null) {
        antallHus = 0;
      }

      if (antallHus !== 0 || inntekt !== 0) {
        await db.query("INSERT INTO inntekt_data(regionid,region,husholdningstype,husholdningstypeid,tid,inntekt,antallhus) values ($1,$2,$3,$4,$5,$6,$7)",
          [
            regionId,
            region,
            husholdningstype,
            husholdningstypeid,
            tid,
            inntekt,
            antallHus,
          ]);
      }
    })

  } catch (err) {
    console.log(err);
  }
}
app.post("/api/v1/addinntekt", async (req, res) => {
  try {
    const value = await FetchDataInntekt();
    res.status(200).json({
      status: "success",
      data: {
        value: "Oppdatert",
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/v1/inntekt", async (req, res) => {
  try {
    const plasser = await db.query("SELECT * FROM inntekt_data where husholdningstype = ' Alle husholdninger' limit 30 ;");
    console.log(plasser.rows)
    //region, husholdningstype, husholdningstypeid, tid, inntekt,antallhus
    //geometry, properties.kommunenummer, properties.navn.navn

    res.status(200).json({
      status: "success",
      plasser: plasser.rows.length,
      data: {
        plass: plasser.rows,//GeoJSON.parse(plasser.rows, { Point: ["lat", "long"] }), 
      },
    });
  } catch (error) {
    console.log(error);
  }
});
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
