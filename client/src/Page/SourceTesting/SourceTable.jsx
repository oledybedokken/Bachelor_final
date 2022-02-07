import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const SourceTable = ({rows}) => {
  function createData(ID, name, Dato, element,verdato) {
    return { ID, name, Dato, element, verdato };
  }
  return <TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
    <TableHead>
      <TableRow>
        <TableCell>Dato</TableCell>
        <TableCell align="right">Temperatur</TableCell>
        <TableCell align="right">Snø</TableCell>
        <TableCell align="right">Vind hastighet</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.list.map((row) =>(
        <TableRow
          key={row.dt}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            {row.dt}
          </TableCell>
          <TableCell align="right">{row.main.temp}</TableCell>
          <TableCell align="right">Hmmm</TableCell>
          <TableCell align="right">{row.wind.speed}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
};

export default SourceTable;
