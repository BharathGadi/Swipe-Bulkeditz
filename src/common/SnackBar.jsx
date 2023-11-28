import React from 'react';
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const CommonSnackbar = ({ open, message, severity, handleClose, autoHideDuration = 4000 }) => {
  const handleCloseSnackbar = (event, reason) => {
    handleClose();
  };

  return (
    <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleCloseSnackbar}>
      <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={severity}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default CommonSnackbar;
