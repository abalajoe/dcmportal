import React, {useState, useEffect, useCallback} from "react";
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
    Autocomplete, Checkbox, FormControlLabel, Typography, Paper, Tooltip, InputAdornment, Fade, Chip, Slide
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Profile2User,
    Sms,
    Wallet2,
    Edit2,
    User,
    SearchNormal1, Settings
} from "iconsax-react";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import AddIcon from "@mui/icons-material/Add";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const AccountManagementCreate = () => {
    const [email, setEmail] = useState("");
    const [roles, setRoles] = useState("");
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
                `http://localhost:8082/api/accountstatementengine/v1/user/findAllAccountManagement?start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
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
            setSnackbar({open: true, message: "Please enter a valid email address", severity: "error"});
            setEmailError(true);
            setEmailHelper("Enter a valid email address");
            return;
        }

        // reset email error if valid
        setEmailError(false);
        setEmailHelper("");

        // ✅ Role validation
        if (!role) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select role", severity: "error"});
            setRoleError(true);
            setRoleHelper("Role is required");
            return;
        }

        // reset role error if valid
        setRoleError(false);
        setRoleHelper("");

        // ✅ Branch validation
        if (!branch) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select branch", severity: "error"});
            setBranchError(true);
            setBranchHelper("Branch is required");
            return;
        }

        // reset role error if valid
        setBranchError(false);
        setBranchHelper("");

        // ✅ Branch validation
        if (!manager) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select manager", severity: "error"});
            setManagerError(true);
            setManagerHelper("Manager is required");
            return;
        }

        // reset role error if valid
        setManagerError(false);
        setManagerHelper("");

    };


    // Menu actions
    // const handleMenuOpen = (event, row) => {
    //     setAnchorEl(event.currentTarget);
    //     setSelectedRow(row);
    // };
    const [openDialog, setOpenDialog] = useState(false);
    const handleMenuOpen = (e, row) => {
        e.stopPropagation();
        setSelectedRow(row);

        setEditFormData({
            id: row.id || "",
            email: row.email || "",
            role: row.role || "",
            branch: row.branch || "",
            manager: row.manager || "",
            status: row.status || "",
        });
        setOpenEditModal(true);
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
        setEditFormData({id: "", name: "", email: "", role: ""});
    };

    const handleFormChange = (field, value) => {
        setEditFormData((prev) => ({...prev, [field]: value}));
    };

    const handleSaveChanges = async () => {
        console.log("New values:", editFormData);
        console.log("New values2:", editFormData.email);

        if (!editFormData.email || !validateEmail(editFormData.email)) {
            setSnackbar({open: true, message: "Please enter a valid email address", severity: "error"});
            setEmailErrorEdit(true);
            setEmailHelperEdit("Enter a valid email address");
            return;
        }

        setEmailErrorEdit(false);
        setEmailHelperEdit("");

        // ✅ Branch validation
        if (!editFormData.manager) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please select manager", severity: "error"});
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
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(editFormData),
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                setSnackbar({open: true, message: "Something went wrong", severity: "error"});
                throw new Error(errData.message || "Failed to add user");
            }
            await fetchUsers(); // refresh list from server
            setSnackbar({open: true, message: "Successfully edited user", severity: "success"});
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
        {field: "email", headerName: "Email Address", flex: 1, minWidth: 150},
        {field: "role", headerName: "Role", flex: 1, minWidth: 150},
        {field: "branch", headerName: "Branch", flex: 1, minWidth: 150},
        {field: "manager", headerName: "Manager", flex: 1, minWidth: 150},
        {field: "createdby", headerName: "Created By", flex: 1, minWidth: 150},
        {field: "datecreated", headerName: "Date Created", flex: 1, minWidth: 150},
        {
            field: "status",
            headerName: "Status",
            flex: 0.8,
            minWidth: 100,
            renderCell: (params) => getStatusChip(params.value),
        },
        {
            field: "actions",
            headerName: "",
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
                    <Edit2 size="14" color="#116530"/>
                </IconButton>
            ),
        },
    ];


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
            {/* Page Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "#116530", mb: 0.5}}
                    >
                        Account Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage system users, roles, and permissions.
                    </Typography>
                </Box>
            </Fade>
            {/* Filter + Add Button Section */}
            <Fade in={true} timeout={1200}>
                <Paper
                    elevation={5}
                    sx={{
                        p: 2,
                        mb: 2,
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
                        {/* Email Address */}
                        <TextField
                            size="small"
                            label="Email Address"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={emailError}
                            InputProps={{
                                startAdornment:
                                    <InputAdornment position="start" sx={{color: "grey.500"}}>
                                        {/* icon inherits currentColor from the adornment */}
                                        <Sms size="18" color="currentColor"/>
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

                        {/* Role */}
                        <Autocomplete
                            options={roleOptions}
                            size="small"
                            value={role}
                            onChange={(event, newValue) => setRole(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Role"
                                    error={roleError && !role} // ✅ Pass error here
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment:
                                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                                {/* icon inherits currentColor from the adornment */}
                                                <User size="18" color="currentColor"/>
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

                        {/* Branch */}
                        <Autocomplete
                            options={branchOptions}
                            size="small"
                            value={branch}
                            onChange={(e, newValue) => setBranch(newValue)}
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Branch"
                                    error={branchError && !branch} // ✅ Pass error here
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment:
                                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                                {/* icon inherits currentColor from the adornment */}
                                                <Wallet2 size="18" color="currentColor"/>
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

                        {/* Manager */}
                        <Autocomplete
                            options={managers}
                            value={manager}
                            onChange={(e, newValue) => setManager(newValue)}
                            getOptionLabel={(option) => option}
                            loading={loadingManagers}
                            disabled={!branch}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Manager"
                                    error={managerError && !manager} // ✅ Pass error here
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment:
                                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                                {/* icon inherits currentColor from the adornment */}
                                                <Profile2User size="18" color="currentColor"/>
                                            </InputAdornment>,
                                        endAdornment: (
                                            <>
                                                {loadingManagers ? <CircularProgress size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
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
                    </Box>

                    {/* Add User Button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon/>}
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
                            "&:hover": {background: "#0d4d24"},
                            minWidth: "150px",
                        }}
                    >
                        Add User
                    </Button>
                </Paper>
            </Fade>
            {/* 🔍 Data Table + Search */}
            <Fade in={true} timeout={1600}>
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

                    <Box sx={{height: 480, width: "100%"}}>
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
                                Edit Account Management
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>
                                    {/* Email */}
                                    <TextField
                                        label="Email"
                                        fullWidth
                                        type="email"
                                        size="small"
                                        value={editFormData.email}
                                        error={emailErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: { fontSize: 14 }, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleFormChange("email", e.target.value)}
                                    />

                                    {/* Role */}
                                    <Autocomplete
                                        options={roleOptions}
                                        value={editFormData.role || ""}
                                        size="small"
                                        onChange={(e, newValue) => handleFormChange("role", newValue || "")}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Role" variant="outlined"
                                                       sx={{
                                                           "& .MuiInputBase-input": { fontSize: 14 }, // input text
                                                           "& .MuiInputLabel-root": { fontSize: 14 }, // label text
                                                       }}
                                                       fullWidth/>
                                        )}
                                    />

                                    {/* Branch */}
                                    <Autocomplete
                                        options={branchOptions}
                                        value={editFormData.branch || ""}
                                        size="small"
                                        onChange={(e, newValue) => {
                                            handleFormChange("branch", newValue || "");
                                            handleFormChange("manager", ""); // reset manager
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Branch" variant="outlined"
                                                       sx={{
                                                           "& .MuiInputBase-input": { fontSize: 14 }, // input text
                                                           "& .MuiInputLabel-root": { fontSize: 14 }, // label text
                                                       }}
                                                       fullWidth/>
                                        )}
                                    />

                                    {/* Manager */}
                                    <Autocomplete
                                        options={editManagerOptions}
                                        value={editFormData.manager || ""}
                                        size="small"
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
                                                sx={{
                                                    "& .MuiInputBase-input": { fontSize: 14 }, // input text
                                                    "& .MuiInputLabel-root": { fontSize: 14 }, // label text
                                                }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {editLoadingManagers ? <CircularProgress size={20}/> : null}
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
                                    onClick={handleSaveChanges}
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={20}/> : "Save Changes"}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default AccountManagementCreate;
