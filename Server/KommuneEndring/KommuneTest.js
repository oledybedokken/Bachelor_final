const fs = require("fs");
//let rawData = fs.readFileSync("./testKommune.txt");
let rawData1 = fs.readFileSync("./KommunerNorge.json");
let testFile = JSON.parse(rawData1);
function CreateNewFile(){
    const newArray= []
    testFile.forEach(element=>{
        const currObject = {}
        currObject["newNr"] = element.nyKommuneNr
        currObject["newNavn"] = element.nyKommuneNavn
        const gamle= {}
        element.gammleKommuner.map((element2)=>{
            gamle[element2.gammeltNr]=element2.gammeltNavn
        })
        const newObject= {...currObject,gamle}
        newArray.push(newObject)
    })
    return newArray
}
const array=["1977-1988","1988-1992","1992-1994","1994-2002","2005-2006","2008-2012","2012-2013","2013-2017","2017-2018","2018-2019","2019-2020"]
function AddAar(){
    const alle=[]
    array.map((aar)=>{
        const fileNavn = "./kommuneEndring"+aar+".json";
        let rawData1 = fs.readFileSync(fileNavn);
        let testFile = JSON.parse(rawData1);
        testFile.map((change)=>{
            change["Aar"]=aar.split("-")[1]
        })
        alle.push(testFile)
    })
    return alle
}
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

function FindNewest(value){
    let Newest=value
    let objectForNewest ={}
    testFile.map((merger)=>{
          if (merger.gamle.hasOwnProperty(Newest)){
        objectForNewest=merger
        Newest=merger.newNr
        }
      })
      return objectForNewest
    }
const newArray = AddAar()
//const newArray=testFile["administrative_enheter.kommune"]
console.log(FindNewest("0701"))
//fs.writeFileSync('./kommuneEndringTest.json', JSON.stringify(newArray, null, 2), 'utf-8');
