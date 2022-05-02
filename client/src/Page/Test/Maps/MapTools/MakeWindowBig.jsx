//Reference https://visgl.github.io/react-map-gl/docs/api-reference/fullscreen-control
import { FullscreenControl } from "react-map-gl";
import { styled } from '@mui/material/styles';
const FullscreenControlStyle = styled(FullscreenControl)(({ theme }) => ({
    zIndex: 99,
    borderRadius: 8,
    overflow: 'hidden',
    top: 10,
    left: 10,
  }));
  
  // ----------------------------------------------------------------------
  
  export default function MapControlFullscreen({ ...other }) {
    return <FullscreenControlStyle {...other} />;
  }