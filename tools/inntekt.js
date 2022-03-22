const fs = require("fs");
const db = require("../db");
const sammenSlaaing = require("../sammenSlaaing.js");
function LeseData() {
const objectArray = [];
  const response = fs.readFileSync("./incomes2.txt", "utf8");
  let info = response.split(/\r?\n/);
  //info.slice(1)
  info.slice(1).filter(linje=>linje[linje.length-1] !== ".").map((linje) => {
    //if (linje[linje.length - 1] !== ".") {
      let testLinje = linje.split(";");
      if(objectArray.some(e=>e["navn"]===testLinje[0].replaceAll('"', "").split(" ")[1] && e["aar"]===testLinje[3].replaceAll('"', "")) && objectArray.length>0){
        //if (objectArray.filter((data)=>data["navn"] === testLinje[0].replaceAll('"', "").split(" ")[1]).filter((data) => data.aar === testLinje[3].replaceAll('"', "")) && objectArray.length > 0) {
          //Her finnes både Navn og Året fra før
          for(var i = 0; i<objectArray.length; i++){
            if(objectArray[i]["navn"]===testLinje[0].replaceAll('"', "").split(" ")[1] && objectArray[i]["aar"]===testLinje[3].replaceAll('"', "")){
                if (testLinje[2].replaceAll('"', "") ==="Samlet inntekt, median (kr)") {
                    objectArray[i]["bruttoInntekt"] = testLinje[4];
                    break;
                  } else if (testLinje[2].replaceAll('"', "") ==="Inntekt etter skatt, median (kr)") {
                    objectArray[i]["nettoInntekt"] = testLinje[4];
                    break;
                  } else if (testLinje[2].replaceAll('"', "") === "Antall husholdninger") {
                    objectArray[i]["AntallHusholdninger"] = testLinje[4];
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
  return objectArray;
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
function SammenSlaaing(){
    let innteker = LeseData()
    let newObject = {}
    let average = 0;
    let nyVerdi = innteker.filter(function(currentElementer){
        if(currentElementer===KommuneReformen[0].GammelKommune.split(",")[0]){
            return true
        }
    })
    console.log(nyVerdi)
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
