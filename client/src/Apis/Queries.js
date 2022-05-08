import SourceFinder from "./SourceFinder"
import SsbContext from "../Context/SsbContext";
import React, { useContext } from "react";

export const GetMapSsb = async (obj) => {
    console.log(obj)
    const { data } = await SourceFinder.get("incomejson", {
        params: { url: obj.url, mapFormat: obj.mapformat,regionType:obj.regionType},
    });
    console.log(data)
    return data;
}