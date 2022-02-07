require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
const fetch = require('node-fetch');
var GeoJSON = require('geojson');
const port = process.env.PORT || 3001;

// Få alle plasser
app.get("/api/v1/sources", async (req, res) =>{
    try {
        const plasser = await db.query("SELECT * FROM sources limit 10;");
        res.status(200).json({
        status: "success",
        plasser: plasser.rows.length,
        data:{
            plass: GeoJSON.parse(plasser.rows, {Point: ['lat', 'long']})//plasser.rows,
        }
        })
    } catch (error) {console.log(error)}
})

//Får spesifikk plass
app.get("/api/v1/sources/:id", async (req,res)=>{
    try {
        const plass = await db.query("SELECT * FROM sources WHERE id = $1", [req.params.id]);
        //
        res.status(200).json({
        status: "success",
        data:{
            plass: GeoJSON.parse(plass.rows, {Point: ['lat', 'long'], include: ['name', 'municipality', 'county']})//plasser.rows,
        }
        })
    } catch (error) {console.log(error)}
})
async function FetchData(){
fetch('https://frost.met.no/sources/v0.jsonld?types=SensorSystem&country=Norge',{
    method:"get",
    body: JSON.stringify(),
    headers:{ Authorization: 'Basic YjVlNmEzODEtZmFjNS00ZDA4LWIwNjktODcwMzBlY2JkNTFjOg==' }
})
    .then(res =>res.json())
    .then(async(data)=>{
        try{
            await db.query("DROP TABLE IF EXISTS sources;")
            await db.query("CREATE TABLE sources(id VARCHAR(10) PRIMARY KEY UNIQUE NOT NULL,type VARCHAR(50),name VARCHAR(60) NOT NULL,shortName VARCHAR(50),country VARCHAR(70) NOT NULL,countryCode VARCHAR(80),long VARCHAR(90) NOT NULL,lat VARCHAR(100) NOT NULL,geog geography(point) NOT NULL,valid_from TIMESTAMP,valid_to TIMESTAPM,county VARCHAR(100) ,countyId INT ,municipality VARCHAR(100) ,municipalityId INT);")
            data.data.map(async(source)=>{
                if(source.geometry && source.geometry){
                let Point = `POINT(${source.geometry.coordinates[0]} ${source.geometry.coordinates[1]})`
                const results =await db.query("INSERT INTO sources(id,type,name,shortName,country,countryCode,long,lat,geog,valid_from,valid_to,county,countyId,municipality,municipalityId) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning name;",[source.id,source.type,source.name,source.shortName,source.country,source.countryCode,source.geometry.coordinates[0],source.geometry.coordinates[1],Point,source.validFrom,source.validTo,source.county,source.countyId, source.municipality,source.municipalityId])
        }
        })
    }
    catch(err){
        console.log(err)
    }
    const value ="Hei"
    return (value)})
    .catch(error=>console.log(error))
}


async function combine(){
    const sources = await db.query("select * from sources;")
    for (let index = 0; index < sources.rows.length; index++) {
        const element = await db.query("select id from sources where ST_DWithin(geog,ST_POINT($1,$2)::geography,50)",[sources.rows[index].long,sources.rows[index].lat])
        if(element.rows.length>1){
        const returndata = {id:sources.rows[index].id,nearest:element.rows}
        console.log(returndata)}
    }
}
/* combine()
console.log("done") */
// Får alle byer gruppert i kommune
{/*
app.get("/api/v1/sources/kommune", async (req,res)=>{
    try {
        const kommuner = await db.query("SELECT county FROM sources GROUP BY county;");
        //
        res.status(200).json({
        status: "success",
        data:{
            kommuner: kommuner.rows,
        }
        })
    } catch (error) {console.log(error)}
})
*/}


// Får alle kommuner gruppert i fylke
{/* 
app.get("/api/v1/sources/fylke", async (req,res)=>{
    try {
        const fylker = await db.query("SELECT {fylke} FROM sources GROUP BY {fylke}");
        //
        res.status(200).json({
        status: "success",
        data:{
            fylke: fylker.rows,
        }
        })
    } catch (error) {console.log(error)}
})
*/}

//Får ...



async function FetchDataAPI(latInput,lonInput,startInput,endInput,APIkeyInput){
    const url = ('http://history.openweathermap.org/data/2.5/history/city?lat='+latInput+'&lon='+lonInput+'&type=hour&start='+startInput+'&end='+endInput+'&appid='+APIkeyInput+'&units=metric')
    const city = await fetch(url);
    let response = await city.json()
    return response
}
app.get("/api/v1/getdata",async(req,res)=>{
    try {
        const cities= await FetchDataAPI(59.92,10.75,1641583369,1644261769,process.env.APIKODE);
        res.status(200).json({
            status: "success",
            data:{
                cities: cities
            }
    })} catch (error) {
        console.log(error)
    }
})

app.post("/api/v1/admin",async (req,res)=>{
    try {
        const value = await FetchData();
        console.log(value)
        res.status(200).json({
        status: "success",
        data:{
            value:"Data oppdatert!"
            }
        })}
     catch (error) {console.log(error)}
})

// Får byer som er nærmere til hverandre
app.get("/api/v1/sources/near/", async (req, res) =>{
    try {
        const plasser = await db.query("SELECT name, ST_Distance(ST_MakePoint(58.9482, 36.578581 ), sources.geog) AS dist FROM sources ORDER BY dist LIMIT 10;")
        // await db.query("SELECT s1.name, s2.name FROM sources s1, sources s2 WHERE ST_Distance(ST_MakePoint(s1.long, s1.lat ), ST_MakePoint(s2.long, s2.lat)) < 40;")
        console.log(plasser)
        res.status(200).json({
        status: "success",
        plasser: plasser.rows.length,
        data:{
            plass: "hello"
        }
        })
    } catch (err) { 
        console.log(err);
        res.sendStatus(500); 
     }
})



app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
