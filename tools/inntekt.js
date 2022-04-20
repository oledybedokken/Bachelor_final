const fs = require("fs");
const db = require("../db");
const sammenSlaaing = require("../sammenSlaaing.js");
const fetch = require("node-fetch");
const _ = require("lodash");
const { result } = require("lodash");

const objectArray = [];
function LeseData(kommuner) {
  const response = fs.readFileSync("/Users/oledybedokken/Documents/Prosjekter/Bachelor/Bachelor/Server/tools/incomes2.txt", "utf8");
  let info = response.split(/\r?\n/);
  //info.slice(1)
  console.time("StartTime")
  let start = 0
  //.filter(linje => (linje.split(";")[0].replaceAll('"', "").split(" ")[1] ==="Moss" || linje.split(";")[0].replaceAll('"', "").split(" ")[1] ==="Rygge"))
  let lengde = info.slice(1).filter(linje => linje[linje.length - 1] !== ".").length
  info.slice(1).filter(linje => linje[linje.length - 1] !== ".").map((linje,index) => {
    let testLinje = linje.split(";");
    //HEr må noe legges til
    if (objectArray.some(data =>(data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1] || data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[3]) && data["aar"] === parseInt(testLinje[3].replaceAll('"', "")) && data["husHoldningType"] === testLinje[1].split(/\s(.+)/)[1].replaceAll('"', ""))) {
      //if (objectArray.filter((data)=>data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1]).filter((data) => data.aar === testLinje[3].replaceAll('"', "")).filter((data)=>data.Husholdningtype===testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "")).length > 0 && objectArray.length > 0) {
      //Her finnes både Navn og Året fra før
      for (var i = 0; i < objectArray.length; i++) {
        if ((objectArray[i]["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1] || objectArray[i]["navn"] === testLinje[0].replaceAll('"', "").split(" ")[3]) && objectArray[i]["aar"] === parseInt(testLinje[3].replaceAll('"', "")) && objectArray[i]["husHoldningType"] === testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "")) {
          if (testLinje[2].replaceAll('"', "") === "Samlet inntekt, median (kr)") {
            objectArray[i]["bruttoInntekt"] = parseInt(testLinje[4]);
            break;
          } else if (testLinje[2].replaceAll('"', "") === "Inntekt etter skatt, median (kr)") {
            objectArray[i]["nettoInntekt"] = parseInt(testLinje[4]);
            break;
          } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
            objectArray[i]["antallHusholdninger"] = parseInt(testLinje[4]);
            break;
          }
        }
      }
    }
    else {
      let createObject = {};
      let firstNameSplit = testLinje[0].replaceAll('"', "").split(" ")
      if (firstNameSplit.length > 3) {
        //createObject["navn"] = firstNameSplit[1].substring(0, testLinje[0].replaceAll('"', "").split(/\s(.+)/)[1].lastIndexOf(" ") + 1).replaceAll(" ","")
        /* [ '1736', 'Snåase', '-', 'Snåsa', '(-2017)' ]
        [ '1841', 'Fauske', '-', 'Fuossko' ] */
        if (firstNameSplit[2] === "-") {
          if (kommuner.some((kommune) => kommune.kommunenavnNorsk === firstNameSplit[1])) {
            createObject["navn"] = firstNameSplit[1];
          }
          else if (kommuner.some((kommune) => kommune.kommunenavnNorsk === firstNameSplit[3])) {
            createObject["navn"] = firstNameSplit[3];
          }
          else {
            let funnet = false
            for (let i = 0; i < KommuneReformen.length; i++) {
              KommuneReformen[i].GammelKommune.split(",").map((gammelKommune) => {
                let currKommune = gammelKommune.replace(/^\s+/g, '');
                if (currKommune === firstNameSplit[1]) {
                  createObject["navn"] = firstNameSplit[1];
                  funnet = true
                  return
                }
                else if (currKommune === firstNameSplit[3]) {
                  createObject["navn"] = firstNameSplit[3];
                  funnet = true
                  return
                }
                else{
                  createObject["navn"] = "none"
                }
              })
              if (funnet === true) {
                break;
              }
            }
          }
        }
        else{
          createObject["navn"] = firstNameSplit[1];
        }
      }
      else if (firstNameSplit.length <= 3) {
        createObject["navn"] = firstNameSplit[1]
      }
      createObject["kommuneNr"] = testLinje[0].replaceAll('"', "").split(" ")[0];
      createObject["husHoldningId"] = testLinje[1].replaceAll('"', "").split(" ")[0];
      createObject["aar"] = parseInt(testLinje[3].replaceAll('"', ""));
      createObject["husHoldningType"] = testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "");
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
    if((index/lengde*100)%5===0){
      console.log(Math.floor((index/lengde*100)))
    }
  });
  console.timeEnd("StartTime")
/*   fs.writeFileSync('./Assets/data.json', JSON.stringify(objectArray, null, 2), 'utf-8');
 */  return objectArray;
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function inntektUpdate() {
const kommuner = await fetch("https://ws.geonorge.no/kommuneinfo/v1/kommuner").then(response => response.json()).then(data => { return data });
let student = fs.readFileSync('./Assets/data.json',JSON.stringify(), 'utf-8')
  let inntekter = JSON.parse(student);
  /* let inntekter = LeseData(kommuner) */
  let newObject = {}
  let testList = [];
  KommuneReformen.map((sammenSlaaing) => {
    let gammleKommuner = sammenSlaaing.GammelKommune.split(",");
    let currentKommune = []
    let newKommuneopti = sammenSlaaing.newKommune.replaceAll(" ","")
    gammleKommuner.map((GammelKommune) => {
      currentKommune.push({ "newKommune": sammenSlaaing.newKommune, "newKommuneNr": sammenSlaaing.newKommuneId })
      /* if(sammenSlaaing.newKommuneId==="3030"){
        console.log(currentKommune)
      } */
      let kommuneNavn = GammelKommune.replaceAll(" ", "")
      if (inntekter.filter(obj => obj["navn"] === kommuneNavn).length > 1) {
        inntekter.filter(obj => obj["navn"] === kommuneNavn).map((kommuneStat)=>
        {
          currentKommune.push(kommuneStat)
        })
      }
    })
    testList.push(currentKommune)
  })
  newKommuner = []
  testList.map((gammelKommuneCombo) => {
    if (gammelKommuneCombo.length > 1) {
      let allYears=gammelKommuneCombo.filter((a, i) => gammelKommuneCombo.findIndex((s) => a.aar === s.aar) === i)
      let allHoldninger =gammelKommuneCombo.filter((a, i) => gammelKommuneCombo.findIndex((s) => a.husHoldningType === s.husHoldningType) === i)
      allYears.slice(1,allYears.length).map((year)=>{
        allHoldninger.slice(1,allHoldninger.length).map((holdningsType)=>{
          let statisStikk = {}
          if(year.aar>2019){
            return
          }
          else{
          statisStikk["navn"] = gammelKommuneCombo[0]["newKommune"]
          statisStikk["kommuneNr"] = gammelKommuneCombo[0]["newKommuneNr"]
          statisStikk["husHoldningId"] = holdningsType.husHoldningId
          statisStikk["husHoldningType"] = holdningsType.husHoldningType
          statisStikk["aar"] = year.aar
          let stats = gammelKommuneCombo.filter((kommune)=>kommune.aar ===year.aar && kommune.husHoldningType === holdningsType.husHoldningType)
          statisStikk["bruttoInntekt"]=parseInt(stats.reduce((total,next)=>total + next.bruttoInntekt,0)/stats.length)
          statisStikk["nettoInntekt"]=parseInt(stats.reduce((total,next)=>total + next.nettoInntekt,0)/stats.length)
          statisStikk["antallHusholdninger"]=parseInt(stats.reduce((total,next)=>total + next.antallHusholdninger,0)/stats.length)
          newKommuner.push(statisStikk)
          }
        })
      })
      /* newKommune["navn"] = gammelKommuneCombo[0]["newKommune"]
      newKommune["KommuneNr"] = gammelKommuneCombo[0]["newKommuneNr"]
      newKommune["husholdningId"] = gammelKommuneCombo[1]["HusholdningId"]
      newKommune["husHoldningsType"] = gammelKommuneCombo[1]["husHoldningsType"]
      newKommune["aar"] = gammelKommuneCombo[1]["aar"]
      let test = gammelKommuneCombo.slice(1, gammelKommuneCombo.length)
      newKommune["bruttoAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length)[0].reduce((total, next) => total + next.bruttoInntekt, 0) / gammelKommuneCombo.length - 1);
      newKommune["nettAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length)[0].reduce((total, next) => total + next.nettoInntekt, 0) / gammelKommuneCombo.length - 1);
      newKommune["antAvg"] = parseInt(gammelKommuneCombo.slice(1, gammelKommuneCombo.length)[0].reduce((total, next) => total + next.antallHusholdninger, 0) / gammelKommuneCombo.length - 1); */
    }
  })
  //console.log(newKommuner)
  //console.log(testList) 

  /* let nyVerdi = innteker.filter(function(currentElementer){
      KommuneReformen.map()
      if(currentElementer["navn"]===KommuneReformen[0].GammelKommune.split(",")[0]){
          return true
      }
  })
  console.log(nyVerdi) */
  //let result = _.unionBy(newKommune, inntekter)
  let nyeKommuner = KommuneReformen.map(function(i) {
  return i.newKommune;
});
  const arr = inntekter.filter(i => !nyeKommuner.includes(i.navn))
  let result = [...newKommuner,...arr]
  /* fs.writeFileSync('./data2.json', JSON.stringify(result, null, 2), 'utf-8'); */
  return result 
}
/* inntektUpdate() */
module.exports={inntektUpdate}


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