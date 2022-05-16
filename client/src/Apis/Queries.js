import SourceFinder from "./SourceFinder"
import axios from "axios"; 
export const GetMapSsb = async (obj) => {
    const { data } = await SourceFinder.get("incomejson", {
        params: { url: obj.url, mapFormat: obj.mapformat,regionType:obj.regionType},
    });
    return data;
}
export const updateSources = async()=>{
    const {data} = await SourceFinder.post('sources');
    return data
}
export const updateData = async()=>{
    const {data} = await SourceFinder.post('getAllSourcesWithValues');
    return data
}
export const GetAllSets = async()=>{
    const data=await axios.get(
        "https://data.ssb.no/api/v0/dataset/list.json?lang=no"
    ).then((res) => {
        const kommuneFilter = ["kommuner", "tidsserie"]
        const newArray = []
        const fylkeFilter = ["fylker", "tidsserie"]
        res.data.datasets.forEach((dataset) => {
            const value = kommuneFilter.every(kommuneTidsserie => {
                return dataset.tags.includes(kommuneTidsserie)
            })
            const value1 = fylkeFilter.every(fylkeTidsserie => {
                return dataset.tags.includes(fylkeTidsserie)
            })
            if ((value === true || value1 === true) && dataset.id !== "65962") {
                newArray.push(dataset)
            }
        })
        return (newArray)
    }
    );
    return data;
}
export const updateWeatherData = async()=>{
    const {data} = await SourceFinder.post('getWeatherDataForSource');
    return data
}
export const GetWeatherData =async(queryFunctionContext)=>{
    const queryKey = queryFunctionContext.queryKey
    const { data } = await SourceFinder.get("getWeatherData", {
        params: {dato:queryKey[1].selectedTime[0],element:queryKey[1].selectedElement},
    });
    return data;
}
export const GetDemoData = async()=>{
    const {data} = await SourceFinder.get('testQuery');
    return data;
}
export const GetElements = async()=>{
    const {data} = await SourceFinder.get('elements');
    return data.data.elements;
}