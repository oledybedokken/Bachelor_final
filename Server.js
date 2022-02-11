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
const { table } = require("console");
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
    const url = ("https://data.ssb.no/api/v0/dataset/49678.csv?lang=no")
    //const url = ("https://data.ssb.no/api/v0/dataset/49678.json?lang=no")
    const data = await fetch(url); //fs.readFile(url); //fs.createReadStream(url);
    let response = await data.text();
    let table = response.split('\n').slice(1);
    //console.log(table)
    table.forEach(row => {
        const columns = row.split(';');

        //Region
        const regionstring = columns[0];
        const region1 = regionstring.replace('"', '');
        const region2 = region1.replace('"', '');
        const region = region2.split(" ")
        const regionid  = region[0]; 
        const regionname =region[1];
        
        //Husholdningtype
        const husholdningtypestring = columns[1];
        const husholdningtype1 = husholdningtypestring.replace('"', '');
        const husholdningtype = husholdningtype1.replace('"', '');

        // Tid
        const tidstring = columns[2];
        const tid1 = tidstring.replace('"', '');
        const tid = tid1.replace('"', '');
        const statvarstring = columns[3];


        try {
            /* await */ db.query("DROP TABLE IF EXISTS inntekt_data;")
            /* await */ db.query("CREATE TABLE inntekt_data(regionid INT NOT NULL,region VARCHAR(50) NOT NULL,husholdningstype VARCHAR(100),tid int,inntekt int,antallhus int);")
            if (statvarstring == '"Inntekt etter skatt, median (kr)"')
            {
                /* await */ db.query("INSERT INTO inntekt_data(regionid,region,husholdningstype,tid,inntekt) VALUES ($1,$2,$3,$4,$5)", [regionid, regionname, husholdningtype, tid, columns[4]]);
            }
            if (statvarstring == '"Antall husholdninger"')
            {
                /* await */  db.query("UPDATE inntekt_data set antallhus = $1 WHERE regionid = $2 AND tid = $3",[columns[4], regionid, tid]);
            }
        } catch (error) { console.log(error)}
        
        
    })
    //return table;

}
    

app.post("/api/v1/addinntekt",async (req,res)=>{
    try {
        const value = await FetchDataInntekt();
        console.log(value)
        res.status(200).json({
        status: "success",
        data:{
            value: "Oppdatert"
            }
        })}
     catch (error) {console.log(error)}
})


app.listen(port, () => {
  console.log(`server is up and listening on port ${port}`);
});
