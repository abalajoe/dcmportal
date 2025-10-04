import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";

function SnackBarUtil() {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") return; // don't close on clickaway
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleOpen}>
                Show Notification
            </Button>

            <Snackbar
                open={open}
                autoHideDuration={3000} // hide after 3 seconds
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
                    This is a success notification!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default SnackBarUtil;
