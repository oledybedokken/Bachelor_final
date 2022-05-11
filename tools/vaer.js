const fetch = require("node-fetch");
const db = require("../db");
const fs = require("fs");
async function fetchSources() {
  const details = await fetch(
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
        let sqlinsert = data.data.filter((e) => e.geometry && e.id !== "SN9909000").map((source) => {
          if (source.geometry) {
            if (!source.masl) {
              source.masl = 0
            }
            let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`;
            return `('${source.id}', '${source.name}', '${source.shortName}','${source.country}','${source.countryCode}',${source.masl},'${source.geometry.coordinates[0]}','${source.geometry.coordinates[1]}','${Point}','${source.validFrom}','${source.county}',${source.countyId},'${source.municipality}',${source.municipalityId})`
          }
        })
        const result = await db.query("INSERT INTO sources(source_id,name,shortName,country,countryCode,masl,long,lat,geog,valid_from,county,countyId,municipality,municipalityId) values" + sqlinsert + "returning *")
        return (result.rows.length);
      } catch (err) {
        return (err)
      }
    });
  return details
}
async function fetchData(fetchDetails) {
  try {
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
    const sources = await db.query("select (source_id) from sources;");
    const details = fetchDetails.map(async (element) => {
      const value = await fetch(
        `https://frost.met.no/sources/v0.jsonld?types=SensorSystem&elements=${element}&country=NO&fields=id%2Cvalidfrom`,
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
          const id = "SN59450"
          let sqlInsert = data.data.filter(e => e !== null && sources.rows.some(b => b.source_id === e.id)).map((value) => {
            return `('${value.id}','${value.validFrom}','${element}')`
          })
          //fs.writeFileSync('./data6.json', JSON.stringify(sqlInsert, null, 2), 'utf-8');
          let input = await db.query("INSERT INTO weather(source_id, valid_from, element) values" + sqlInsert + "returning *");
          return input.rows;
        });
      return value
    });
    const values = await Promise.all(details)
    //Promise.all(details).then((values)=>{console.log(values)})

    let innerLength=0
    for (const row of values) {
      innerLength += row.length;
    }
    return (innerLength)
  }
  catch (err) {
    console.log(err)
  }
}
async function fetchWeatherData(fetchDetails) {
  try {
    console.log("started")
    await db.query("DROP TABLE IF EXISTS weather_data;");
    await db.query(`CREATE TABLE weather_data(weather_id INT, element VARCHAR(50),time VARCHAR(50),value INT,CONSTRAINT fk_weather FOREIGN KEY(weather_id) REFERENCES weather(weather_id) ON DELETE CASCADE );`);
    let values = []
    const details = fetchDetails.map(async (detail) => {
      let sources = await db.query(`SELECT * FROM weather where element = '${detail}';`);
      let insertSql = []
      let i = 0
      for (let source of sources.rows) {
        let res = await fetch(
          `https://frost.met.no/observations/v0.jsonld?sources=${source.source_id}&referencetime=${source.valid_from.split("T")[0]}%2F2022-02-20&elements=${detail}&fields=value%2C%20referenceTime`,
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
          let currSqlInsert = tempData.data.map((currentWeatherData) => {
            return `('${source.weather_id}','${detail}','${currentWeatherData.referenceTime.split("T")[0]}',${parseInt(currentWeatherData.observations[0].value)})`
          })
          insertSql.push(...currSqlInsert);
        }
        if (i === 0) {
          console.log(tempData)
        }
        if (i % 10 === 0) { console.log('current:' + i + ':' + sources.rows.length) }
        i++
      }
      //fs.writeFileSync('./data6.json', JSON.stringify(insertSql, null, 2), 'utf-8');
      const valuesreturn = await db.query(`INSERT INTO weather_data(weather_id,element,time,value) values ${insertSql} returning *`);
      return valuesreturn.rows.length
    })
    const returnValue = await Promise.all(details)
    console.log(returnValue)
    let innerLength=0
    for (const row of returnValue) {
      innerLength += row
    }
    console.log(innerLength)
    return innerLength
  }
  catch (err) {
    console.log(err)
  }
}
module.exports = { fetchSources, fetchData, fetchWeatherData };
