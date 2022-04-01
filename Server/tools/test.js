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
    var ds=j.Dataset(0);
    let ContentsCode = []
    var dimensionIds =ds.Dimension("ContentsCode").length
    for(let i = 0; i<dimensionIds;i++){
        ContentsCode.push(ds.Dimension("ContentsCode").Category(i).label)
    }
    let times = []
    var dimensionIds =ds.Dimension("Tid").length
    for(let i = 0; i<dimensionIds;i++){
        times.push(ds.Dimension("Tid").Category(i).label)
    }
    let ssbKommuner=Object.entries(ds.__tree__.dimension.Region.category.label).reduce((acc, [key, value]) => (acc[value] = key, acc), {})
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
/*    fs.writeFileSync('./data3.json', JSON.stringify(test3, null, 2), 'utf-8');
 */    /* console.log(array.filter(data=>data.value!==null)) */
   /*  let verider = SammenSlaaing(test) */
     //fs.writeFileSync('./data2.json', JSON.stringify(array, null, 2), 'utf-8');

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