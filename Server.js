require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
const fetch = require('node-fetch');

const port = process.env.PORT || 3001;
fetch('https://frost.met.no/sources/v0.jsonld',{
    method:"get",
    body: JSON.stringify(),
    headers:{ Authorization: 'Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==' }
})
    .then(res =>res.json())
    .then(async(data)=>{
        console.log(data.data[0].shortName)
        try{
        await db.query("DROP TABLE IF EXISTS sources;")
        await db.query("CREATE TABLE sources(id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,type VARCHAR(50),name VARCHAR(60) NOT NULL,shortName VARCHAR(50),country VARCHAR(70) NOT NULL,countryCode VARCHAR(80),long VARCHAR(90) NOT NULL,lat VARCHAR(100) NOT NULL,geog geography(point) NOT NULL,valid_from TIMESTAMP);")
        data.data.map(async (source)=>{
            if(source.geometry && source.geometry){
            let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`
            const results =await db.query("INSERT INTO sources(id,type,name,shortName,country,countryCode,long,lat,geog,valid_from) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning name;",[source.id,source.type,source.name,source.shortName,source.country,source.countryCode,source.geometry.coordinates[0],source.geometry.coordinates[1],Point,source.valid_from])
            if (results.rows[0]){console.log(results.rows[0])}
        }
        })
    }
    catch(err){
        console.log(err)
    }
    })
    .catch(error=>console.log(error))

app.get("https://frost.met.no/sources/v0.jsonld",(req,res)=>{
    console.log(res)
})
app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
