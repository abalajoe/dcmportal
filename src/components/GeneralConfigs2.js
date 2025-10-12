import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import api from "../services/axios";
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
    Autocomplete, Checkbox, FormControlLabel, Typography, Paper, Tooltip, InputAdornment, FormControl, RadioGroup, Radio
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    ProfileTick,
    Profile2User,
    Mirror,
    Sms,
    ShieldSecurity,
    Wallet2,
    Unlock,
    User,
    Category2,
    Cpu, Eye, Hashtag, Judge, Link2, Link1
} from "iconsax-react";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddIcon from "@mui/icons-material/Add";

const GeneralConfigs2 = () => {
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 8,
    });
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
    const [searchVal, setSearchVal] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [error, setError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [emailErrorEdit, setEmailErrorEdit] = useState(false);
    const [emailHelperEdit, setEmailHelperEdit] = useState("");
    const [roleError, setRoleError] = useState(false);
    const [roleHelper, setRoleHelper] = useState("");
    const [branchError, setBranchError] = useState(false);
    const [branchHelper, setBranchHelper] = useState("");
    const [managerError, setManagerError] = useState(false);
    const [managerHelper, setManagerHelper] = useState("");
    const [managerErrorEdit, setManagerErrorEdit] = useState(false);
    const [managerHelperEdit, setManagerHelperEdit] = useState("");
    const [helperText, setHelperText] = useState("");
    const [role, setRole] = useState(null);
    const [category, setCategory] = useState(null);
    const [editFormData, setEditFormData] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    // Fetch pageable users
    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const sortField = sortModel[0]?.field || "id";
            const sortDir = sortModel[0]?.sort?.toUpperCase() || "DESC";

            const response = await fetch(
                `http://localhost:7081/api/accountstatementengine/v1/user/findAllAccountManagement?start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('data - ', data)

            setRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    email: item.email || "-",
                    role: item.role || "-",
                    branch: item.branch || "-",
                    manager: item.manager || "-",
                    createdby: item.createdby || "-",
                    datecreated: new Date(item.datecreated).toLocaleString() || "-",
                    status: item.status || "-",
                }))
            );
            setRowCount(data.totalElements);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    }, [paginationModel, sortModel, searchVal]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Add account
    const handleAddAccount = async () => {
        if (!email || !validateEmail(email)) {
            setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
            setEmailError(true);
            setEmailHelper("Enter a valid email address");
            return;
        }

        // reset email error if valid
        setEmailError(false);
        setEmailHelper("");

        // ✅ Role validation
        if (!role) { // role is your state from Autocomplete
            setSnackbar({ open: true, message: "Please select role", severity: "error" });
            setRoleError(true);
            setRoleHelper("Role is required");
            return;
        }

        // reset role error if valid
        setRoleError(false);
        setRoleHelper("");

        // ✅ Branch validation
        if (!branch) { // role is your state from Autocomplete
            setSnackbar({ open: true, message: "Please select branch", severity: "error" });
            setBranchError(true);
            setBranchHelper("Branch is required");
            return;
        }

        // reset role error if valid
        setBranchError(false);
        setBranchHelper("");

        // ✅ Branch validation
        if (!manager) { // role is your state from Autocomplete
            setSnackbar({ open: true, message: "Please select manager", severity: "error" });
            setManagerError(true);
            setManagerHelper("Manager is required");
            return;
        }

        // reset role error if valid
        setManagerError(false);
        setManagerHelper("");

    };


    // Menu actions
    const handleMenuOpen = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedRow(row);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleEditClick = () => {
        setEditFormData({
            id: selectedRow.id,
            email: selectedRow.email,
            role: selectedRow.role,
            branch: selectedRow.branch,
            manager: selectedRow.manager,
            status: selectedRow.status,
        });
        setOpenEditModal(true);
        handleMenuClose();
    };
    const handleEditModalClose = () => {
        setOpenEditModal(false);
        setEditFormData({ id: "", name: "", email: "", role: "" });
    };

    const handleFormChange = (field, value) => {
        setEditFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSaveChanges = async () => {
        console.log("New values:", editFormData);
        console.log("New values2:", editFormData.email);

        if (!editFormData.email || !validateEmail(editFormData.email)) {
            setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
            setEmailErrorEdit(true);
            setEmailHelperEdit("Enter a valid email address");
            return;
        }

        setEmailErrorEdit(false);
        setEmailHelperEdit("");

        // ✅ Branch validation
        if (!editFormData.manager) { // role is your state from Autocomplete
            setSnackbar({ open: true, message: "Please select manager", severity: "error" });
            setManagerErrorEdit(true);
            setManagerHelperEdit("Manager is required");
            return;
        }

        setManagerErrorEdit(false);
        setManagerHelperEdit("");

        return
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:7081/api/accountstatementengine/v1/user/edit",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editFormData),
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
                throw new Error(errData.message || "Failed to add user");
            }
            await fetchUsers(); // refresh list from server
            setSnackbar({ open: true, message: "Successfully edited user", severity: "success" });
            setRoles("");
            setEmail("");
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
            handleEditModalClose()
        }
    };

    const branchOptions = ["Finance", "IT", "HR", "Sales", "Operations"];
    const roleOptions = ["Admin", "Manager", "User", "Viewer"];
    const parameterCategory = ["Text", "Date"];

    // ✅ Mapping of branch → manager options
    const managerOptionsByBranch = {
        Finance: ["Manager1", "Manager2"],
        IT: ["Manager3", "Manager4"],
        HR: ["Manager5", "Manager6"],
        Sales: ["Manager7", "Manager8"],
        Operations: ["Manager9", "Manager10"],
    };

    const [branch, setBranch] = useState(null);
    const [manager, setManager] = useState(null);
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);

    // 🔹 When branch changes → reset manager + load new options
    useEffect(() => {
        if (branch) {
            setLoadingManagers(true);
            setManager(null);
            // simulate async fetch
            setTimeout(() => {
                setManagers(managerOptionsByBranch[branch] || []);
                setLoadingManagers(false);
            }, 300);
        } else {
            setManagers([]);
            setManager(null);
        }
    }, [branch]);


    // Add these states near the top of your component
    const [editManagerOptions, setEditManagerOptions] = useState([]);
    const [editLoadingManagers, setEditLoadingManagers] = useState(false);

// Watch for branch change inside edit form
    useEffect(() => {
        if (editFormData.branch) {
            setEditLoadingManagers(true);
            // Simulate API fetch for managers by branch
            setTimeout(() => {
                setEditManagerOptions(managerOptionsByBranch[editFormData.branch] || []);
                setEditLoadingManagers(false);
            }, 300);
        } else {
            setEditManagerOptions([]);
        }
    }, [editFormData.branch]);

    const columns = [
        { field: "email", headerName: "Parameter", flex: 1, minWidth: 150 },
        { field: "role", headerName: "Value", flex: 1, minWidth: 150 },
        { field: "branch", headerName: "Type", flex: 1, minWidth: 150 },
    ];

    return (
        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                pt: { xs: 0, sm: 0, md: 0 },
                px: { xs: 1, sm: 2, md: 3 },
                pb: { xs: 2, sm: 3, md: 5 },
                fontFamily: "'SUSE', sans-serif",
            }}
        >
            {/* Page Header */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#116530", mb: 0.5 }}
                >
                    Global Configs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage global configurations & settings
                </Typography>
            </Box>

            {/* Filter + Add Button Section */}
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
                        options={roleOptions}
                        size="small"
                        value={role}
                        onChange={(event, newValue) => setRole(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Parameter Type"
                                error={roleError && !role} // ✅ Pass error here
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment:
                                        <InputAdornment position="start" sx={{ color: "grey.500" }}>
                                            {/* icon inherits currentColor from the adornment */}
                                            <Link2 size="18" color="currentColor" />
                                        </InputAdornment>,
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
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
                        options={parameterCategory}
                        size="small"
                        value={category}
                        onChange={(event, newValue) => setRole(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Parameter Category"
                                error={roleError && !role} // ✅ Pass error here
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment:
                                        <InputAdornment position="start" sx={{ color: "grey.500" }}>
                                            {/* icon inherits currentColor from the adornment */}
                                            <Link1 size="18" color="currentColor" />
                                        </InputAdornment>,
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError}
                        InputProps={{
                            startAdornment:
                                <InputAdornment position="start" sx={{ color: "grey.500" }}>
                                    {/* icon inherits currentColor from the adornment */}
                                    <Hashtag size="18" color="currentColor" />
                                </InputAdornment>,
                        }}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
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

                {/* Add User Button */}
                <Tooltip title="Add a new user">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddAccount}
                        sx={{
                            background: "linear-gradient(90deg, #116530, #1b7a3e)",
                            textTransform: "none",
                            fontWeight: 600,
                            height: 35,
                            px: 3,
                            py: 1,
                            boxShadow: 2,
                            fontSize: "0.9rem",
                            "&:hover": { background: "#0d4d24" },
                            minWidth: "150px",
                        }}
                    >
                        Add Config
                    </Button>
                </Tooltip>
            </Paper>

            {/* 🔍 Data Table + Search */}
            <Paper
                elevation={3}
                sx={{
                    p: 1,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                }}
            >
                {/* 🔍 Search Field above DataGrid */}
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        label="Search..."
                        variant="outlined"
                        size="small"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: "250px" },
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />
                </Box>

                <Box sx={{ height: 440, width: "100%" }}>
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
                                    <CircularProgress />
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
                        fullWidth
                    >
                        <DialogTitle><b>Edit Account Management</b></DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                                {/* Email */}
                                <TextField
                                    label="Email"
                                    fullWidth
                                    type="email"
                                    value={editFormData.email}
                                    error={emailErrorEdit}
                                    onChange={(e) => handleFormChange("email", e.target.value)}
                                />

                                {/* Role */}
                                <Autocomplete
                                    options={roleOptions}
                                    value={editFormData.role || ""}
                                    onChange={(e, newValue) => handleFormChange("role", newValue || "")}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Role" variant="outlined" fullWidth />
                                    )}
                                />

                                {/* Branch */}
                                <Autocomplete
                                    options={branchOptions}
                                    value={editFormData.branch || ""}
                                    onChange={(e, newValue) => {
                                        handleFormChange("branch", newValue || "");
                                        handleFormChange("manager", ""); // reset manager
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Branch" variant="outlined" fullWidth />
                                    )}
                                />

                                {/* Manager */}
                                <Autocomplete
                                    options={editManagerOptions}
                                    value={editFormData.manager || ""}
                                    onChange={(e, newValue) => handleFormChange("manager", newValue || "")}
                                    loading={editLoadingManagers}
                                    disabled={!editFormData.branch}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Manager"
                                            variant="outlined"
                                            error={managerErrorEdit && editFormData.manager === ""}
                                            fullWidth
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {editLoadingManagers ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
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
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditModalClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveChanges}
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} /> : "Save Changes"}
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </Paper>
        </Box>
    );
};

export default GeneralConfigs2;
