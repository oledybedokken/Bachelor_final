import React, { useState } from 'react'
import { Table, TableRow, TableHead, TableCell, Container, TableContainer, Paper, Typography, TableBody, Checkbox } from '@mui/material'
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    TableRow: {
        borderTop: "5px solid #E9E9E9",
        borderBottom: "5px solid #E9E9E9"
    },
}))
const TableForFylke = ({ fylkeListe, fylke, setValgteSources, valgteSources }) => {
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
    if (fylkeListe.length > 0) { console.log(fylkeListe[0].properties.name) }
    return (<>
        <Container maxWidth="lg" sx={{ backgroundColor: "primary.main", height: "25px", display: "flex", justifyContent: "center", color: "#fff", cursor: "pointer", mb: 1 }} onClick={handleChange}>
            <Typography >{fylke}({fylkeListe.length})</Typography>
        </Container>
        {!hide &&
            <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
                <TableContainer component={Paper}>
                    <Table style={{ tableLayout: 'fixed' }}>
                        <TableBody>
                            {fylkeListe.map((fylke) => {
                                return (
                                    <TableRow>
                                        <TableCell sx={{ py: "0px" }}>
                                            <Checkbox onChange={(e) => handleSourceChange(e, fylke.properties.id)}></Checkbox>
                                        </TableCell>
                                        <TableCell sx={{ py: "0px" }}>
                                            {fylke.properties.name}
                                        </TableCell>
                                        <TableCell sx={{ py: "0px" }}>
                                            {fylke.properties.id}
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

export default TableForFylke