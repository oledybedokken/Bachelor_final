require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");
const fetch = require('node-fetch');
var GeoJSON = require('geojson');
const fs = require("fs");
const fastcsv = require("fast-csv");
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


async function FetchDataInntekt(){
    //const url = ("https://data.ssb.no/api/v0/dataset/49678.csv?lang=no")
    const url = ("https://data.ssb.no/api/v0/dataset/49678.json?lang=no")
    const inntekt = await fetch(url);
    let response = await inntekt.json()
    return response
    // BEGIN STREAM
    /* let stream = fs.createReadStream("https://data.ssb.no/api/v0/dataset/49678.csv?lang=no")
    let csvStream = fastcsv
        .parse()
        .on("data", function(data) {
            csvData.push(data);
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();
            // connect to the PostgreSQL database
            // save csvData
        });
    stream.pipe(csvStream);
    const query = "INSERT INTO inntekt(id, regionid, region, husholdningstype, aar, statistikkvariabel, husrsaa) values($1,$2,$3,$4,$5,$6,$7)";
    pool.connect((err, client, done) => {
        if (err) throw err;
        try {
          csvData.forEach(row => {
            client.query(query, row, (err, res) => {
              if (err) {
                console.log(err.stack);
              } else {
                console.log("inserted " + res.rowCount + " row:", row);
              }
            });
          });
        } finally {
          done();
        }
    }); */
    // END Stream
}
    

app.get("/api/v1/addinntekt",async (req,res)=>{
    try {
        const value = await FetchDataInntekt();
        console.log(value)
        res.status(200).json({
        status: "success",
        data:{
            value: value
            }
        })}
     catch (error) {console.log(error)}
})


app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
