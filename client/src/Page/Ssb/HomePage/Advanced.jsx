import React, { useEffect, useMemo, useState } from 'react'

import { Box, Button, Card, Container, Divider, InputAdornment, MenuItem, Stack, Tab, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tabs, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyTableHead from './MyTableHead';
import LoadingScreen from '../../../Components/LoadingScreen';
const Advanced = ({allCategories,allDataSets,gettingAllDataSets,gettingCategories}) => {
    const [chosenFilter, setChosenFilter] = useState(0)
    const [filterByName, setFilterByName] = useState("")
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('title');
    const [activeCategories, setActiveCategories] = useState(null)
    const [rowsPerPage, setRowsPerPage] = useState(5)
    const areas = ["All", "Regions", "Municipalities"]
    const [areasFilterStatus, setAreasFilterStatus] = useState("All")

    function changeTab(e, value) {
        setAreasFilterStatus(value)
    }
    useEffect(() => {
        if (allCategories) {
            setChosenFilter(0)
        }
    }, [allCategories]);

    function handleFilterChange(e) {
        const index = allCategories.findIndex(object => {
            return object.text === e.target.value;
        });
        setChosenFilter(index)
    }
    function onFilterByName(input) {
        setFilterByName(input)
    }
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    function filterData(data) {
        if (allCategories && allCategories[chosenFilter].id !== "all") {
            console.log(allCategories[chosenFilter].id)
            data = data.filter(dataSet => dataSet.path.split("/")[1] === allCategories[chosenFilter].id)
        }
        if (filterByName !== "") {
            data = data.filter((dataSet) => dataSet.title.toLowerCase().indexOf(filterByName.toLowerCase()) !== -1)
        }
        if (orderBy === "category") {
            data.map((dataSet) => {
                if (categoryConversion(dataSet.path) && categoryConversion(dataSet.path) !== "undefined") {
                    dataSet.category = categoryConversion(dataSet.path).text
                }
                else {
                    dataSet.category = "unmarked"
                }
            })
        }
        data = stableSort(data, getComparator(order, orderBy))
        return data
    }
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
    const dataFiltered = useMemo(() => filterData(allDataSets),[allDataSets])
    function perfectTitle(input) {
        const [first, ...rest] = input.split(':');
        const remainder = rest.join(':');
        return remainder
    }
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    function handlePageChange(e, newPage) {
        setPage(newPage)
    }
    function categoryConversion(inp) {
        if (activeCategories) {
            const value = inp.split("/")[1]
            const found = allCategories.find(element => element.id === value);
            return found
        }
        else {
            return "loading"
        }

    }
    if (gettingCategories || gettingAllDataSets) {
        return (
            <LoadingScreen />
        )
    }
    const isNotFound =
        (!dataFiltered.length && !!filterByName) ||
        (!dataFiltered.length && !!chosenFilter)
    return (
        <>
            <Container maxWidth="lg">
                <Card >
                    <Tabs
                        allowScrollButtonsMobile
                        variant="scrollable"
                        scrollButtons="auto"
                        value={areasFilterStatus}
                        onChange={changeTab}
                        sx={{ px: 2, bgcolor: 'background.neutral' }}
                    >
                        {areas.map((tab) => (
                            <Tab disableRipple key={tab} label={tab} value={tab} />
                        ))}
                    </Tabs>
                    <Divider />
                    <Stack direction='row' sx={{ py: 2.5, px: 3 }}>
                        {activeCategories &&
                            <TextField
                                fullWidth
                                select
                                label="Category"
                                value={activeCategories[chosenFilter].text}
                                onChange={(e) => handleFilterChange(e)}
                                sx={{
                                    maxWidth: { sm: 240 },
                                    textTransform: 'capitalize',
                                }}
                            >
                                {activeCategories.map((option, index) => {
                                    return (
                                        <MenuItem value={option.text} key={index} sx={{
                                            mx: 1,
                                            my: 0.5,
                                        }}>
                                            {option.text}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                        }
                        <TextField fullWidth sx={{ ml: 2 }} onChange={(e) => onFilterByName(e.target.value)} variant="outlined" label="Search" placeholder="Search for dataset..."
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                            }}
                        >
                        </TextField>
                    </Stack>
                    {allDataSets!=="undefined"&&
                    <TableContainer>
                        <Table>
                            <MyTableHead order={order} setOrder={setOrder} orderBy={orderBy} setOrderBy={setOrderBy} />
                            <TableBody>
                                {dataFiltered && dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((dataset) =>
                                    <TableRow>
                                        {console.log("Showing!")}
                                        <TableCell sx={{ color: "#fff" }} width="40%">
                                            {perfectTitle(dataset.title)}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {dataset.score}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {dataset.published}
                                        </TableCell>
                                        <TableCell align='center'>
                                            {categoryConversion(dataset.path).text}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Button variant="contained">Show map</Button>
                                        </TableCell>
                                    </TableRow>)}
                                <TableRow>
                                    {isNotFound ? (
                                        <TableCell colSpan={12}>
                                            <Typography>No data found!</Typography>
                                        </TableCell>
                                    ) : <TableCell colSpan={12} sx={{ p: 0 }} />}

                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>}
                    <Box sx={{ position: 'relative' }}>
                        <TablePagination
                            sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: 0 }}
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={dataFiltered.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                    </Box>
                </Card>
            </Container>
        </>
    )
}

export default Advanced