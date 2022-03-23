const fs = require("fs");
const db = require("../db");
const sammenSlaaing = require("../sammenSlaaing.js");

const objectArray = [];
function LeseData() {
  const response = fs.readFileSync("./incomes2.txt", "utf8");
  let info = response.split(/\r?\n/);
  //info.slice(1)
  console.time("StartTime")
  let start = 0
  let newLinke = info.slice(1).filter(linje=>linje[linje.length-1] !== ".")
  info.slice(1).filter(linje=>linje[linje.length-1] !== ".").map((linje) => {
    //if (linje[linje.length - 1] !== ".") {
      let testLinje = linje.split(";");
        if (objectArray.filter((data)=>data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1]).filter((data) => data.aar === testLinje[3].replaceAll('"', "")).filter((data)=>data.Husholdningtype===testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "")).length > 0 && objectArray.length > 0) {
          //Her finnes både Navn og Året fra før
          for(var i = start; i<objectArray.length; i++){
            if(objectArray[i]["navn"]===testLinje[0].replaceAll('"', "").split(" ")[1] && objectArray[i]["aar"]===testLinje[3].replaceAll('"', "")){
                if (testLinje[2].replaceAll('"', "") ==="Samlet inntekt, median (kr)") {
                    objectArray[i]["bruttoInntekt"] = testLinje[4];
                    start = i
                    break;
                  } else if (testLinje[2].replaceAll('"', "") ==="Inntekt etter skatt, median (kr)") {
                    objectArray[i]["nettoInntekt"] = testLinje[4];
                    start = i
                    break;
                  } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
                    objectArray[i]["AntallHusholdninger"] = testLinje[4];
                    start = i
                    break;
                  }
                }
          }
        }
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
    else {
          let createObject = {};
          createObject["navn"] = testLinje[0].replaceAll('"', "").split(" ")[1];
          createObject["kommuneNr"] = testLinje[0].replaceAll('"', "").split(" ")[0];
          createObject["HusholdningId"] = testLinje[1].replaceAll('"', "").split(" ")[0];
          createObject["aar"] = testLinje[3].replaceAll('"', "");
          let husarray = testLinje[1].split(/\s(.+)/)[0];
          createObject["Husholdningtype"] = testLinje[1].split(/\s(.+)/)[1].replaceAll('"', "");
          let errorHandling = false;
          if (testLinje[2].replaceAll('"', "") === "Samlet inntekt, median (kr)") {
            createObject["bruttoInntekt"] = testLinje[4];
          } else if (testLinje[2].replaceAll('"', "") ==="Inntekt etter skatt, median (kr)") {
            createObject["nettoInntekt"] = testLinje[4];
          } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
            createObject["AntallHusholdninger"] = testLinje[4];
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
    fs.writeFileSync('./data.json', JSON.stringify(objectArray, null, 2) , 'utf-8');
  return objectArray;
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
function SammenSlaaing(){
    let inntekter = LeseData()
   /*  let newObject = {}
    let average = 0;
    let testList = [];
    KommuneReformen.map((sammenSlaaing)=>{
        let gammleKommuner = sammenSlaaing.GammelKommune.split(",")
        gammleKommuner.map((GammelKommune)=>{
            if(inntekter.filter(obj => obj["navn"]===GammelKommune).length>0){
            testList.push(inntekter.filter(obj => obj["navn"]===GammelKommune))
            }
        })   
    })
    console.log(testList) */
    /* let nyVerdi = innteker.filter(function(currentElementer){
        KommuneReformen.map()
        if(currentElementer["navn"]===KommuneReformen[0].GammelKommune.split(",")[0]){
            return true
        }
    })
    console.log(nyVerdi) */
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
