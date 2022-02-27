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
  
  
  for (let i=1; i < kommuner.features.length; i++){
      //console.log(kommuner.features[i].properties.navn[0]["navn"])
      //console.log(kommuner.features[i].geometry.coordinates)
      let polygon = kommuner.features[i].geometry.coordinates
      let kommunenavn = kommuner.features[i].properties.navn[0]["navn"]
      //console.log(JSON.stringify(kommunenavn) + ": " + JSON.stringify(polygon));
      console.log(kommuner.features[i].properties.kommunenummer)
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
app.get("/api/v1/weatherData", async (req, res) => {
  const plass = await db.query("SELECT * FROM sources WHERE id = $1", [
    req.query.id,
  ]);
  fetch(
    `https://frost.met.no/observations/v0.jsonld?sources=SN18700&referencetime=2020-11-22%2F2022-02-11&elements=mean(air_temperature%20P1D)&fields=value%2C%20referenceTime&timeoffsets=PT6H`,
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
    .then((data) => {
      //Her kan det være en ide og loope gjennom values også finne gjennomsnitt
      /* data.data.map((dag)=>console.log(dag.referenceTime)) */
      let newArray = []
      data.data.map((dag)=>{
        const both = {}
        Object.assign(both,plass.rows[0],dag.observations[0],dag)
        newArray.push(both)
      })
      console.log(newArray)
      res.status(200).json({
        status: "success",
        data: {
          plass:GeoJSON.parse(newArray,{
            Point:["lat","long"],
            include:["id","name","county","referenceTime","value"]
          })
        },
      }); 
    });
});
async function FetchData() {
  fetch(
    "https://frost.met.no/sources/v0.jsonld?types=SensorSystem&country=Norge",
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
          "CREATE TABLE sources(id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,type VARCHAR(50),name VARCHAR(60) NOT NULL,shortName VARCHAR(50),country VARCHAR(70) NOT NULL,countryCode VARCHAR(80),long VARCHAR(90) NOT NULL,lat VARCHAR(100) NOT NULL,geog geography(point) NOT NULL,valid_from TIMESTAMP,county VARCHAR(100) ,countyId INT ,municipality VARCHAR(100) ,municipalityId INT);"
        );
        data.data.map(async (source) => {
          if (source.geometry && source.geometry) {
            let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`;
            const results = await db.query(
              "INSERT INTO sources(id,type,name,shortName,country,countryCode,long,lat,geog,valid_from,county,countyId,municipality,municipalityId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning name;",
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

async function FetchWeatherData(){
  try{
    let ids = await db.query('SELECT id FROM sources');
    fetch(`https://frost.met.no/sources/v0.jsonld?elements=mean(air_temperature%20P1D)&fields=id`,{
      method: "get",
      body: JSON.stringify(),
      headers: {
        Authorization:
          "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
      },
    })
    .then((res)=>res.json())
    .then(data=>{
        fetch(`https://frost.met.no/observations/v0.jsonld?sources=${data.data[0].id}&referencetime=1950-01-01%2F2022-02-12&elements=mean(air_temperature%20P1D)&fields=value%2C%20referenceTime`,
        {
          method: "get",
          body: JSON.stringify(),
          headers: {
            Authorization:
              "Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==",
          },
        })
        .then((res)=>res.json())
        .then(async data=>{
          console.log(data.data[0].observations)
          /* await db.query('INSERT INTO weather_data(tid, source_id,average_temp) values($1,$2,$3)',[data.data[]]) */
        })
    })
  }catch(err){
    console.log(err)
  }
}
app.post("/api/v1/getAllValues",async(req,res)=>{
  FetchWeatherData()
  res.status(200).json({
    status: "success",
    data: {
      value: "Oppdatert",
    },
  });
})
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

app.get("/api/v1/incomejson",async (req,res) =>{
  try{
    const incomes = await db.query("select * from inntekt_data;");
    const fs = require('fs');
    let rawdata = fs.readFileSync('kommuner_komprimert.json');
    let student = JSON.parse(rawdata);
    console.log(student);
  } catch(err){
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
      if (region.includes('"')){
        region = region.slice(0, region.length - 1);
      }
      const husholdningstypeid = ikt
        .split(";")[1]
        .split(" ")[0]
        .slice(1);
      const husholdningstypeArray = ikt.split(";")[1]
      let husholdningstype = husholdningstypeArray.replace('"' + husholdningstypeid + '', '').replace('"', '').slice(1);
      if (husholdningstype == NaN || husholdningstype == null || husholdningstype == undefined){
        husholdningstype = "Empty Empty Empty Empty Empty Empty Empty Empty Empty Empty Empty"
      }
      const aarArray = ikt.split(";")[2].split(" ")[0]
      const tid = parseInt(aarArray.substring(1,aarArray.length-1));
      let inntekt = parseInt(ikt.split(";")[4].split(" ")[0].split('"')[0])
      if (inntekt === NaN || inntekt === "Nan" || inntekt === "NaN" || Number.isNaN(inntekt) || inntekt === null){
        inntekt = 0;
      }
      let antallHus = parseInt(ikt.split(";")[8].split(" "))
      if (antallHus === NaN || antallHus === "Nan" || antallHus === "NaN" || Number.isNaN(antallHus) || antallHus === null){
        antallHus = 0;
      }

      if (antallHus !== 0 || inntekt !== 0){
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




