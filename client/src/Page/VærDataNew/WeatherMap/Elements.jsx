import { Box, Card } from '@mui/material';
import React from 'react'
import { useQuery } from 'react-query';
import { GetElements } from '../../../Apis/Queries';
const Elements = ({ selectedElement, setSelectedElement }) => {
    const { data: elements, isLoading } = useQuery("elements", GetElements);
    if (elements) {
        elements.map((e) => {
            if (e.element_name === selectedElement) {
                console.log(true)
            }
        })
    }
    if (isLoading) {
        return <p>Loading..</p>
    }
    return (
        selectedElement !== "undefined" &&
        <Box sx={{ position: "absolute", left: 5, bottom: 50, display: "flex", flexDirection: "column", gap: "5px" }}>
            {elements &&
                elements.map((element) => { return <Card sx={{ cursor: "pointer", background: element.element_name === selectedElement ? "rgba(0,0,0,.5)" : 'linear-gradient(#e66465, #9198e5);', p: 1 }} key={element.element_id} onClick={() => setSelectedElement(element.element_name)}>{element.element_name}</Card> })
            }
        </Box>

    )
}

export default Elements