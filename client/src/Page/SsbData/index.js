import { Container, TextField, Typography } from '@mui/material'
import React from 'react'
import { useQuery } from 'react-query';
import SourceFinder from '../../Apis/SourceFinder';

const SsbData = () => {
  const { isLoading, isError, data, error, refetch } = useQuery(
    "joke",
    async () => {
      const {data} = await SourceFinder.get("/incomejson", {
        params: { sorting: "Alle husholdninger" },
      });
      return data;
    }
  );
  if(isLoading){
    return <h1>Loading...</h1>;
  }
  return (
      <>
      <Container sx={{justifyContent:"center",display:"flex",flexDirection:"column"}}>
    <Typography variant="h4">Welcome to ssb visualisation toolkit</Typography>
    <Typography>Velg data set:</Typography>
    {data && <h1>Hi</h1>}
    <Typography>Kommuner:<a href="https://data.ssb.no/api/?tags=kommuner">Velg data set</a></Typography>
    <TextField id="outlined-basic" label="Ssb Json Link" variant="outlined" />
    </Container>
    </>
  )
}

export default SsbData