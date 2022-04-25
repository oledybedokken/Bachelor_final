import React from 'react'
import { TableCell, TableHead,TableRow, TableSortLabel } from '@mui/material'
const MyTableHead = ({order,orderBy,setOrderBy,setOrder}) => {
    const headValues = [{id:"title",label:"Title",align:"left"},{id:"score",label:"Score"},{id:"published",label:"Published"},{id:"category",label:"Category"},{id:"btn",label:"",align:"right"}]
      function handleSortRequest(headId){
        const isAsc = orderBy === headId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(headId);
      }
    return (
        <TableHead>
            <TableRow>
            {headValues.map((head)=>(
                <TableCell
                key={head.id}
                align={head.align?head.align:"center"}
                sortDirection={orderBy===head.id?order:false}
                >
                <TableSortLabel active={orderBy === head.id} direction={orderBy === head.id ? order : 'asc'} onClick={() => handleSortRequest(head.id)}>
                {head.label}
                </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
    )
}

export default MyTableHead