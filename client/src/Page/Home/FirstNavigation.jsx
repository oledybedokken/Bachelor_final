import React from 'react';
import { Box, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { Link as RouterLink } from 'react-router-dom'
const FirstNavigation = () => {
  return (
    <Box sx={{width:"250px",mt:5}}>
      <Button
        size="large"
        variant="contained"
        component={RouterLink}
        to={"/ssb"}
        sx={{
          ':hover': {
            color: 'text.primary',
          }
        }}
        endIcon={<PersonIcon />}
      >
        SSB - VizTool
      </Button>
    </Box>
  )
}

export default FirstNavigation 