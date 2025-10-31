// src/components/tabs/DepartmentTab.jsx
import React, {useEffect, useState, useCallback, useMemo} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Snackbar,
    Alert,
    TextField,
    InputAdornment, Divider, Menu, MenuItem, DialogActions, Typography, Paper, Chip, IconButton, Slide
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {Edit2, ArchiveAdd, Keyboard, Receipt1, Settings, ArchiveTick, Profile} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";
import {CreateBranch, CreateDept, EditBranch, EditDept, UpdateBranch, UpdateDept} from "../services/Api";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const BranchTab = () => {
    const userRole = localStorage.getItem("role");
    const [branchName, setBranchName] = useState("");
    const [branchDescription, setBranchDescription] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [branchNameError, setBranchNameError] = useState(false);
    const [branchDescriptionError, setBranchDescriptionError] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [searchVal, setSearchVal] = useState("");
    const [rowsRoles, setRowsRoles] = useState([]);
    const [rowRolesCount, setRowRolesCount] = useState(0); // total elements from backend
    const [openRolesEditModal, setOpenRolesEditModal] = useState(false);
    const [branchDescriptionErrorEdit, setBranchDescriptionErrorEdit] = useState(false);
    const [branchNameErrorEdit, setBranchNameErrorEdit] = useState(false);
    const [branchSortModel, setBranchSortModel] = useState([{field: "id", sort: "desc"}]);
    const [branchRows, setBranchRows] = useState([]);
    const [branchRowCount, setBranchRowCount] = useState(0); // total elements from backend
    const [selectedBranchRow, setBranchSelectedRow] = useState(null);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [branchPaginationModel, setBranchPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editBranchFormData, setEditBranchFormData] = useState({
        id: "",
        name: "",
        description: "",
    });
    const [editRolesFormData, setEditRolesFormData] = useState({
        id: "",
        param: "",
        value: "",
        valueType: "",
    });
    const [paginationRolesModel, setPaginationRolesModel] = useState({
        page: 0,
        pageSize: 9,
    });

    const [paginationDepartmentModel, setPaginationDepartmentModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [sortRolesModel, setSortRolesModel] = useState([{field: "id", sort: "desc"}]);
    const [sortDepartmentModel, setSortDepartmentModel] = useState([{field: "id", sort: "desc"}]);
    const [rolesAnchorEl, setRolesAnchorEl] = useState(null);
    const handleChange = (_, newIndex) => setTabIndex(newIndex);
    const handleRolesMenuClose = () => setRolesAnchorEl(null);
    const handleAddBranch = async () => {
        if (!branchName) {
            setSnackbar({open: true, message: "Please enter branch name", severity: "error"});
            setBranchNameError(true);
            return;
        }
        setBranchNameError(false);

        if (!branchDescription) {
            setSnackbar({open: true, message: "Please enter branch description", severity: "error"});
            setBranchDescriptionError(true);
            return;
        }

        setBranchDescriptionError(false);

        setLoading(true);
        const params = {
            name: branchName,
            description: branchDescription,
        };

        try {
            const data = await CreateBranch(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Branch created", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const newBranch = {
                    id: data.data.id,
                    name: branchName,
                    description: branchDescription,
                    status: data.data.status?.name ?? "Active",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                    dateCreated: data.data.createdBy,
                    dateUpdated: data.data.updatedBy,
                };

                console.log('newDepartment - ', newBranch)
                setBranchRows((prev) => [newBranch, ...prev]);
                setBranchRowCount((prev) => prev + 1);

                // Optional: clear fields
                setBranchName("");
                setBranchDescription("");
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to create department", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleApproveMenuOpen = (e, row) => {
        e.stopPropagation();
        console.log('--row ', row)
        setBranchSelectedRow(row);
        setOpenApproveDialog(true);
    };

    const handleBranchEditMenuOpen = (e, row) => {
        e.stopPropagation();
        setBranchSelectedRow(row);
        console.log(row)
        setEditBranchFormData({
            id: row.id || "",
            name: row.name || "",
            description: row.description || "",
        });

        setOpenEditModal(true);
    };
    const handleRolesEditClick = () => {
    };

    const handleRolesEditModalClose = () => {
    };

    const handleRolesEditSave = async () => {

    };
    const handleRolesFormChange = (field, value) => {
    };
    // sample rows for DataGrid
    const sampleRows = [
        {id: 1, name: "Admin", type: "System", status: "Active"},
        {id: 2, name: "Manager", type: "Custom", status: "Active"},
    ];
    const columns = [
        {field: "name", headerName: "Name", flex: 1},
        {field: "type", headerName: "Type", flex: 1},
        {field: "status", headerName: "Status", flex: 1},
    ];

    const getStatusChip = (status) => {
        const statusConfig = {
            'PENDING': {
                color: "#B26A00", // warm amber
                bg: "#FFF4E5", // soft orange background
                label: "Pending",
            },
            'ACTIVE': {
                color: "#1B5E20", // deep green
                bg: "#C8E6C9", // minty green background
                label: "Approved",
            },
            'REJECTED': {
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

    const handleEditModalClose = () => {
        setOpenEditModal(false);
        setEditBranchFormData({id: "", name: "", email: "", role: ""});
    };
    const handleEditBranch = async () => {
        if (!editBranchFormData.name) {
            setSnackbar({open: true, message: "Please enter department name", severity: "error"});
            setBranchNameErrorEdit(true);
            return;
        }
        setBranchNameErrorEdit(false);

        if (!editBranchFormData.description) {
            setSnackbar({open: true, message: "Please enter department description", severity: "error"});
            setBranchDescriptionErrorEdit(true);
            return;
        }
        setBranchDescriptionErrorEdit(false);

        setLoading(true);
        const params = {
            id: editBranchFormData.id,
            name: editBranchFormData.name,
            description: editBranchFormData.description,
        };

        try {
            const data = await EditBranch(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Branch updated", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedBranch = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedBranch - ", updatedBranch);

                // ✅ Update the existing row in DataGrid
                setBranchRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedBranch.id ? updatedBranch : row
                    )
                );

                // ✅ Close the dialog
                setOpenEditModal(false);

                // ✅ Optionally reset form
                setEditBranchFormData({
                    id: "",
                    name: "",
                    description: "",
                });
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to create department", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleApproveCloseDialog = () => {
        setOpenApproveDialog(false);
    };

    const handleApprove = () => {
        console.log("Approved:", selectedBranchRow);
        handleApproveSubmit("approve");
    };

    const handleReject = () => {
        console.log("Rejected:", selectedRow);
        handleApproveSubmit("reject");
    };
    const handleApproveSubmit = async (action) => {
        console.log("Approved:-", selectedBranchRow);
        setLoading(true);
        const params = {
            id: selectedBranchRow.id,
            action: action,
        };

        try {
            const data = await UpdateBranch(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Branch updated", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedBranch = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedBranch - ", updatedBranch);

                // ✅ Update the existing row in DataGrid
                setBranchRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedBranch.id ? updatedBranch : row
                    )
                );

                setOpenApproveDialog(false);
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to create branch", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (field, value) => {
        setEditBranchFormData((prev) => ({...prev, [field]: value}));
    };
    const branchColumns = useMemo(() => {
        const cols = [
            {field: "name", headerName: "Name", flex: 1, minWidth: 150},
            {field: "description", headerName: "Description", flex: 1, minWidth: 150},
            {field: "createdBy", headerName: "Created By", flex: 1, minWidth: 150},
            {field: "updatedBy", headerName: "Updated By", flex: 1, minWidth: 150},
            {field: "dateCreated", headerName: "Date Created", flex: 1, minWidth: 150,
                renderCell: (params) => (
                    <span style={{ fontSize: "0.8rem", color: "#555" }}>
                    {params.value}
                  </span>
                ),},
            {field: "dateUpdated", headerName: "Date Updated", flex: 1, minWidth: 150,
                renderCell: (params) => (
                    <span style={{ fontSize: "0.8rem", color: "#555" }}>
                    {params.value}
                  </span>
                ),},
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
        // if (userRole === "ICT_Administrator") {
            cols.push({
                field: "edit",
                headerName: "",
                width: 70,
                sortable: false,
                renderCell: (params) => (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBranchEditMenuOpen(e, params.row);
                        }}
                        size="small"
                    >
                        <Edit2 size="14" color="#116530"/>
                    </IconButton>
                ),
            });
        // } else if (userRole === "ICT_Service_Desk_Checker") {
        } else if (userRole === "ICT_Administrator") {
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

    // Fetch pageable users
    const fetchAllBranches = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = branchSortModel[0]?.field || "id";
            const sortDir = branchSortModel[0]?.sort?.toUpperCase() || "DESC";

            const response = await fetch(
                `http://localhost:8082/api/branch/findAllBranches?start=${branchPaginationModel.page}&length=${branchPaginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('dataBranch--------------- - ', data)

            setBranchRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    name: item.name || "-",
                    description: item.description || "-",
                    createdBy: item.createdBy || "-",
                    updatedBy: item.updatedBy || "-",
                    dateCreated: new Date(item.dateCreated).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }) || "-",
                    dateUpdated: new Date(item.dateUpdated).toLocaleString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                    }) || "-",
                    status: item.status.name || "-",
                }))
            );
            setBranchRowCount(data.totalElements);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    }, [branchPaginationModel, branchSortModel, searchVal]);

    useEffect(() => {
        fetchAllBranches();
    }, [fetchAllBranches]);


    return (
        <Paper elevation={5} sx={{p: 2, borderRadius: 2, backgroundColor: "#fff"}}>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                    justifyContent: "space-between",
                }}
            >
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <Alert
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                        severity={snackbar.severity}
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
                <TextField
                    size="small"
                    label="Branch Name"
                    variant="outlined"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    error={branchNameError}
                    InputProps={{
                        startAdornment:
                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                {/* icon inherits currentColor from the adornment */}
                                <ArchiveAdd size="16"
                                         color={
                                             branchNameError && !branchName
                                                 ? "#d32f2f" // 🔴 red when error
                                                 : "currentColor" // normal color
                                         }/> {/* optional icon */}
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
                            color: "#1976d2",  // keep label black when focused
                        },
                        // 🔹 label when error
                        "& .MuiInputLabel-root.Mui-error": {
                            color: "#d32f2f", // red
                        },
                    }}
                />
                <TextField
                    size="small"
                    label="Branch Description"
                    variant="outlined"
                    value={branchDescription}
                    onChange={(e) => setBranchDescription(e.target.value)}
                    error={branchDescriptionError}
                    InputProps={{
                        startAdornment:
                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                {/* icon inherits currentColor from the adornment */}
                                <Keyboard size="16"
                                         color={
                                             branchDescriptionError && !branchDescription
                                                 ? "#d32f2f" // 🔴 red when error
                                                 : "currentColor" // normal color
                                         }/> {/* optional icon */}
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
                            color: "#1976d2", // keep label black when focused
                        },
                        // 🔹 label when error
                        "& .MuiInputLabel-root.Mui-error": {
                            color: "#d32f2f", // red
                        },
                    }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddBranch}
                    disabled={loading}
                    startIcon={<AddIcon size="18" color="#fff"/>}
                    sx={{
                        height: 37,
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
                    {loading ? <CircularProgress size={20} color="inherit"/> : "Add Branch"}
                </Button>
            </Box>

            <Divider sx={{mb: 2}}/>
            <Box sx={{height: 440}}>
                <DataGrid
                    rows={branchRows}
                    columns={branchColumns}
                    rowCount={branchRowCount}
                    loading={loading}
                    paginationModel={branchPaginationModel}
                    onPaginationModelChange={setBranchPaginationModel}
                    paginationMode="server"
                    sortingMode="server"
                    onSortModelChange={setBranchSortModel}
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
                    anchorEl={rolesAnchorEl}
                    open={Boolean(rolesAnchorEl)}
                    onClose={handleRolesMenuClose}
                >
                    <MenuItem onClick={handleRolesEditClick}>Edit</MenuItem>
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
                        Edit Branch
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>

                            <TextField
                                label="Branch Name"
                                fullWidth
                                type="text"
                                size="small"
                                value={editBranchFormData.name}
                                onChange={(e) =>
                                    setEditBranchFormData({
                                        ...editBranchFormData,
                                        name: e.target.value,
                                    })
                                }
                                error={branchNameErrorEdit}
                                InputProps={{
                                    sx: { fontSize: 14, height: 36,  "&.Mui-focused .MuiInputAdornment-root": {
                                            color: "#1976d2", // MUI default blue
                                        },},
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.700",marginLeft: "-12px", paddingX: "6px"  }}>
                                            <ArchiveTick
                                                size="16"
                                                color={
                                                    branchNameErrorEdit && !editBranchFormData.name
                                                        ? "#d32f2f" // 🔴 red when error
                                                        : "currentColor" // normal color
                                                }
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    sx: { fontSize: 14 },
                                }}
                            />

                            <TextField
                                label="Branch Description"
                                fullWidth
                                type="text"
                                size="small"
                                value={editBranchFormData.description}
                                onChange={(e) =>
                                    setEditBranchFormData({
                                        ...editBranchFormData,
                                        description: e.target.value,
                                    })
                                }
                                error={branchDescriptionErrorEdit}
                                InputProps={{
                                    sx: { fontSize: 14, height: 36,
                                        "&.Mui-focused .MuiInputAdornment-root": {
                                            color: "#1976d2", // MUI default blue
                                        },},
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.700",marginLeft: "-12px", paddingX: "6px"  }}>
                                            <Keyboard
                                                size="16"
                                                color={
                                                    branchDescriptionErrorEdit && !editBranchFormData.description
                                                        ? "#d32f2f" // 🔴 red when error
                                                        : "currentColor" // normal color
                                                }
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    sx: { fontSize: 14 },
                                }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ pr: 3 }}>
                        <Button onClick={handleEditModalClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditBranch}
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
                        Validate Branch
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        {selectedBranchRow && (
                            <Box>
                                <Typography sx={{mb: 3, color: "#555", fontSize: "1.1rem", fontWeight: 800}}>
                                    Confirm branch
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
                                                Name
                                            </Typography>
                                            <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                {selectedBranchRow.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                Description
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#116530",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                {selectedBranchRow.description}
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
                                {selectedBranchRow?.status === 'PENDING' && (
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
                                {selectedBranchRow?.status === 'ACTIVE' && (
                                    <Button
                                        onClick={handleReject}
                                        variant="outlined"
                                        color="error"
                                        sx={{ mr: 1 }}
                                    >
                                        Reject
                                    </Button>
                                )}

                                {selectedBranchRow?.status === 'REJECTED' && (
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
    );
};

export default BranchTab;
