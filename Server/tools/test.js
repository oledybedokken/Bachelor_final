const JSONstat = require("jsonstat-toolkit");
const fs = require("fs");
const fetch = require("node-fetch");
const _ = require("lodash");
const sammenSlaaing = require("../sammenSlaaing.js");
var url = "https://data.ssb.no/api/v0/dataset/49678.json?lang=no";
let ssbObject = {
    "Snåase - Snåsa (-2017)":"Snåsa",
    "Raarvihke - Røyrvik (1923-2017)": "Røyrvik",
    "Fauske - Fuossko": "Fauske",
    "Hamarøy - Hábmer (-2019)": "Hamarøy",
    "Divtasvuodna - Tysfjord (-2019)": "Tysfjord",
    "Evenes - Evenássi": "Evenes",
    "Sortland - Suortá": "Sortland",
    "Harstad - Hárstták (2013-2019)": "Harstad",
    "Loabák - Lavangen (1907-2019)": "Lavangen",
    "Storfjord - Omasvuotna - Omasvuono (1931-2019)": "Stofjord",
    "Gáivuotna - Kåfjord - Kaivuono (1931-2019)": "Kåfjord",
    "Nordreisa - Ráisa - Raisi (-2019)": "Nordreisa",
    "Guovdageaidnu - Kautokeino (-2019)": "Kautokeino",
    "Porsanger - Porsángu - Porsanki (1964-2019)": "Porsanger",
    "Kárásjohka - Karasjok (-2019)": "Karasjok",
    "Deatnu - Tana (-2019)": "Tana",
    "Unjárga - Nesseby (-2019)": "Nesseby",
    "Snåase - Snåsa": "Snåsa",
    "Raarvihke - Røyrvik": "Røyrvik",
    "Loabák - Lavangen": "Lavangen",
    "Storfjord - Omasvuotna - Omasvuono": "Storfjord",
    "Gáivuotna - Kåfjord - Kaivuono": "Kåfjord",
    "Guovdageaidnu - Kautokeino": "Kautokeino",
    "Porsanger - Porsángu - Porsanki ": "Porsanger",
    "Kárásjohka - Karasjok": "Karasjok",
    "Deatnu - Tana": "Tana",
    "Unjárga - Nesseby": "Nesseby"
};
function test() {
  return JSONstat(url).then(main);
}
function startsWithNumber(str) {
  return /^\d/.test(str);
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function main(j) {
  var ds = j.Dataset(0);
  let ContentsCodes = [];
  var dimensionIds = ds.Dimension("ContentsCode").length;
  for (let i = 0; i < dimensionIds; i++) {
    ContentsCodes.push(ds.Dimension("ContentsCode").Category(i).label);
  }
  let HusholdTyper = [];
  for (let i = 0; i < dimensionIds; i++) {
    HusholdTyper.push(ds.Dimension("HusholdType").Category(i).label);
  }
  let times = [];
  var dimensionIds = ds.Dimension("Tid").length;
  for (let i = 0; i < dimensionIds; i++) {
    times.push(ds.Dimension("Tid").Category(i).label);
  }
  let ssbKommuner = Object.entries(ds.__tree__.dimension.Region.category.label).reduce((acc, [key, value]) => ((acc[value] = key), acc), {});
  let array = ds.toTable({ type: "arrobj" }, function (d) {
    if (d.value !== null) {
      d.RegionNumber = ssbKommuner[d.Region];
      if(d.RegionNumber==="0706"){
        d.RegionNumber="0710"
      }
      let RegionSplit = d.Region.split("(");
      if(d.Region in ssbObject){
        d.Region=ssbObject[d.Region]
    } 
    else{
      d.Region = RegionSplit[0].trim();
    }
    if (RegionSplit.length > 1) {
        if (startsWithNumber(RegionSplit[1].split("-")[1])) {
          d.gyldigTil = parseInt(RegionSplit[1].split("-")[1].slice(0, -1));
        } else {
          d.tilhører = RegionSplit[1].slice(0, -1);
        }
      }
    return d;
    }
  });
  let newArray = [];
  for (const key in ssbKommuner) {
    let currArray = array.filter(
      (currData) => ssbKommuner[key] === currData.RegionNumber
    );
    if(currArray.length>0){
    HusholdTyper.map((type) =>
      ContentsCodes.map((contentCode) => {
        let thisArray = currArray.filter((code)=>contentCode === code.ContentsCode && code.HusholdType === type);
        currArray[0][contentCode]={}
        thisArray.map((data) => {
            currArray[0][contentCode][data.Tid]=data.value
          });  
      })
    );
    newArray.push(currArray[0]);
    }
  };
  let rawData = fs.readFileSync("./Assets/KommunerNorge.geojson");
  let kommuner = JSON.parse(rawData);
  for(kommune in kommuner.features){
      if(newArray.find((e)=>parseInt(e.RegionNumber)===kommuner.features[kommune].properties.kommunenummer)){
    kommuner.features[kommune].properties=newArray.find((e)=>parseInt(e.RegionNumber)===kommuner.features[kommune].properties.kommunenummer)
      }
      else{
        kommuner.features[kommune].properties=parseInt(kommuner.features[0].properties.kommunenummer)
      }
  }
  return kommuner;
}

//objectCreator()
module.exports = { test };


function objectCreator(){
  let kommuner2017Raw = fs.readFileSync('./Kommuner/kommuner17wgs.geojson');
  let kommuner2017 = JSON.parse(kommuner2017Raw);
  let kommuner2018Raw = fs.readFileSync('./Kommuner/kommuner18wgs.json')
  let kommuner2018 = JSON.parse(kommuner2018Raw);
  let kommuner2019Raw = fs.readFileSync('./Kommuner/kommuner19wgs.json')
  let kommuner2019 = JSON.parse(kommuner2019Raw);
  let gamleKommuner = []
  KommuneReformen.slice(1).map((reform)=>{
    reform.GammelKommune.split(",").map((gammelKommune)=>{
      let gammelKommuneverdi=null
      console.log(reform)
      console.log(reform.GammelKommune)
      console.log(gammelKommune.trim())
      if(parseInt(reform.Aar)-1===2017){
        gammelKommuneverdi = kommuner2017.features.find((e)=>gammelKommune.trim()===e.properties.kommunenavn)
        console.log(gammelKommuneverdi.properties)
        gammelKommuneverdi.properties= {
          "navn":gammelKommuneverdi.properties.kommunenavn,
          "kommunenummer":parseInt(gammelKommuneverdi.properties.kommunenr)
        }
        gamleKommuner.push(gammelKommuneverdi)
      }
      else if(parseInt(reform.Aar)-1===2018){
        gammelKommuneverdi = kommuner2018.features.find((e)=>gammelKommune.trim()===e.properties.Kommunenav)
        gammelKommuneverdi.properties= {
          "navn":gammelKommuneverdi.properties.kommunenav,
          "kommunenummer":gammelKommuneverdi.properties.Kommunenum
        }
        gamleKommuner.push(gammelKommuneverdi)
      }
      else{
        gammelKommuneverdi = kommuner2019.features.find((e)=>gammelKommune.trim()===e.properties.kommunenavn)
        console.log(gammelKommuneverdi)
        gammelKommuneverdi.properties= {
          "navn":gammelKommuneverdi.properties.kommunenavn,
          "kommunenummer":parseInt(gammelKommuneverdi.properties.kommunenummer)
        }
        gamleKommuner.push(gammelKommuneverdi)}
    })
  })
  console.log(gamleKommuner.length)
  fs.writeFileSync('./data4.json', JSON.stringify(gamleKommuner, null, 2), 'utf-8');

}



/* function SammenSlaaing(alleVerider){
    let display = []
    KommuneReformen.map((kommuneKombo)=>{
        let newKombo = []
        newKombo.push({ "newKommune": kommuneKombo.newKommune,"aarEndring":kommuneKombo.Aar})
        kommuneKombo.GammelKommune.split(",").map((kommune)=>{
            let aktivKommune = kommune.trim()
            alleVerider.filter((verdi)=>verdi.Region===aktivKommune).map((newKommune)=>{
                newKombo.push(newKommune)
            })
        })
        display.push(newKombo)
    })
    let newKommunerSammen = []
    display.map((kommuneArray)=>{
        const uniquesTypes = _.uniq(_.map(kommuneArray.slice(1), 'ContentsCode'));
        const uniquesAar = _.uniq(_.map(kommuneArray.slice(1), 'Tid'));
        const uniquesHusholdType = _.uniq(_.map(kommuneArray.slice(1), 'HusholdType'));
        uniquesTypes.map((Type)=>{
            uniquesAar.map((aar)=>{
                uniquesHusholdType.map((HusHoldTypeAktiv)=>{
                    const object = {}
                    if(parseInt(kommuneArray[0].aarEndring)>parseInt(aar)){
                        let aktivArray=kommuneArray.filter(type=>type.ContentsCode===Type && type.Tid === aar && type.HusholdType===HusHoldTypeAktiv)
                        object["Region"]=kommuneArray[0].newKommune;
                        object["ContentsCode"]=Type
                        object["HusholdType"]=HusHoldTypeAktiv
                        object["Tid"]=aar
                        object["value"]= parseInt(aktivArray.reduce((total,next)=>total+next.value,0)/aktivArray.length)
                        newKommunerSammen.push(object)
                    }                    
                })
            })
        })
    })
    let nyeKommuner = KommuneReformen.map(function(i) {
        let object ={}
        object.newKommune = i.newKommune
        object.aarEndring = i.Aar
        return object;
      });
        let result = [...newKommunerSammen,...alleVerider]
    let result = [...newKommuner,...arr] 
     return result
    } */
