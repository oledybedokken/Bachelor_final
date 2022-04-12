const JSONstat = require("jsonstat-toolkit");
const fs = require("fs");
const fetch = require("node-fetch");
const _ = require("lodash");
const sammenSlaaing = require("../sammenSlaaing.js");
let ssbObject = {
  "Snåase - Snåsa (-2017)": "Snåsa",
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
  "Unjárga - Nesseby": "Nesseby",
  "Oslo kommune": "Oslo",
};
const nrBytte = {
  101: 3001,
  105: 3003,
  106: 3004,
  111: 3011,
  118: 3012,
  119: 3013,
  127: 3015,
  128: 3016,
  135: 3017,
  137: 3018,
  211: 3019,
  214: 3021,
  215: 3022,
  216: 3023,
  219: 3024,
  220: 3025,
  228: 3027,
  229: 3028,
  230: 3029,
  233: 3031,
  234: 3032,
  235: 3033,
  236: 3034,
  237: 3035,
  238: 3036,
  239: 3037,
  301: 301,
  402: 3401,
  403: 3403,
  412: 3411,
  415: 3412,
  417: 3413,
  418: 3414,
  419: 3415,
  420: 3416,
  423: 3417,
  425: 3418,
  426: 3419,
  427: 3420,
  428: 3421,
  429: 3422,
  430: 3423,
  432: 3424,
  434: 3425,
  436: 3426,
  437: 3427,
  438: 3428,
  439: 3429,
  441: 3430,
  501: 3405,
  502: 3407,
  511: 3431,
  512: 3432,
  513: 3433,
  514: 3434,
  515: 3435,
  516: 3436,
  517: 3437,
  519: 3438,
  520: 3439,
  521: 3440,
  522: 3441,
  528: 3442,
  529: 3443,
  532: 3053,
  533: 3054,
  534: 3446,
  536: 3447,
  538: 3448,
  540: 3449,
  541: 3450,
  542: 3451,
  543: 3452,
  544: 3453,
  545: 3454,
  604: 3006,
  605: 3007,
  612: 3038,
  615: 3039,
  616: 3040,
  617: 3041,
  618: 3042,
  619: 3043,
  620: 3044,
  621: 3045,
  622: 3046,
  623: 3047,
  624: 3048,
  626: 3049,
  627: 3025,
  628: 3025,
  631: 3050,
  632: 3051,
  633: 3052,
  701: 3801,
  704: 3803,
  710: 3804,
  712: 3805,
  716: 3803,
  729: 3811,
  805: 3806,
  806: 3807,
  807: 3808,
  811: 3812,
  814: 3813,
  815: 3814,
  817: 3815,
  819: 3816,
  826: 3818,
  827: 3819,
  828: 3820,
  829: 3821,
  830: 3822,
  831: 3823,
  833: 3824,
  834: 3825,
  901: 4201,
  904: 4202,
  906: 4203,
  911: 4211,
  912: 4212,
  914: 4213,
  919: 4214,
  926: 4215,
  928: 4216,
  929: 4217,
  935: 4218,
  937: 4219,
  938: 4220,
  940: 4221,
  941: 4222,
  1003: 4206,
  1004: 4207,
  1014: 4223,
  1026: 4224,
  1034: 4226,
  1037: 4227,
  1046: 4228,
  1101: 1101,
  1102: 1108,
  1106: 1106,
  1111: 1111,
  1112: 1112,
  1114: 1114,
  1119: 1119,
  1120: 1120,
  1121: 1121,
  1122: 1122,
  1124: 1124,
  1127: 1127,
  1129: 1108,
  1130: 1130,
  1133: 1133,
  1134: 1134,
  1135: 1135,
  1144: 1144,
  1145: 1145,
  1146: 1146,
  1149: 1149,
  1151: 1151,
  1160: 1160,
  1201: 4601,
  1211: 4611,
  1216: 4612,
  1219: 4613,
  1221: 4614,
  1222: 4615,
  1223: 4616,
  1224: 4617,
  1232: 4619,
  1233: 4620,
  1238: 4622,
  1242: 4623,
  1244: 4625,
  1247: 4627,
  1251: 4628,
  1252: 4629,
  1253: 4630,
  1256: 4631,
  1260: 4631,
  1263: 4631,
  1264: 4632,
  1265: 4633,
  1266: 4634,
  1401: 4602,
  1411: 4635,
  1412: 4636,
  1413: 4637,
  1416: 4638,
  1417: 4639,
  1421: 4641,
  1422: 4642,
  1424: 4643,
  1426: 4644,
  1428: 4645,
  1429: 4646,
  1438: 4648,
  1439: 4602,
  1441: 4649,
  1443: 4649,
  1445: 4650,
  1449: 4651,
  1505: 1505,
  1511: 1511,
  1514: 1514,
  1516: 1516,
  1517: 1517,
  1520: 1520,
  1524: 1578,
  1525: 1525,
  1526: 1578,
  1528: 1528,
  1531: 1531,
  1532: 1532,
  1535: 1535,
  1539: 1539,
  1547: 1547,
  1729: 5053,
  1554: 1554,
  1557: 1557,
  1560: 1560,
  1563: 1563,
  1566: 1566,
  1573: 1573,
  1576: 1576,
  1804: 1804,
  1811: 1811,
  1812: 1812,
  1813: 1813,
  1815: 1815,
  1816: 1816,
  1818: 1818,
  1820: 1820,
  1822: 1822,
  1824: 1824,
  1825: 1825,
  1826: 1826,
  1827: 1827,
  1828: 1828,
  1832: 1832,
  1833: 1833,
  1834: 1834,
  1835: 1835,
  1836: 1836,
  1837: 1837,
  1838: 1838,
  1839: 1839,
  1840: 1840,
  1841: 1841,
  1845: 1845,
  1848: 1848,
  1851: 1851,
  1853: 1853,
  1856: 1856,
  1857: 1857,
  1859: 1859,
  1860: 1860,
  1865: 1865,
  1866: 1866,
  1867: 1867,
  1567: 5061,
  1868: 1868,
  1870: 1870,
  1871: 1871,
  1874: 1874,
  1902: 5401,
  1903: 5402,
  1911: 5411,
  1917: 5413,
  1919: 5414,
  1920: 5415,
  1922: 5416,
  1923: 5417,
  1924: 5418,
  1925: 5419,
  1926: 5420,
  1933: 5422,
  1936: 5423,
  1938: 5424,
  1939: 5425,
  1940: 5426,
  1941: 5427,
  1942: 5428,
  1943: 5429,
  2002: 5404,
  2003: 5405,
  2011: 5430,
  2012: 5403,
  2014: 5432,
  2015: 5433,
  2018: 5434,
  2019: 5435,
  2020: 5436,
  2021: 5437,
  2022: 5438,
  2023: 5439,
  2024: 5440,
  2025: 5441,
  2027: 5442,
  2028: 5443,
  2030: 5444,
  5013: 5056,
  5014: 5014,
  5020: 5020,
  5021: 5021,
  5022: 5022,
  5049: 5049,
  1634: 5021,
  1635: 5022,
  1653: 5028,
  1640: 5025,
  1662: 5030,
  1702: 5004,
  1620: 5014,
  1633: 5020,
  1634: 5021,
  1635: 5022,
  1640: 5025,
  1644: 5026,
  1648: 5027,
  1653: 5028,
  1657: 5029,
  1663: 5031,
  1664: 5032,
  1665: 5033,
  1711: 5034,
  1714: 5035,
  1717: 5036,
  1719: 5037,
  1721: 5038,
  1736: 5041,
  1738: 5042,
  1739: 5043,
  1740: 5044,
  1742: 5045,
  1743: 5046,
  1744: 5047,
  1749: 5049,
  1755: 5052,
  1756: 5053,
  1612: 5011,
  1617: 5056,
  5013: 5056,
  1621: 5015,
  1627: 5017,
  1630: 5018,
  1632: 5019,
  1622: 5016,
  1636: 5023,
  1638: 5024,
  1750: 5050,
  1751: 5051,
  1724: 5039,
  1725: 5040,
  1601: 5001,
  1519: 1577,
  1613: 5012,
  1748: 5048,
  1703: 5005,
  1448: 4651
};
function fetchData(url) {
  return JSONstat(url).then(main);
}
function startsWithNumber(str) {
  return /^\d/.test(str);
}
const KommuneReformen = sammenSlaaing.KommuneSammenSlaaing();
async function main(j) {
  var ds = j.Dataset(0);
  let ContentsCodes = [];
  let variabler = ds.id.filter((item) => {
    return item !== "Region" && item !== "ContentsCode" && item !== "Tid";
  });
  
  var dimensionIds = ds.Dimension("ContentsCode").length;
  for (let i = 0; i < dimensionIds; i++) {
    ContentsCodes.push(ds.Dimension("ContentsCode").Category(i).label);
  }
  let brukerVariabler = [];
  var dimensionIds = ds.Dimension("Tid").length;
  if (variabler.length > 0) {
    variabler.map((variabel)=>{
        var dimensionIds = ds.Dimension(variabel).length;
        let variableObject ={
          id:variabel,
          options:[]
        }
        for (let i = 0; i < dimensionIds; i++) {variableObject.options.push(ds.Dimension(variabel).Category(i).label)}
        brukerVariabler.push(variableObject)
    })
  }
  let ssbKommuner = Object.entries(
    ds.__tree__.dimension.Region.category.label
  ).reduce((acc, [key, value]) => ((acc[value] = key), acc), {});

  let array = ds.toTable({ type: "arrobj" }, function (d) {
    if (d.value !== null) {
      d.RegionNumber = ssbKommuner[d.Region];
      if (d.RegionNumber[0] === "K") {
        d.RegionNumber = d.RegionNumber.slice(2);
      }
      d.RegionNumber = parseInt(d.RegionNumber);
      if (d.RegionNumber in nrBytte) {
        d.RegionNumber = nrBytte[d.RegionNumber];
      }
      if (d.RegionNumber === 706) {
        d.RegionNumber = 3804;
      }
      if(d.RegionNumber===1448){
        console.log(d.value)
      }
      let RegionSplit = d.Region.split("(");
      if (d.Region in ssbObject) {
        d.Region = ssbObject[d.Region];
      } else {
        d.Region = RegionSplit[0].trim();
      }
      if (RegionSplit.length > 1) {
        if (startsWithNumber(RegionSplit[1].split("-")[1])) {
          d.gyldigTil = parseInt(RegionSplit[1].split("-")[1].slice(0, -1));
        } else {
          d.tilhører = RegionSplit[1].slice(0, -1);
        }
      }
      return d;
    }
  });
  return array;

}
//objectCreator()
module.exports = { fetchData };

