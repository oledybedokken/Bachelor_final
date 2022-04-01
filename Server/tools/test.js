const JSONstat = require("jsonstat-toolkit");
const fs = require("fs");
const fetch = require("node-fetch");
const _ = require("lodash");
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
//const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
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
  console.log("s");
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
  let sortedArray =newArray.filter((data)=>parseInt(data.Tid)<parseInt(2017))
  //fs.writeFileSync("./data3.json",JSON.stringify(sortedArray, null, 2),"utf-8");
  let rawData = fs.readFileSync("./tools/Kommuner/kommuner17wgs.json");
  let kommuner = JSON.parse(rawData);
  for(kommune in kommuner.features){
    kommuner.features[kommune].properties=sortedArray.find((e)=>e.RegionNumber===kommuner.features[kommune].properties.kommunenr) 
  }
  /* console.log(array.filter(data=>data.value!==null)) */
  /*  let verider = SammenSlaaing(test) */
  //fs.writeFileSync('./data2.json', JSON.stringify(array, null, 2), 'utf-8');
  return kommuner;
}

/* test() */
module.exports = { test };

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
