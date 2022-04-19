const fs = require("fs");
let rawData = fs.readFileSync("./testKommune.txt");
let testFile = JSON.parse(rawData);
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
        gammelKommuneSecondArray.push({"gammeltNr":gammelKommune.split("-")[0],"gammeltNavn":gammelKommune.split("-")[1]})
    })
    nyttObject["gammleKommuner"]=gammelKommuneSecondArray
    nyttArray.push(nyttObject)
})
fs.writeFileSync('./data1.json', JSON.stringify(nyttArray, null, 2), 'utf-8');