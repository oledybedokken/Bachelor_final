const JSONstat = require("jsonstat-toolkit");
const fs = require("fs");
const fetch = require("node-fetch");
const _ = require("lodash");
const sammenSlaaing = require("../Waste/sammenSlaaing.js");
let ssbObject = {
  "Snåase - Snåsa (-2017)": "Snåsa",
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
  "Unjárga - Nesseby": "Nesseby",
  "Oslo kommune": "Oslo",
};
function fetchData(url) {
  return JSONstat(url).then(main);
}
function startsWithNumber(str) {
  return /^\d/.test(str);
}
//const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function main(j) {
  let regionType=""
  var ds = j.Dataset(0);
  console.log(ds.id)
  //fs.writeFileSync("./data4.json", JSON.stringify(ds.Dimension("Kjonn").Category(), null, 2), "utf-8");
  let sorting = {}
  console.log(ds.id)
  let variabler = ds.id.filter(item => { return item !== 'Region' && item !== 'ContentsCode' && item !== 'Tid' })
  let ContentsCodesIds = ds.Dimension("ContentsCode").id
  let ContentsCodes = []
  ContentsCodesIds.forEach((content, index) => {
    const ContentCodeObject = {
      label: ds.Dimension("ContentsCode").Category(index).label,
      unit: ds.Dimension("ContentsCode").Category(index).unit
    }
    ContentsCodes.push(ContentCodeObject)
  })
  //console.log(ds.Dimension("Region").link.describedby[0].extension.Region.split(":")[ds.Dimension("Region").link.describedby[0].extension.Region.split(":").length-1])
  if(ds.Dimension("Region").link.describedby[0].extension.Region.split(":")[ds.Dimension("Region").link.describedby[0].extension.Region.split(":").length-1]==="131"){
    regionType = "kommune"
  }
  else if(ds.Dimension("Region").link.describedby[0].extension.Region.split(":")[ds.Dimension("Region").link.describedby[0].extension.Region.split(":").length-1]==="104"){
    regionType="fylke"
  }
  let brukerVariabler = [];
  if (variabler.length > 0) {
    variabler.map((variabel) => {
      const dimensionIds = ds.Dimension(variabel).length;
      let variableObject = {
        id: variabel,
        options: []
      }
      for (let i = 0; i < dimensionIds; i++) { variableObject.options.push(ds.Dimension(variabel).Category(i).label) }
      brukerVariabler.push(variableObject)
    })
    if (brukerVariabler.length > 0) {
      sorting = {
        options: brukerVariabler,
        times: ds.Dimension("Tid").id,
        ContentsCodes: ContentsCodes,
        ContentCode: ContentsCodes[0]
      }
    }
    else {
      sorting = {
        times: ds.Dimension("Tid").id,
        value: "NoSortNeeded",
        ContentsCodes: ContentsCodes,
        ContentCode: ContentsCodes[0]
      }
    }
  }
  else{
    sorting = {
      times: ds.Dimension("Tid").id,
      value: "NoSortNeeded",
      ContentsCodes: ContentsCodes,
      ContentCode: ContentsCodes[0]
    }
  }
  let ssbKommuner = Object.entries(
    ds.__tree__.dimension.Region.category.label
  ).reduce((acc, [key, value]) => ((acc[value] = key), acc), {});
  //fs.writeFileSync("./data4.json", JSON.stringify(ssbKommuner, null, 2), "utf-8");
  let array = ds.toTable({ type: "arrobj" }, function (d) {
    if (d.value !== null) {
      d.RegionNumber = ssbKommuner[d.Region];
      if (d.RegionNumber[0] === "K") {
        d.RegionNumber = d.RegionNumber.slice(2);
      }
      
      /* if (d.RegionNumber in nrBytte) {
        d.RegionNumber = nrBytte[d.RegionNumber];
      } */
      let RegionSplit = d.Region.split("(");
      if (d.Region in ssbObject) {
        d.Region = ssbObject[d.Region];
      } else {
        d.Region = RegionSplit[0].trim();
      }
      d.Region = RegionSplit[0].trim();
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
  return {array:array,sorting:sorting,regionType:regionType,name:ds.label};
}
//objectCreator()
module.exports = { fetchData };
/* function objectCreator() {
  let kommuner2017Raw = fs.readFileSync("./tools/Kommuner/kommuner17wgs.json");
  let kommuner2017 = JSON.parse(kommuner2017Raw);
  let kommuner2018Raw = fs.readFileSync("./tools/Kommuner/kommuner18wgs.json");
  let kommuner2018 = JSON.parse(kommuner2018Raw);
  let kommuner2019Raw = fs.readFileSync("./tools/Kommuner/kommuner19wgs.json");
  let kommuner2019 = JSON.parse(kommuner2019Raw);
  let gamleKommuner = [];
  KommuneReformen.slice(1).map((reform) => {
    reform.GammelKommune.split(",").map((gammelKommune) => {
      let gammelKommuneverdi = null;
      if (parseInt(reform.Aar) - 1 === 2017) {
        gammelKommuneverdi = kommuner2017.features.find(
          (e) => gammelKommune.trim() === e.properties.kommunenavn
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenavn,
          kommunenummer: parseInt(gammelKommuneverdi.properties.kommunenr),
        };
        gamleKommuner.push(gammelKommuneverdi);
      } else if (parseInt(reform.Aar) - 1 === 2018) {
        gammelKommuneverdi = kommuner2018.features.find(
          (e) => gammelKommune.trim() === e.properties.Kommunenav
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenav,
          kommunenummer: gammelKommuneverdi.properties.Kommunenum,
        };
        gamleKommuner.push(gammelKommuneverdi);
      } else {
        gammelKommuneverdi = kommuner2019.features.find(
          (e) => gammelKommune.trim() === e.properties.kommunenavn
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenavn,
          kommunenummer: parseInt(gammelKommuneverdi.properties.kommunenummer),
        };
        gamleKommuner.push(gammelKommuneverdi);
      }
    });
  }); 
  //fs.writeFileSync("./data4.json", JSON.stringify(gamleKommuner, null, 2), "utf-8");
}*/

/*if (variabler.length > 0) {
  for (const key in ssbKommuner) {
    brukerVariabler[0].options.map((item)=>{
      brukerVariabler[1].options.map((item2)=>{
        if(ssbKommuner[key][0]==="K"){
          ssbKommuner[key]=ssbKommuner[key].slice(2)
        }
          let currArray = array.filter((currData)=>parseInt(ssbKommuner[key]) === currData.RegionNumber&&currData[brukerVariabler[0].id] === item&&currData[brukerVariabler[1].id]===item2);
        })
      })
    brukerVariabler[variabler[0]].map((type) => {
      const currVariable = variabler[0];
      if(ssbKommuner[key][0]==="K"){
        ssbKommuner[key]=ssbKommuner[key].slice(2)
      }
      let currArray = array.filter((currData)=>parseInt(ssbKommuner[key]) === currData.RegionNumber&&currData[currVariable] === type);
      if (currArray.length > 0) {
        const newObject = {
          RegionNumber: currArray[0].RegionNumber,
          Region: currArray[0].Region,
          [currVariable]: currArray[0][currVariable],
        };
        currArray.map((data) => {
          if (newObject[data.ContentsCode]) {
            newObject[data.ContentsCode][data.Tid] = data.value;
          } else {
            newObject[data.ContentsCode] = {};
            newObject[data.ContentsCode][data.Tid] = data.value;
          }
        });
        newArray.push(newObject);
      }
    });
  }
} else {
  for (const key in ssbKommuner) {
    let currArray = array.filter(
      (currData) => parseInt(ssbKommuner[key]) === currData.RegionNumber
    );
    if (currArray.length > 0) {
      const newObject = {
        RegionNumber: currArray[0].RegionNumber,
        Region: currArray[0].Region,
      };
      currArray.map((data) => {
        if (newObject[data.ContentsCode]) {
          newObject[data.ContentsCode][data.Tid] = data.value;
        } else {
          newObject[data.ContentsCode] = {};
          newObject[data.ContentsCode][data.Tid] = data.value;
        }
      });
      newArray.push(newObject);
    }
  }
}*/
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
