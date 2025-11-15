import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Box,
    Typography,
    Fade,Slide, Chip, Snackbar, Alert, IconButton,
} from "@mui/material";
import { Edit2,Settings,
} from "iconsax-react";
import {CreateDept, EditDept, UpdateDept} from "../services/Api";

const RolesTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AllSettings = () => {
    const userRole = localStorage.getItem("role");
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editDepartmentFormData, setEditDepartmentFormData] = useState({
        id: "",
        name: "",
        description: "",
    });
    return (
        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                pt: {xs: 0, sm: 0, md: 0},
                px: {xs: 1, sm: 2, md: 3},
                pb: {xs: 2, sm: 3, md: 5},
                fontFamily: "'SUSE', sans-serif",
            }}
        >

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {/* 🔹 Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "purple", mb: 0.5}}
                    >
                        Settings
                    </Typography>
                </Box>
            </Fade>
        </Box>
    );
};

export default AllSettings;
