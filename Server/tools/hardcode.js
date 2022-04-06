const fs = require("fs");
let rawdata = fs.readFileSync("../data2.json");
  let kommuner = JSON.parse(rawdata);
let testarray = []
for (const key in kommuner) {
    if(key.split(" -").length>1){
        testarray.push(`${key}: ${kommuner[key]}`)
    }
}
//console.log(testarray)
let object = {
    "Snåase - Snåsa (-2017)":"Snåsa",
    "Raarvihke - Røyrvik (1923-2017)": "Røyrvik",
    "Fauske - Fuossko": "Fauske",
    "Hamarøy - Hábmer (-2019)": "Hamarøy",
    "Divtasvuodna - Tysfjord (-2019)": "Tysfjord",
    "Evenes - Evenássi": "Evenes",
    "Sortland - Suortá": "Sortland",
    "Harstad - Hárstták (2013-2019)": "Harstad",
    "Loabák - Lavangen (1907-2019)": "Lavangen",
    "Storfjord - Omasvuotna - Omasvuono (1931-2019)": "Stofjord",
    "Gáivuotna - Kåfjord - Kaivuono (1931-2019)": "Kåfjord",
    "Nordreisa - Ráisa - Raisi (-2019)": "Nordreisa",
    "Guovdageaidnu - Kautokeino (-2019)": "Kautokeino",
    "Porsanger - Porsángu - Porsanki (1964-2019)": "Porsanger",
    "Kárásjohka - Karasjok (-2019)": "Karasjok",
    "Deatnu - Tana (-2019)": "Tana",
    "Unjárga - Nesseby (-2019)": "Nesseby",
    "Snåase - Snåsa": "Snåsa",
    "Raarvihke - Røyrvik": "Røyrvik",
    "Loabák - Lavangen": "Lavangen",
    "Storfjord - Omasvuotna - Omasvuono": "Storfjord",
    "Gáivuotna - Kåfjord - Kaivuono": "Kåfjord",
    "Guovdageaidnu - Kautokeino": "Kautokeino",
    "Porsanger - Porsángu - Porsanki ": "Porsanger",
    "Kárásjohka - Karasjok": "Karasjok",
    "Deatnu - Tana": "Tana",
    "Unjárga - Nesseby": "Nesseby"
}
console.log(object);