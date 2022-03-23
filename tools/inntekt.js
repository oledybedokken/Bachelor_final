const fs = require("fs");
const db = require("../db");
const sammenSlaaing = require("../sammenSlaaing.js");
const fetch = require("node-fetch");
const _ = require("lodash");  

const objectArray = [];
async function LeseData() {
  const response = fs.readFileSync("./incomes2.txt", "utf8");
  const kommuner = await fetch("https://ws.geonorge.no/kommuneinfo/v1/kommuner").then(response => response.json()).then(data => {return data});
  let info = response.split(/\r?\n/);
  //info.slice(1)
  console.time("StartTime")
  let start = 0
  info.slice(1).filter(linje => linje[linje.length - 1] !== ".").map((linje) => {
    //if (linje[linje.length - 1] !== ".") {
    let testLinje = linje.split(";");
    if (objectArray.some(data => data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1] || //HEr må noe legges til && data.aar === parseInt(testLinje[3].replaceAll('"', "")) && data.Husholdningtype === testLinje[1].split(/\s(.+)/)[1].replaceAll('"', ""))) {
      //if (objectArray.filter((data)=>data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1]).filter((data) => data.aar === testLinje[3].replaceAll('"', "")).filter((data)=>data.Husholdningtype===testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "")).length > 0 && objectArray.length > 0) {
      //Her finnes både Navn og Året fra før
      for (var i = start; i < objectArray.length; i++) {
        if (objectArray[i]["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1] && objectArray[i]["aar"] === parseInt(testLinje[3].replaceAll('"', "")) && objectArray[i]["Husholdningtype"] === testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "")) {
          if (testLinje[2].replaceAll('"', "") === "Samlet inntekt, median (kr)") {
            objectArray[i]["bruttoInntekt"] = parseInt(testLinje[4]);
            start = i
            break;
          } else if (testLinje[2].replaceAll('"', "") === "Inntekt etter skatt, median (kr)") {
            objectArray[i]["nettoInntekt"] = parseInt(testLinje[4]);
            start = i
            break;
          } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
            objectArray[i]["antallHusholdninger"] = parseInt(testLinje[4]);
            start = i
            break;
          }
        }
      }
    }
    else {
      let createObject = {};
      let firstNameSplit = testLinje[0].replaceAll('"', "").split(" ")
      if(firstNameSplit.length>3){
        createObject["navn"] = firstNameSplit[1].substring(0, testLinje[0].replaceAll('"', "").split(/\s(.+)/)[1].lastIndexOf(" ") + 1).replaceAll(" ","")
        /* [ '1736', 'Snåase', '-', 'Snåsa', '(-2017)' ]
        [ '1841', 'Fauske', '-', 'Fuossko' ] */
        if(firstNameSplit[2]==="-"){
          if(kommuner.some((kommune)=>kommune.kommunenavn===firstNameSplit[1])){
            console.log(firstNameSplit[1])
            createObject["navn"] = firstNameSplit[1];
          }
          else if(kommuner.some((kommune)=>kommune.kommunenavn===firstNameSplit[3])){
            createObject["navn"] = firstNameSplit[3];
          }
          else{
            let funnet = false
            for(let i = 0; i<KommuneReformen.length; i++){
              KommuneReformen[i].GammelKommune.split(";").map((gammelKommune)=>{
                if(gammelKommune===firstNameSplit[1]){
                  createObject["navn"] = firstNameSplit[1];
                  funnet = true
                  return
                }
                else if(gammelKommune===firstNameSplit[3]){
                  createObject["navn"] = firstNameSplit[3];
                  funnet = true
                  return
                }
              })
              if(funnet===true){
                break;
              }         }
            
          }
        }
      }
      else if(firstNameSplit.length<=3){
        createObject["navn"] = firstNameSplit[1]
      }
      createObject["kommuneNr"] = parseInt(testLinje[0].replaceAll('"', "").split(" ")[0]);
      createObject["HusholdningId"] = testLinje[1].replaceAll('"', "").split(" ")[0];
      createObject["aar"] = parseInt(testLinje[3].replaceAll('"', ""));
      createObject["Husholdningtype"] = testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "");
      let errorHandling = false;
      if (testLinje[2].replaceAll('"', "") === "Samlet inntekt, median (kr)") {
        createObject["bruttoInntekt"] = parseInt(testLinje[4]);
      } else if (testLinje[2].replaceAll('"', "") === "Inntekt etter skatt, median (kr)") {
        createObject["nettoInntekt"] = parseInt(testLinje[4]);
      } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
        createObject["antallHusholdninger"] = parseInt(testLinje[4]);
      } else {
        errorHandling = true;
      }
      if (errorHandling === false) {
        objectArray.push(createObject);
      }
    }
    //}
  });
  console.timeEnd("StartTime")
  return objectArray;
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function SammenSlaaing() {
  let inntekter = await LeseData()
  let newObject = {}
  let average = 0;
  let testList = [];
  KommuneReformen.map((sammenSlaaing) => {
    let gammleKommuner = sammenSlaaing.GammelKommune.split(",");
    let currentKommune = []
    currentKommune.push({ "newKommune": sammenSlaaing.newKommune, "newKommuneNr": sammenSlaaing.newKommuneId })
    gammleKommuner.map((GammelKommune) => {
      let kommuneNavn = GammelKommune.replaceAll(" ", "")
      if (inntekter.filter(obj => obj["navn"] === kommuneNavn).length > 0) {
        currentKommune.push(inntekter.filter(obj => obj["navn"] === kommuneNavn)[0])
      }
    })
    testList.push(currentKommune)
  })
  newKommuner = []
  testList.map((gammelKommuneCombo) => {
    if (gammelKommuneCombo.length > 1)
    {
      let newKommune = {}
      newKommune["navn"] = gammelKommuneCombo[0]["newKommune"]
      newKommune["KommuneNr"] = gammelKommuneCombo[0]["newKommuneNr"]
      newKommune["HusholdingsId"] = gammelKommuneCombo[1]["HusholdningId"]
      newKommune["husHoldningsType"] = gammelKommuneCombo[1]["husHoldningsType"]
      newKommune["aar"] = gammelKommuneCombo[1]["aar"]
      //console.log(gammelKommuneCombo[0]["newKommune"])
      //console.log(gammelKommuneCombo.slice(1, gammelKommuneCombo.length))
      //console.log(gammelKommuneCombo[1].bruttoInntekt)
      let test =gammelKommuneCombo.slice(1, gammelKommuneCombo.length)
      newKommune["bruttoAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length).reduce((total, next) => total + next.bruttoInntekt,0) / gammelKommuneCombo.length -1);
      newKommune["nettAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length).reduce((total, next) => total + next.nettoInntekt,0) / gammelKommuneCombo.length -1);
      newKommune["antAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length).reduce((total, next) => total + next.antallHusholdninger,0) / gammelKommuneCombo.length - 1);
      newKommuner.push(newKommune)
    }
  })
  //console.log(testList) 
  
  /* let nyVerdi = innteker.filter(function(currentElementer){
      KommuneReformen.map()
      if(currentElementer["navn"]===KommuneReformen[0].GammelKommune.split(",")[0]){
          return true
      }
  })
  console.log(nyVerdi) */
  let result = _.unionBy(newKommuner,inntekter,"navn")
  fs.writeFileSync('./data2.json', JSON.stringify(result, null, 2), 'utf-8');
}
SammenSlaaing()
/* console.log(tomtArray) */
/*
- SKIPPE PUNKTUM - GJORT
- FINNE RIKTIG VERDIER - GJORT
- Lage if setning for å sjekke om veriden ALLEREDE finnes DONE

- INTEGRERE SAMMENSLÅING AV KOMMUNER
- BUG TESTE / TESTE SÅ VI KAN SKRIVE I RAPPORT
- INNSERTE INN I DB
*/


/*objectArray.map((pos)=>{
        if(pos["navn"]===testLinje[0].replaceAll('"', "").split(" ")[1] && pos["aar"]===testLinje[3].replaceAll('"', "")){
        if (testLinje[2].replaceAll('"', "") ==="Samlet inntekt, median (kr)") {
            pos["bruttoInntekt"] = testLinje[4];
            return;
          } else if (testLinje[2].replaceAll('"', "") ==="Inntekt etter skatt, median (kr)") {
            pos["nettoInntekt"] = testLinje[4];
            return;
          } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
            pos["AntallHusholdninger"] = testLinje[4];
            return;
          }
        }
      })
      /* objectArray.filter((data)=>data["navn"]=== testLinje[0].replaceAll('"', "").split(" ")[1]).filter((data) => data.aar === testLinje[3].replaceAll('"', "")).map((pos) => {
          if (testLinje[2].replaceAll('"', "") ==="Samlet inntekt, median (kr)") {
            pos["bruttoInntekt"] = testLinje[4];
          } else if (testLinje[2].replaceAll('"', "") ==="Inntekt etter skatt, median (kr)") {
            pos["nettoInntekt"] = testLinje[4];
          } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
            pos["AntallHusholdninger"] = testLinje[4];
          }
        }); 
    }*/