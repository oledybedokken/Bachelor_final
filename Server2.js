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
const test = require("./tools/test.js");
const { time } = require("console");
const port = process.env.PORT || 3001;
app.post("/api/v1/sources", async (req, res) => {
  let status =await vaerFunctions.fetchSources();
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
app.post("/api/v1/getWeatherDataForSource",async(req,res)=>{
    try{
        let status = await vaerFunctions.fetchWeatherData();
        if(status==="success"){
            res.status(200).json({
                status: "success",
                data: {
                  value: "Oppdatert",
                },
              });
        }
    }
    catch(err){
        console.log(err)
    }
});

app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`);
  });