function objectCreator() {
  let kommuner2017Raw = fs.readFileSync("./tools/Kommuner/kommuner17wgs.json");
  let kommuner2017 = JSON.parse(kommuner2017Raw);
  let kommuner2018Raw = fs.readFileSync("./tools/Kommuner/kommuner18wgs.json");
  let kommuner2018 = JSON.parse(kommuner2018Raw);
  let kommuner2019Raw = fs.readFileSync("./tools/Kommuner/kommuner19wgs.json");
  let kommuner2019 = JSON.parse(kommuner2019Raw);
  let gamleKommuner = [];
  KommuneReformen.slice(1).map((reform) => {
    reform.GammelKommune.split(",").map((gammelKommune) => {
      let gammelKommuneverdi = null;
      if (parseInt(reform.Aar) - 1 === 2017) {
        gammelKommuneverdi = kommuner2017.features.find(
          (e) => gammelKommune.trim() === e.properties.kommunenavn
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenavn,
          kommunenummer: parseInt(gammelKommuneverdi.properties.kommunenr),
        };
        gamleKommuner.push(gammelKommuneverdi);
      } else if (parseInt(reform.Aar) - 1 === 2018) {
        gammelKommuneverdi = kommuner2018.features.find(
          (e) => gammelKommune.trim() === e.properties.Kommunenav
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenav,
          kommunenummer: gammelKommuneverdi.properties.Kommunenum,
        };
        gamleKommuner.push(gammelKommuneverdi);
      } else {
        gammelKommuneverdi = kommuner2019.features.find(
          (e) => gammelKommune.trim() === e.properties.kommunenavn
        );
        gammelKommuneverdi.properties = {
          navn: gammelKommuneverdi.properties.kommunenavn,
          kommunenummer: parseInt(gammelKommuneverdi.properties.kommunenummer),
        };
        gamleKommuner.push(gammelKommuneverdi);
      }
    });
  });
  fs.writeFileSync(
    "./data4.json",
    JSON.stringify(gamleKommuner, null, 2),
    "utf-8"
  );
}

