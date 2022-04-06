import { Container, TextField, Typography, Button } from '@mui/material'
import React, { useEffect, useState, useContext, useMemo } from 'react'
import { useQuery } from 'react-query';
import SourceFinder from '../../Apis/SourceFinder';
import JSONstat from "jsonstat-toolkit";
import { BeatLoader, DotLoader } from 'react-spinners';
import SsbVisualization from '../SsbVisualization';
import { usePromiseTracker } from "react-promise-tracker";
import { trackPromise } from 'react-promise-tracker';
import SortingDropDownMenu from '../../Components/SortingDropDownMenu';
import SsbContext from '../../context/SsbContext';
const SsbData = () => {
    const{sorting,setSorting} = useContext(SsbContext);
    const [geoJsonArray, setGeoJsonArray] = useState(null);
    const [dataArray, setDataArray] = useState(null);
    const [kommuner, setKommuner] = useState(null);
    const {promiseInProgress } = usePromiseTracker();
    const [id, setId] = useState("")
    //Everything that has to do with fetching and storing data this is like a hub for the site, we could have used context but that may have lowered the performance
    const { data, refetch, isLoading } = useQuery("ssbData", async () => {
        const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
        let needsKommune = null
        if (kommuner !== []) {
            needsKommune = true
        }
        else {
            needsKommune = false
        }
        const { data } = await SourceFinder.get("/incomejson", {
            params: { sortValue: sorting.value, url: url, needsKommune: needsKommune, sortingTypes: (Object.keys(sorting.options)[0])},
        });
        setGeoJsonArray(data.sortedArray)
        setDataArray(data.unSortedArray)
        setKommuner(data.kommuner)
        return data;
    }, {
        refetchOnWindowFocus: false,
        enabled: false // turned off by default, manual refetch is needed
    });

    //Fetching the different values
    function getOptions(url) {
        return JSONstat(url).then(main);
    }
    async function main(j) {
        var ds = j.Dataset(0);
        let variabler = ds.id.filter(item => { return item !== 'Region' && item !== 'ContentsCode' && item !== 'Tid' })
        let variablerValues = {}
        variabler.map((item) => {
            let itemLength = ds.Dimension(item).length;
            variablerValues[item] = []
            for (let i = 0; i < itemLength; i++) {
                variablerValues[item].push(ds.Dimension(item).Category(i).label)
            }
        })
        if (Object.keys(variablerValues).length > 0) {
            setSorting({
                options:variablerValues,
                value:variablerValues["HusholdType"][0]
            })
        }
        else (
            setSorting("IngenSortneeded")
        )
    }
    async function sortArray() {
        let validKommuner = []
        const newSortedArray = dataArray.filter((item)=>item.HusholdType===sorting.value)
         kommuner.features.forEach((kommune)=>{
          let currentKommune = null
          if (newSortedArray.find((e) => parseInt(e.RegionNumber) === kommune.properties.RegionNumber)) {
            currentKommune = kommune
            currentKommune.properties = newSortedArray.find((e) => parseInt(e.RegionNumber) === kommune.properties.RegionNumber)
            validKommuner.push(currentKommune)
          }
         })
         let geoJson = {
          "type": "FeatureCollection",
          "features": validKommuner
        }
        setGeoJsonArray(geoJson)
      }
    useEffect(() => {
        if (id !== "") {
            const url = "https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no";
            trackPromise(getOptions(url));
        }
    }, [id]);
    useMemo(()=>{
        sortArray()
    },[sorting]);
    if (isLoading) {
        return <Container maxWidth="" sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}><BeatLoader color={'#123abc'} /><Typography>Right now we are preparing your map!</Typography></Container>;
    }
    const FillOutForm = () => (
        <Container sx={{ justifyContent: "center", display: "flex", flexDirection: "column" }}>
            <Typography variant="h3" color="primary.main">Welcome to ssb visualisation toolkit</Typography>
            <Typography> Kommuner:<a href="https://data.ssb.no/api/?tags=kommuner">Velg data set</a></Typography>
            <TextField value={id} onChange={(e) => setId(e.target.value)} required id="outlined-basic" label="Ssb Json Link" variant="outlined" />
            {id !== "" && <Typography>Urlen som vil bli vist: {"https://data.ssb.no/api/v0/dataset/" + id + ".json?lang=no"}</Typography>}
            {sorting &&Object.keys(sorting.options).length > 0 && <><Typography variant="h6">Velg sorting:</Typography><SortingDropDownMenu fetched={false}/></>}
            {(promiseInProgress === true) ? <DotLoader color={"primary.main"} /> : null}
            <Button variant="contained" disabled={sorting === ""} onClick={() => refetch()} sx={{ mt: 2 }}>HENT DATA</Button>
        </Container>
    );
    return (
        <>
            {!data ?
            <FillOutForm/>
            :<SsbVisualization geoJsonArray={geoJsonArray}/>}
        </>
    )
}

export default SsbData