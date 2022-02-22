import React, { useState } from 'react'
import { Table, TableRow, TableHead, TableCell, Container, TableContainer, Paper, Typography, TableBody, Checkbox } from '@mui/material'
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    TableRow: {
        borderTop: "5px solid #E9E9E9",
        borderBottom: "5px solid #E9E9E9"
    },
}))
const TableForKommune = ({ kommuneListe, kommune, setValgteSources, valgteSources }) => {
    const classes = useStyles()
    const [hide, setHide] = useState(true)
    function handleSourceChange(e, id) {
        if (e.target.checked) {
            if (valgteSources === null) {
                setValgteSources([id])
            }
            else {
                setValgteSources([...valgteSources, id])
            }
        }
        else{
            const filteredSources = valgteSources.filter((source) => source !== id);
            setValgteSources(filteredSources)
        }
    }
    function handleChange() {
        setHide(!hide)
    }
    return (<>
        <Container maxWidth="lg" sx={{ backgroundColor: "primary.main", height: "25px", display: "flex", justifyContent: "center", color: "#fff", cursor: "pointer", mb: 1 }} onClick={handleChange}>
            <Typography >{kommune}({kommuneListe.length})</Typography>
        </Container>
        {!hide &&
            <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
                <TableContainer component={Paper}>
                    <Table style={{ tableLayout: 'fixed' }}>
                        <TableBody>
                            {kommuneListe.map((kommune) => {
                                return (
                                    <TableRow key={kommune.properties.id}>
                                        <TableCell sx={{ py: "0px" }}>
                                            <Checkbox onChange={(e) => handleSourceChange(e, kommune.properties.id)}></Checkbox>
                                        </TableCell>
                                        <TableCell sx={{ py: "0px" }}>
                                            {kommune.properties.name}
                                        </TableCell>
                                        <TableCell sx={{ py: "0px" }}>
                                            {kommune.properties.id}
                                        </TableCell>
                                        <TableCell>
                                            {kommune.properties.avi}
                                        </TableCell>
                                    </TableRow>)
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        }
    </>
    )
}

export default TableForKommune