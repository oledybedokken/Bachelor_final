const JSONstat = require("jsonstat-toolkit");
var url="https://data.ssb.no/api/v0/dataset/49678.json?lang=no";
function test(){
    return JSONstat(url).then(main);
}
async function main(j){
    var ds=j.Dataset(0);
    let verdi = ds.Dimension( 0 ).id
    let array = ds.toTable( { type : "arrobj",meta:false } ,function( d ){
        if ( d.value!==null){
           return d;
        }
     })
     console.log(verdi)
    }
test()