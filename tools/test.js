const JSONstat = require("jsonstat-toolkit");
const fs = require("fs")
const fetch = require("node-fetch")
const _ = require("lodash");
var url="https://data.ssb.no/api/v0/dataset/49678.json?lang=no";
const sammenSlaaing = require("../sammenSlaaing.js");
function test(){
    return JSONstat(url).then(main);
}
function startsWithNumber(str) {
    return /^\d/.test(str);
  }
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function main(j){
    const kommuner = await fetch("https://ws.geonorge.no/kommuneinfo/v1/kommuner").then(response => response.json()).then(data => { return data });
    var ds=j.Dataset(0);
    let ssbKommuner=Object.entries(ds.__tree__.dimension.Region.category.label).reduce((acc, [key, value]) => (acc[value] = parseInt(key), acc), {})
    let array = ds.toTable( { type : "arrobj" } ,function( d ){
        if ( d.value!==null){
            d.RegionNumber = ssbKommuner[d.Region]
           return d;
        }
     });     
    array.map((sted)=>{
        let RegionSplit =sted.Region.split("(")
        sted.Region = RegionSplit[0].trim()
        if(RegionSplit.length>1){
            if(startsWithNumber(RegionSplit[1].split("-")[1])){
                sted.gyldigTil = parseInt(RegionSplit[1].split("-")[1].slice(0,-1));   
            }
            else{
                sted.tilhører=RegionSplit[1].slice(0,-1)
            }
        }
    });
    fs.writeFileSync('./data2.json', JSON.stringify(array, null, 2), 'utf-8');
/*    fs.writeFileSync('./data3.json', JSON.stringify(test3, null, 2), 'utf-8');
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
/* test() */
module.exports={test}