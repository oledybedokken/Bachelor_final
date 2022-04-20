const fs = require("fs");
//let rawData = fs.readFileSync("./testKommune.txt");
let rawData1 = fs.readFileSync("../Assets/Basisdata_0000_Norge_3035_Kommuner_GeoJSON.geojson");
let testFile = JSON.parse(rawData1);

function newEndring(){
    let nyKommueKey = Object.keys(testFile[0])[0]
let gammelKommuneKey = Object.keys(testFile[0])[1]
const nyttArray = []
testFile.map((endring)=>{
    const nyttObject = {
        "nyKommuneNavn":endring[nyKommueKey].split("-")[1].trim(),
        "nyKommuneNr":endring[nyKommueKey].split("-")[0].trim(),
    }
    const gammelKommuneSecondArray = []
    const gammleKommunerArray =endring[gammelKommuneKey].split(",");
    gammleKommunerArray.map((gammelKommune)=>{
        gammelKommune.split("-")
        gammelKommuneSecondArray.push({"gammeltNr":gammelKommune.split("-")[0].trim(),"gammeltNavn":gammelKommune.split("-")[1].trim()})
    })
    nyttObject["gammleKommuner"]=gammelKommuneSecondArray
    nyttArray.push(nyttObject)
})}

const newArray=testFile["administrative_enheter.kommune"]
fs.writeFileSync('./KommunerNorge.geojson', JSON.stringify(newArray, null, 2), 'utf-8');
