import React from "react";
import { Button } from "@mui/material";

const FileUpload = () => {
  return (
    <>
      <div>FileUpload</div>
      <Button variant="contained"  color="primary" component="label">
        Upload File
        <input type="file" hidden />
      </Button>
    </>
  );
};

export default FileUpload;
