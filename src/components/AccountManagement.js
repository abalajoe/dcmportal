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
    Autocomplete, Checkbox, FormControlLabel
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const AccountManagement = () => {
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState("");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
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


        //
        // setLoading(true);
        // const newUser = { email: email.toLowerCase(), role: "Admin" };
        //
        // try {
        //     const response = await fetch(
        //         "http://localhost:7081/api/accountstatementengine/v1/user/findAllAccountManagement",
        //         {
        //             method: "POST",
        //             headers: { "Content-Type": "application/json" },
        //             body: JSON.stringify(newUser),
        //         }
        //     );
        //     if (!response.ok) {
        //         const errData = await response.json();
        //         setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
        //         throw new Error(errData.message || "Failed to add user");
        //     }
        //     await fetchUsers(); // refresh list from server
        //     setSnackbar({ open: true, message: "Successfully added user", severity: "success" });
        //     setRoles("");
        //     setEmail("");
        // } catch (err) {
        //     console.error("Add user error:", err);
        //     alert(err.message);
        // } finally {
        //     setLoading(false);
        // }
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
        { field: "email", headerName: "Email Address", flex: 1, minWidth: 150 },
        { field: "role", headerName: "Role", flex: 1, minWidth: 150 },
        { field: "branch", headerName: "Branch", flex: 1, minWidth: 150 },
        { field: "manager", headerName: "Manager", flex: 1, minWidth: 150 },
        { field: "createdby", headerName: "Created By", flex: 1, minWidth: 150 },
        { field: "datecreated", headerName: "Date Created", flex: 1, minWidth: 150 },
        { field: "status", headerName: "Status", flex: 1, minWidth: 150 },
        {
            field: "actions",
            headerName: "Action",
            width: 70,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => {
                        e.stopPropagation();
                        handleMenuOpen(e, params.row);
                    }}
                    size="small"
                >
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{
                pt: 2,  // padding-top
                pb: 3,  // padding-bottom
                pl: 2,  // padding-left
                pr: 1,  // padding-right
            }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "1000px",
                    mx: "auto",
                    width: "100%",
                    flexWrap: "wrap",
                }}
            >
                {/* Snackbar */}
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

                {/* Email Field */}
                <TextField
                    label="Email Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    // helperText={emailHelper}
                    sx={{ "& .MuiInputBase-root": { height: 40 }, flex: 1 }}
                />

                {/* Role Autocomplete */}
                <Autocomplete
                    options={roleOptions}
                    value={role}
                    onChange={(event, newValue) => setRole(newValue)}
                    renderInput={(params) => (
                        <TextField {...params}
                                   label="Role"
                                   variant="outlined"
                                   size="small"
                                   error={roleError && !role} // ✅ Pass error here
                                   sx={{ "& .MuiInputBase-root": { height: 40 } }}
                        />
                    )}
                    sx={{
                        flex: 1,
                        "& .MuiInputBase-root": { height: 40 },
                        minWidth: { xs: "100%", sm: "auto" },
                    }}
                    fullWidth
                />

                {/* Department Autocomplete */}
                <Autocomplete
                    options={branchOptions}
                    value={branch}
                    onChange={(e, newValue) => setBranch(newValue)}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                        <TextField {...params}
                                   label="Branch"
                                   variant="outlined"
                                   size="small"
                                   error={branchError && !branch} // ✅ Pass error here
                                   sx={{ "& .MuiInputBase-root": { height: 40 } }}/>
                    )}
                    sx={{
                        flex: 1,
                        "& .MuiInputBase-root": { height: 40 },
                        minWidth: { xs: "100%", sm: "auto" },
                    }}
                    fullWidth
                />

                {/* ✅ Manager Autocomplete (Dynamic) */}

                    <Autocomplete
                        value={manager}
                        onChange={(e, newValue) => setManager(newValue)}
                        options={managers}
                        getOptionLabel={(option) => option}
                        loading={loadingManagers}
                        disabled={!branch}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Manager"
                                variant="outlined"
                                size="small"
                                error={managerError && !manager} // ✅ Pass error here
                                sx={{ "& .MuiInputBase-root": { height: 40 } }}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingManagers ? <CircularProgress size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            "& .MuiInputBase-root": { height: 40 },
                            minWidth: { xs: "100%", sm: "auto" },
                        }}
                        fullWidth
                    />


                {/* Add Button */}
                <Button
                    variant="contained"
                    onClick={handleAddAccount}
                    disabled={loading}
                    sx={{
                        height: 38,
                        minWidth: 150,
                        width: { xs: "100%", sm: "auto" },
                        textTransform: "none",
                        mt: -0.2,
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Add User"}
                </Button>
            </Box>

            {/* 🔍 Global Filter Bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    mb: 2,
                    mt: 1
                }}
            >
                <TextField
                    label="Search"
                    variant="standard"
                    size="small"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}

                    sx={{ width: 250 }}
                />
            </Box>
            <Box sx={{ height: 520, width: "100%" }}>
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
            </Box>

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
                <DialogTitle>Edit Account Management</DialogTitle>
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
    );
};

export default AccountManagement;
