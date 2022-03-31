const JSONstat = require("jsonstat-toolkit");
const fs = require("fs")
const fetch = require("node-fetch")
const _ = require("lodash");
var url="https://data.ssb.no/api/v0/dataset/49678.json?lang=no";
const sammenSlaaing = require("../sammenSlaaing.js");
function test(){
    return JSONstat(url).then(main);
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function main(j){
    const kommuner = await fetch("https://ws.geonorge.no/kommuneinfo/v1/kommuner").then(response => response.json()).then(data => { return data });
    var ds=j.Dataset(0);
    let array = ds.toTable( { type : "arrobj" } ,function( d ){
        if ( d.value!==null){
           return d;
        }
     })
     fs.writeFileSync('./data2.json', JSON.stringify(array, null, 2), 'utf-8');
    let test=array
    let test2 = []
    test.map((lol)=>{
        const arr = lol.Region.split(" ")
        if(arr.length>1){
            if(arr[arr.length-1].charAt(arr[arr.length-1].length - 1)===")"){
                test2.push(arr)
                if(arr.slice(0, -1)[arr.slice(0, -1).length-1][0]==="(" ){
                    if(arr.slice(0, -2)[1] ==="-"|| arr.slice(0, -2)[arr.slice(0, -2).length-2]==="-"){
                        lol["Region"] = KommuneTest(arr.slice(0, -1))
                    } 
                    else{
                        lol["Region"] = arr.slice(0, -2).join(" ")
                    }  
                }
                else{
                    if(arr.slice(0, -1)[1] ==="-"|| arr.slice(0, -1)[arr.slice(0, -1).length-2]==="-"){
                        lol["Region"] = KommuneTest(arr.slice(0, -1),kommuner)
                    }
                    else{ lol["Region"] = arr.slice(0, -1).join(" ")}
                }
            }
            else if(arr[1]==="-"){
                lol["Region"] = KommuneTest(arr,kommuner)
            }
            else{
                
                if(arr[arr.length-1]==="kommune"){
                    lol["Region"]=arr[0]
                }
            }
        }
    })
/*     fs.writeFileSync('./data3.json', JSON.stringify(test3, null, 2), 'utf-8');
 */    /* console.log(array.filter(data=>data.value!==null)) */
    let verider = SammenSlaaing(test)
     
    return verider
  }
function SammenSlaaing(alleVerider){
    let display = []
    KommuneReformen.map((kommuneKombo)=>{
        let newKombo = []
        newKombo.push({ "newKommune": kommuneKombo.newKommune,"aarEndring":kommuneKombo.Aar})
        kommuneKombo.GammelKommune.split(",").map((kommune)=>{
            let aktivKommune = kommune.trim()
            alleVerider.filter((verdi)=>verdi.Region===aktivKommune).map((newKommune)=>{
                newKombo.push(newKommune)
            })
        })
        display.push(newKombo)
    })
    let newKommunerSammen = []
    display.map((kommuneArray)=>{
        const uniquesTypes = _.uniq(_.map(kommuneArray.slice(1), 'ContentsCode'));
        const uniquesAar = _.uniq(_.map(kommuneArray.slice(1), 'Tid'));
        const uniquesHusholdType = _.uniq(_.map(kommuneArray.slice(1), 'HusholdType'));
        uniquesTypes.map((Type)=>{
            uniquesAar.map((aar)=>{
                uniquesHusholdType.map((HusHoldTypeAktiv)=>{
                    const object = {}
                    if(parseInt(kommuneArray[0].aarEndring)>parseInt(aar)){
                        let aktivArray=kommuneArray.filter(type=>type.ContentsCode===Type && type.Tid === aar && type.HusholdType===HusHoldTypeAktiv)
                        object["Region"]=kommuneArray[0].newKommune;
                        object["ContentsCode"]=Type
                        object["HusholdType"]=HusHoldTypeAktiv
                        object["Tid"]=aar
                        object["value"]= parseInt(aktivArray.reduce((total,next)=>total+next.value,0)/aktivArray.length)
                        newKommunerSammen.push(object)
                    }                    
                })
            })
        })
    })
    let nyeKommuner = KommuneReformen.map(function(i) {
        let object ={}
        object.newKommune = i.newKommune
        object.aarEndring = i.Aar
        return object;
      });
        let result = [...newKommunerSammen,...alleVerider]
    /* let result = [...newKommuner,...arr] */
     return result
}
function KommuneTest(kommuneArray,kommuner){
    let aktivKommune = null
    kommuneArray.map((kommuneArr)=>{
        if (kommuner.some((kommune) => kommune.kommunenavnNorsk === kommuneArr)) {
            aktivKommune = kommuneArr;
            return
          }
    })
    if(aktivKommune===null){
    for(let i = 0;i<kommuneArray.length;i=i+2){
        for (let y = 0; y < KommuneReformen.length; y++) {
            KommuneReformen[y].GammelKommune.split(",").map((gammelKommune) => {
            let currKommune = gammelKommune.replace(/^\s+/g, '');
            if(currKommune===kommuneArray[i]){
                aktivKommune = kommuneArray[i]
                return
            }
        })
        }
        if(aktivKommune!==null){
            break
        }
    }
}
    return aktivKommune
}
/* test() */
module.exports={test}