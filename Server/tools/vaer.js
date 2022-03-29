const fetch = require("node-fetch");
const db = require("../db");

async function fetchSources() {
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
              name VARCHAR(60) NOT NULL,
              shortName VARCHAR(50),country VARCHAR(70) NOT NULL,
              countryCode VARCHAR(80),
              masl INT NOT NULL,
              long VARCHAR(90) NOT NULL,
              lat VARCHAR(100) NOT NULL,
              geog geography(point) NOT NULL,
              valid_from TIMESTAMP,
              county VARCHAR(100),
              countyId INT,
              municipality VARCHAR(100) ,
              municipalityId INT);`
        );
        data.data.map(async (source) => {
          if (source.geometry) {
              if(!source.masl){
                  source.masl=0
              }
            let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`;
            const results = await db.query(
              "INSERT INTO sources(source_id,name,shortName,country,countryCode,masl,long,lat,geog,valid_from,county,countyId,municipality,municipalityId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14);",
              [
                source.id,
                source.name,
                source.shortName,
                source.country,
                source.countryCode,
                source.masl,
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
          
        });console.log("done")
        return "sucsess";
      } catch (err) {
        console.log(err);
      }
    });
  
}

async function fetchData() {
  await fetch(
    `https://frost.met.no/sources/v0.jsonld?types=SensorSystem&elements=mean(air_temperature%20P1M)&country=NO&fields=id%2Cvalidfrom`,
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
    );`
  );
      /* await db.query(
        `CREATE TABLE weather_data(weather_id INT, element VARCHAR(50),time VARCHAR(50),value INT,CONSTRAINT fk_weather FOREIGN KEY(weather_id) REFERENCES weather(weather_id) ON DELETE CASCADE );`
      ); */
      data.data.map(async (station) => {
        if (station.id) {
          let input = await db.query(
            "INSERT INTO weather(source_id, valid_from, element) values($1,$2,$3)",
            [station.id, station.validFrom, "mean(air_temperature P1M)"]
          );
        }
      });
    });
}
async function fetchWeatherData(){
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
    }
module.exports = { fetchSources,fetchData,fetchWeatherData };