/*if (variabler.length > 0) {
  for (const key in ssbKommuner) {
    brukerVariabler[0].options.map((item)=>{
      brukerVariabler[1].options.map((item2)=>{
        if(ssbKommuner[key][0]==="K"){
          ssbKommuner[key]=ssbKommuner[key].slice(2)
        }
          let currArray = array.filter((currData)=>parseInt(ssbKommuner[key]) === currData.RegionNumber&&currData[brukerVariabler[0].id] === item&&currData[brukerVariabler[1].id]===item2);
        })
      })
    brukerVariabler[variabler[0]].map((type) => {
      const currVariable = variabler[0];
      if(ssbKommuner[key][0]==="K"){
        ssbKommuner[key]=ssbKommuner[key].slice(2)
      }
      let currArray = array.filter((currData)=>parseInt(ssbKommuner[key]) === currData.RegionNumber&&currData[currVariable] === type);
      if (currArray.length > 0) {
        const newObject = {
          RegionNumber: currArray[0].RegionNumber,
          Region: currArray[0].Region,
          [currVariable]: currArray[0][currVariable],
        };
        currArray.map((data) => {
          if (newObject[data.ContentsCode]) {
            newObject[data.ContentsCode][data.Tid] = data.value;
          } else {
            newObject[data.ContentsCode] = {};
            newObject[data.ContentsCode][data.Tid] = data.value;
          }
        });
        newArray.push(newObject);
      }
    });
  }
} else {
  for (const key in ssbKommuner) {
    let currArray = array.filter(
      (currData) => parseInt(ssbKommuner[key]) === currData.RegionNumber
    );
    if (currArray.length > 0) {
      const newObject = {
        RegionNumber: currArray[0].RegionNumber,
        Region: currArray[0].Region,
      };
      currArray.map((data) => {
        if (newObject[data.ContentsCode]) {
          newObject[data.ContentsCode][data.Tid] = data.value;
        } else {
          newObject[data.ContentsCode] = {};
          newObject[data.ContentsCode][data.Tid] = data.value;
        }
      });
      newArray.push(newObject);
    }
  }
}*/
/* function SammenSlaaing(alleVerider){
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
    let result = [...newKommuner,...arr] 
     return result
    } */
