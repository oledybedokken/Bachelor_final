const fs = require("fs");
const db = require("../db");


"3001 Halden";
"0000 Alle husholdninger";
"Samlet inntekt, median (kr)";
"2020";616000
let testObject =[{
    navn:"Halden",
    hid:0000,
    hNavn:"Alle Husholdniger",
    bruttoInntekt:616000,
    år:2020,  
}]
const tomtArray =[]
function LeseData(){
    const response = fs.readFileSync("./incomes2.txt", "utf8");
    let info = response.split(/\r?\n/);
    let navn = "navn"
    info.slice(1).map((linje)=>{
        if(linje[linje.length-1]!=="."){
            let createObject ={}
            let testLinje = linje.split(";")
            if(tomtArray.length>0){
                tomtArray.filter(data=>data.navn===navn)
            }
            
            /* const checkNavn = obj => obj.navn === testLinje[0].replaceAll('"','').split(" ")[1];
            console.log(tomtArray.some(checkNavn)) */
            createObject[navn] = testLinje[0].replaceAll('"','').split(" ")[1];
            createObject["kommuneNr"] = testLinje[0].replaceAll('"','').split(" ")[0];
            createObject["HusholdningId"] = testLinje[1].replaceAll('"', '').split(" ")[0];
            createObject["aar"] = testLinje[3].replaceAll('"', '');
            let husarray = testLinje[1].split(/\s(.+)/)[0]
            createObject["Husholdningtype"] = testLinje[1].split(/\s(.+)/)[1].replaceAll('"', '');
            let errorHandling = false
            if(testLinje[2].replaceAll('"','')==="Samlet inntekt, median (kr)"){
                createObject["bruttoInntekt"] = testLinje[4];
            }
            else if (testLinje[2].replaceAll('"','')==="Inntekt etter skatt, median (kr)"){
                createObject["nettoInntekt"] = testLinje[4];
            }
            else if(testLinje[2].replaceAll('"','')==="Antall husholdninger"){
                createObject["AntallHusholdninger"] = testLinje[4];
            }
            else{
                errorHandling = true
            }
            if(errorHandling===false){
                tomtArray.push(createObject)
            }
        }
    })
    return info.slice(1)[0]
}
LeseData()
console.log(tomtArray)
/*
- SKIPPE PUNKTUM - GJORT
- FINNE RIKTIG VERDIER - GJORT

- Lage if setning for å sjekke om veriden ALLEREDE finnes

- INTEGRERE SAMMENSLÅING AV KOMMUNER
- BUG TESTE / TESTE SÅ VI KAN SKRIVE I RAPPORT
- INNSERTE INN I DB
*/