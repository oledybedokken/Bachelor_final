const fs = require("fs");
//fs.writeFileSync('./kommuneEndringTest.json', JSON.stringify(newArray, null, 2), 'utf-8');
const fileNavn = "../waste/FylkeEndringer.json";
let rawData1 = fs.readFileSync(fileNavn);
let testFile = JSON.parse(rawData1);
const newArray =[]
testFile.map((KommuneEndring)=>{
    const newObject = {}
    newObject["newNr"]=KommuneEndring.nyKommune.split("-")[0].trim();
    newObject["newNavn"]=KommuneEndring.nyKommune.split("-")[1].trim()
    const gammelObject = {}
    KommuneEndring.gammelKommune.split(",").map((gammel)=>gammelObject[gammel.split("-")[0].trim()]=gammel.split("-")[1].trim())
    newObject["gamle"]= gammelObject
    newArray.push(newObject)
});
function FindNewest(file, value) {
    let Newest = value
    let objectForNewest = {}
    file.map((merger) => {
        //console.log(merger)
        if (merger.gamle.hasOwnProperty(Newest)) {
            objectForNewest = merger
            Newest = merger.newNr
        }
    })
    return objectForNewest
}
//console.log(FindNewest(newArray,"16"))
//fs.writeFileSync('./FylkeEndringerTest.json', JSON.stringify(newArray, null, 2), 'utf-8');

//console.log(testFile)
/* {
    "newNr": "0701",
    "newNavn": "Borre",
    "gamle": {
      "0703": "Horten",
      "0717": "Borre"
    }
  }, */