import React, {useState, useEffect, useCallback, useMemo} from "react";
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Autocomplete, Checkbox, FormControlLabel, Typography, Paper, Tooltip, InputAdornment, Fade, Chip, Slide
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
    Edit2,
    SearchNormal1, Link2, Link1, Hashtag, Settings
} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";
import {ConfigDetailsAPI} from "../services/Api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const GeneralConfigs = () => {
    const userRole = localStorage.getItem("role");
    const [parameterType, setParameterType] = useState("");
    const [parameterCategory, setParameterCategory] = useState("");
    const [parameterValue, setParameterValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [sortModel, setSortModel] = useState([{field: "id", sort: "desc"}]);
    const [searchVal, setSearchVal] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [parameterValueError, setParameterValueError] = useState(false);
    const [parameterTypeErrorEdit, setParameterTypeErrorEdit] = useState(false);
    const [parameterCategoryErrorEdit, setParameterCategoryErrorEdit] = useState(false);
    const [parameterValueErrorEdit, setParameterValueErrorEdit] = useState(false);
    const [parameterTypeError, setParameterTypeError] = useState(false);
    const [parameterCategoryError, setParameterCategoryError] = useState(false);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: "",
        param: "",
        value: "",
        valueType: "",
        status: ""
    });
    const parameterTypeOptions = ["Admin", "Manager", "User", "Viewer"];
    const parameterCategoryOptions = ["Text", "Date"];
    const handleApproveMenuOpen = (e, row) => {
        e.stopPropagation();
        console.log('--row ', row)
        setSelectedRow(row);
        setOpenApproveDialog(true);
    };

    const handleApproveCloseDialog = () => {
        setOpenApproveDialog(false);
    };

    const handleApprove = () => {
        console.log("Approved:", selectedRow);
        setOpenApproveDialog(false);
    };

    const handleReject = () => {
        console.log("Rejected:", selectedRow);
        setOpenApproveDialog(false);
    };

    // Fetch pageable users
    const fetchConfigs = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = sortModel[0]?.field || "id";
            const sortDir = sortModel[0]?.sort?.toUpperCase() || "DESC";

            ConfigDetailsAPI().then((data) => {
                console.log('data - ', data)
                if (data.status === 200){
                    setRows(data.data);
                } else {
                    setSnackbar({ open: true, message: "No values recorded", severity: "success" });
                }

            });
            // const response = await fetch(
            //     `http://localhost:8082/api/accountstatementengine/v1/user/findAllConfigs?start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            // );
            //
            // if (!response.ok) {
            //     throw new Error("Failed to fetch data");
            // }
            //
            // const data = await response.json();
            // console.log('data - ', data)
            //
            // setRows(
            //     data.content.map((item, index) => ({
            //         id: item.id,
            //         param: item.param || "-",
            //         value: item.value || "-",
            //         valueType: item.valueType || "-",
            //         status: item.status || "-",
            //     }))
            // );
            // setRowCount(data.totalElements);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel, sortModel, searchVal]);

    useEffect(() => {
        fetchConfigs();
    }, [fetchConfigs]);

    // Add account
    const handleAddConfig = async () => {
        console.log(' -- ', parameterType, parameterCategory, parameterValue)
        if (!parameterType) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select parameter type", severity: "error"});
            setParameterTypeError(true);
            return;
        }

        // reset role error if valid
        setParameterTypeError(false);

        if (!parameterCategory) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select parameter category", severity: "error"});
            setParameterCategoryError(true);
            return;
        }

        // reset role error if valid
        setParameterCategoryError(false);

        if (!parameterValue) {
            setSnackbar({open: true, message: "Please enter parameter value", severity: "error"});
            setParameterValueError(true);
            return;
        }

        // reset email error if valid
        setParameterValueError(false);

    };

    const handleEditMenuOpen = (e, row) => {
        e.stopPropagation();
        setSelectedRow(row);

        setEditFormData({
            id: row.id || "",
            param: row.param || "",
            value: row.value || "",
            valType: row.valType || "",
            status: row.status || "",
        });
        setOpenEditModal(true);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleEditClick = () => {
        setEditFormData({
            id: selectedRow.id,
            param: selectedRow.param,
            value: selectedRow.value,
            valueType: selectedRow.valueType,
            status: selectedRow.status,
        });
        setOpenEditModal(true);
        handleMenuClose();
    };
    const handleEditModalClose = () => {
        setOpenEditModal(false);
        setEditFormData({id: "", name: "", email: "", role: ""});
    };

    const handleFormChange = (field, value) => {
        setEditFormData((prev) => ({...prev, [field]: value}));
    };

    const handleEditSave = async () => {
        console.log("New values:", editFormData);

        if (!editFormData.param) {
            setSnackbar({open: true, message: "Please enter parameter type", severity: "error"});
            setParameterTypeErrorEdit(true);
            return;
        }

        setParameterTypeErrorEdit(false);

        if (!editFormData.valueType) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select parameter category", severity: "error"});
            setParameterCategoryErrorEdit(true);
            return;
        }

        setParameterCategoryErrorEdit(false);

        if (!editFormData.value) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select parameter value", severity: "error"});
            setParameterValueErrorEdit(true);
            return;
        }

        setParameterValueErrorEdit(false);
        return
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:7081/api/accountstatementengine/v1/user/edit",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(editFormData),
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                setSnackbar({open: true, message: "Something went wrong", severity: "error"});
                throw new Error(errData.message || "Failed to add user");
            }
            await fetchConfigs(); // refresh list from server
            setSnackbar({open: true, message: "Successfully edited user", severity: "success"});
            setParameterValue("");
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
            handleEditModalClose()
        }
    };

    const getStatusChip = (status) => {
        const statusConfig = {
            1: {
                color: "#B26A00", // warm amber
                bg: "#FFF4E5", // soft orange background
                label: "Pending",
            },
            2: {
                color: "#1B5E20", // deep green
                bg: "#C8E6C9", // minty green background
                label: "Approved",
            },
            3: {
                color: "#B71C1C", // bold red
                bg: "#FFCDD2", // light red background
                label: "Rejected",
            },
        };

        const config = statusConfig[status] || {
            color: "#424242",
            bg: "#E0E0E0",
            label: "Unknown",
        };

        return (
            <Chip
                label={config.label}
                size="small"
                sx={{
                    backgroundColor: config.bg,
                    color: config.color,
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    height: "24px",
                    borderRadius: "8px",
                    letterSpacing: 0.3,
                }}
            />
        );
    };

    const columns = useMemo(() => {
        const cols = [
            {field: "param", headerName: "Parameter", flex: 1, minWidth: 150},
            {field: "value", headerName: "Value", flex: 1, minWidth: 150},
            {field: "valType", headerName: "Type", flex: 1, minWidth: 150},
            {
                field: "status",
                headerName: "Status",
                flex: 0.8,
                minWidth: 100,
                renderCell: (params) => getStatusChip(params.value),
            },
        ];

        // Add action column based on role
        if (userRole === "ICT_Service_Desk_Maker") {
            cols.push({
                field: "edit",
                headerName: "",
                width: 70,
                sortable: false,
                renderCell: (params) => (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditMenuOpen(e, params.row);
                        }}
                        size="small"
                    >
                        <Edit2 size="14" color="#116530"/>
                    </IconButton>
                ),
            });
        } else if (userRole === "ICT_Service_Desk_Checker") {
            cols.push({
                field: "approve",
                headerName: "",
                width: 70,
                sortable: false,
                renderCell: (params) => (
                    <IconButton
                        onClick={(e) => handleApproveMenuOpen(e, params.row)}
                        size="small"
                        sx={{
                            transition: "all 0.2s",
                            "&:hover": {
                                backgroundColor: "#e8f5e9",
                                transform: "rotate(90deg)",
                            },
                        }}
                    >
                        <Settings size="20" color="#116530"/>
                    </IconButton>
                ),
            });
        }

        return cols;
    }, [userRole]);

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
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            {/* Page Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "#116530", mb: 0.5}}
                    >
                        General Configs
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage global configurations & settings
                    </Typography>
                </Box>
            </Fade>
            {/* Filter + Add Button Section */}
            {["ICT_Service_Desk_Maker"].includes(userRole) && (
                <Fade in={true} timeout={1000}>
                    <Paper
                        elevation={5}
                        sx={{
                            p: 2,
                            mb: 3,
                            borderRadius: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                flexGrow: 1,
                                justifyContent: "space-between",
                            }}
                        >
                            {/* Role */}
                            <Autocomplete
                                options={parameterTypeOptions}
                                size="small"
                                value={parameterType}
                                onChange={(event, newValue) => setParameterType(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Parameter Type"
                                        error={parameterTypeError && !parameterType} // ✅ Pass error here
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment:
                                                <InputAdornment position="start" sx={{color: "grey.500"}}>
                                                    {/* icon inherits currentColor from the adornment */}
                                                    <Link2 size="18" color="currentColor"/>
                                                </InputAdornment>,
                                        }}
                                    />
                                )}
                                sx={{
                                    flex: 1,
                                    minWidth: "180px",
                                    "& .MuiInputBase-input": {fontSize: "0.9rem"},
                                    "& .MuiInputLabel-root": {
                                        fontSize: "1.0rem",
                                        color: "black",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "black", // keep label black when focused
                                    },
                                }}
                            />

                            {/* Role */}
                            <Autocomplete
                                options={parameterCategoryOptions}
                                size="small"
                                value={parameterCategory}
                                onChange={(event, newValue) => setParameterCategory(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Parameter Category"
                                        error={parameterCategoryError && !parameterCategory} // ✅ Pass error here
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment:
                                                <InputAdornment position="start" sx={{color: "grey.500"}}>
                                                    {/* icon inherits currentColor from the adornment */}
                                                    <Link1 size="18" color="currentColor"/>
                                                </InputAdornment>,
                                        }}
                                    />
                                )}
                                sx={{
                                    flex: 1,
                                    minWidth: "180px",
                                    "& .MuiInputBase-input": {fontSize: "0.9rem"},
                                    "& .MuiInputLabel-root": {
                                        fontSize: "1.0rem",
                                        color: "black",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "black", // keep label black when focused
                                    },
                                }}
                            />

                            {/* Email Address */}
                            <TextField
                                size="small"
                                label="Parameter Value"
                                variant="outlined"
                                value={parameterValue}
                                onChange={(e) => setParameterValue(e.target.value)}
                                error={parameterValueError}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start" sx={{color: "grey.500"}}>
                                            {/* icon inherits currentColor from the adornment */}
                                            <Hashtag size="18" color="currentColor"/>
                                        </InputAdornment>,
                                }}
                                sx={{
                                    flex: 1,
                                    minWidth: "180px",
                                    "& .MuiInputBase-input": {fontSize: "0.9rem"},
                                    "& .MuiInputLabel-root": {
                                        fontSize: "1.0rem",
                                        color: "black",
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {
                                        color: "black", // keep label black when focused
                                    },
                                }}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            onClick={handleAddConfig}
                            disabled={loading}
                            startIcon={<AddIcon size="18" color="#fff"/>}
                            sx={{
                                height: 34,
                                minWidth: 120,
                                background: "linear-gradient(90deg, #116530, #1b7a3e)",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #0d4d24, #156e35)",
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit"/> : "Add Config"}
                        </Button>
                    </Paper>
                </Fade>
            )}
            {/* 🔍 Data Table + Search */}
            <Fade in={true} timeout={1000}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: "#fff",
                    }}
                >
                    {/* 🔍 Search Field above DataGrid */}
                    <Box sx={{mb: 1, display: "flex", justifyContent: "flex-start"}}>
                        <TextField
                            placeholder="Search email address..."
                            variant="outlined"
                            size="small"
                            value={searchVal}
                            onChange={(e) => setSearchVal(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchNormal1 size="18" color="#666"/>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                width: {xs: "100%", sm: "280px"},
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 1,
                                    backgroundColor: "#f8f9fa",
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        backgroundColor: "#fff",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    },
                                    "&.Mui-focused": {
                                        backgroundColor: "#fff",
                                        boxShadow: "0 4px 16px rgba(17, 101, 48, 0.15)",
                                    },
                                },
                                "& .MuiInputBase-input": {
                                    fontSize: "0.9rem",
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{height: 460, width: "100%"}}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            rowCount={rowCount}
                            loading={loading}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            paginationMode="server"
                            sortingMode="server"
                            onSortModelChange={setSortModel}
                            pageSizeOptions={[5, 10, 20, 50]}
                            disableColumnMenu
                            rowHeight={40}          // 👈 smaller rows
                            headerHeight={38}       // 👈 smaller header
                            sx={{
                                "& .MuiDataGrid-columnHeaderTitle": {
                                    fontWeight: "700",
                                },
                            }}
                            slots={{
                                loadingOverlay: () => (
                                    <Box
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <CircularProgress/>
                                    </Box>
                                ),
                            }}
                        />

                        {/* Actions Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleEditClick}>Edit</MenuItem>
                        </Menu>

                        {/* Edit Modal */}
                        <Dialog
                            open={openEditModal}
                            onClose={handleEditModalClose}
                            maxWidth="sm"
                            disableRestoreFocus
                            fullWidth
                            TransitionComponent={Transition}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(20px)",
                                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    background: "linear-gradient(135deg, #116530 0%, #1b7a3e 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    py: 2.5,
                                }}
                            >
                                Edit Config
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>

                                    {/* Email */}
                                    <Autocomplete
                                        options={parameterTypeOptions}
                                        value={editFormData.param || ""}
                                        size="small"
                                        onChange={(e, newValue) => handleFormChange("parameterTypeEdit", newValue || "")}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Parameter Type" variant="outlined"
                                                       sx={{
                                                           "& .MuiInputBase-input": {fontSize: 14}, // input text
                                                           "& .MuiInputLabel-root": {fontSize: 14}, // label text
                                                       }}
                                                       fullWidth/>
                                        )}
                                    />
                                    {/* Role */}
                                    <Autocomplete
                                        options={parameterCategoryOptions}
                                        value={editFormData.valueType || ""}
                                        size="small"
                                        onChange={(e, newValue) => handleFormChange("parameterCategoryEdit", newValue || "")}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Parameter Category" variant="outlined"
                                                       sx={{
                                                           "& .MuiInputBase-input": {fontSize: 14}, // input text
                                                           "& .MuiInputLabel-root": {fontSize: 14}, // label text
                                                       }}
                                                       fullWidth/>
                                        )}
                                    />

                                    {/* Email */}
                                    <TextField
                                        label="Parameter Value"
                                        fullWidth
                                        type="text"
                                        size="small"
                                        value={editFormData.value}
                                        error={parameterValueErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {fontSize: 14}, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleFormChange("value", e.target.value)}
                                    />
                                    {/* Status */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={editFormData.status === 1}
                                                onChange={(e) => handleFormChange("active", e.target.checked)}
                                            />
                                        }
                                        label="Active"
                                        sx={{
                                            "& .MuiFormControlLabel-label": {
                                                fontSize: "0.95rem", // 👈 smaller label text
                                            },
                                        }}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleEditModalClose} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleEditSave}
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={20}/> : "Save Changes"}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openApproveDialog}
                            onClose={handleApproveCloseDialog}
                            maxWidth="sm"
                            fullWidth
                            TransitionComponent={Transition}
                            PaperProps={{
                                sx: {
                                    borderRadius: 3,
                                    background: "rgba(255, 255, 255, 0.95)",
                                    backdropFilter: "blur(20px)",
                                    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
                                },
                            }}
                        >
                            <DialogTitle
                                sx={{
                                    background: "linear-gradient(135deg, #116530 0%, #1b7a3e 100%)",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    py: 2.5,
                                }}
                            >
                                Validate Config
                            </DialogTitle>
                            <DialogContent sx={{mt: 3, pb: 2}}>
                                {selectedRow && (
                                    <Box>
                                        <Typography sx={{mb: 3, color: "#555", fontSize: "1.1rem", fontWeight: 800}}>
                                            Confirm config admission
                                        </Typography>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2.5,
                                                backgroundColor: "#f8f9fa",
                                                borderRadius: 2,
                                                border: "2px solid #e0e0e0",
                                            }}
                                        >
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Parameter Type
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                        {selectedRow.param}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Parameter Category
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: "#116530",
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {selectedRow.valueType}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Parameter Value
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                        {selectedRow.value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Paper>
                                    </Box>
                                )}
                            </DialogContent>
                            <DialogActions sx={{p: 3, pt: 2}}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "100%",
                                        gap: 1.5,
                                    }}
                                >
                                    <Button onClick={handleApproveCloseDialog}
                                            variant="contained"
                                            sx={{
                                                backgroundColor: "#999", // Bootstrap secondary gray
                                                color: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#5a6268", // Bootstrap darker hover shade
                                                },
                                            }}>
                                        Cancel
                                    </Button>
                                    <Box sx={{display: "flex", gap: 1.5}}>
                                        {selectedRow?.status === 1 && (
                                            <>
                                                <Button
                                                    onClick={handleReject}
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{ mr: 1 }}
                                                >
                                                    Reject
                                                </Button>
                                                <Button
                                                    onClick={handleApprove}
                                                    variant="contained"
                                                    color="primary"
                                                >
                                                    Approve
                                                </Button>
                                            </>
                                        )}
                                        {selectedRow?.status === 2 && (
                                            <Button
                                                onClick={handleReject}
                                                variant="outlined"
                                                color="error"
                                                sx={{ mr: 1 }}
                                            >
                                                Reject
                                            </Button>
                                        )}

                                        {selectedRow?.status === 3 && (
                                            <Button
                                                onClick={handleApprove}
                                                variant="contained"
                                                color="primary"
                                            >
                                                Approve
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default GeneralConfigs;
