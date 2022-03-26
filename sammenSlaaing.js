const fs = require("fs");
function KommuneSammenSlaaing(){
    const response = fs.readFileSync('/Users/oledybedokken/Documents/Prosjekter/Bachelor/Bachelor/Server/Assets/kommuneReformen.csv', 'utf8')
    const newArray = []
    response.split("\n").map((sammenSlaaing,index)=>{
        if(index !== 0){
            const newObject = {}
            let GammelKommune = sammenSlaaing.split('"')[1]
            let nyKommune = sammenSlaaing.split('"')[2].split(",")
            newObject["GammelKommune"] = sammenSlaaing.split('"')[1]
            newObject["newKommune"] = sammenSlaaing.split('"')[2].split(",")[1]
            newObject["newKommuneId"] = sammenSlaaing.split('"')[2].split(",")[2]
            newObject["Aar"] = sammenSlaaing.split('"')[2].split(",")[2].split(/\r/)[0]
             newArray.push(newObject)
        }
    })
    return newArray
}
module.exports={KommuneSammenSlaaing}