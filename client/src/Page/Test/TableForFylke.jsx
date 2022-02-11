import React from 'react'
import { Table, TableRow, TableHead, TableCell, Container, TableContainer, Paper, Typography, TableBody, Checkbox } from '@mui/material'
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles(() => ({
    TableRow: {
        borderTop: "5px solid #E9E9E9",
        borderBottom: "5px solid #E9E9E9"
    },
}))
const TableForFylke = ({ fylkeListe, fylke }) => {
    const classes = useStyles()
    if (fylkeListe.length > 0) { console.log(fylkeListe[0].properties.name) }
    return (<>
        <Container maxWidth="lg" sx={{ backgroundColor: "primary.main", height: "20px", display: "flex", justifyContent: "center", color: "#fff" }}>
            <Typography >{fylke}</Typography>
        </Container>
        <Container maxWidth="lg" sx={{ display: "flex", justifyContent: "center" }}>
            <TableContainer component={Paper}>
                <Table style={{ tableLayout: 'fixed' }}>
                    <TableBody>
                        {fylkeListe.map((fylke) => {
                            return (
                                <TableRow>
                                    <TableCell sx={{py:"4px"}}>
                                        <Checkbox></Checkbox>
                                    </TableCell>
                                    <TableCell sx={{py:"4px"}}>
                                        {fylke.properties.name}
                                    </TableCell>
                                    <TableCell sx={{py:"4px"}}>
                                        {fylke.properties.id}
                                    </TableCell>
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    </>
    )
}

export default TableForFylke