const JSONstat = require("jsonstat-toolkit");


var url="https://data.ssb.no/api/v0/dataset/49678.json?lang=no";


function test(){
    return JSONstat(url).then(main);
}
async function main(j){
    var ds=j.Dataset(0);
    let y="Region"
    console.log(ds.Dimsension({ role : "geo" }))
    let array = ds.toTable( { type : "arrobj" } ,function( d ){
        if ( d.value!==null){
            d.regionValue = ds.Dimension(y).Category(d.Region).label
           return d;
        }
     })
} 
test()