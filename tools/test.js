var GeoJSON = require("geojson");
const fs = require("fs");
const path = "../Assets/kommunelatlong.csv"
function createGeojson() {
    const csv = fs.readFileSync(path, 'utf8');
    const splitByLineSpace = csv.split(/\r?\n/)
  
    const newArray = [];
        splitByLineSpace.forEach(line => {
            const splitLine = line.split(",")
            const properties = {
                kommunenummer: splitLine[0],
                kommuneNavn: splitLine[1],
                Fylke: splitLine[2],
                lat: splitLine[3],
                lng: splitLine[4],
            }
            newArray.push(properties)
        });
    
    console.table(newArray)
    const geoJson = GeoJSON.parse(newArray, {Point: ['lat', 'lng']});
    fs.writeFileSync('./data1.json', JSON.stringify(geoJson, null, 2), 'utf-8');

}
createGeojson();