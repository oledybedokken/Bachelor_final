import { Box, Card } from '@mui/material';
import React from 'react'
import { useQuery } from 'react-query';
import { GetElements } from '../../../Apis/Queries';
const Elements = ({setSelectedElement}) => {
    const { data: elements, isLoading } = useQuery("elements", GetElements);
    if (isLoading) {
        return <p>Loading..</p>
    }
    return (
        <Box sx={{position:"absolute",left:5,bottom:50,display:"flex",flexDirection:"column",gap:"5px"}}>
            {elements &&
                elements.map((element) => {return <Card sx={{cursor:"pointer",backgroundColor:"rgba(0,0,0,.5)",p:1}} key={element.element_id} onClick={()=>setSelectedElement(element.element_name)}>{element.element_name}</Card>})
            }
        </Box>
    )
}

export default Elements