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
    InputAdornment, Divider, Menu, MenuItem, DialogActions, Typography, Paper, Chip, IconButton, Slide, Autocomplete
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {Data, Edit2, InfoCircle, Keyboard, Profile, Settings, Receipt1} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";
import {CreateDept, CreateRole, EditDept, EditRole, FetchDepartments, UpdateDept, UpdateRole} from "../services/Api";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const RolesTab = () => {
    const userRole = localStorage.getItem("role");
    const [roleName, setRoleName] = useState("");
    const [roleDescription, setRoleDescription] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [departmentNameEdit, setDeparmentNameEdit] = useState("");
    const [departmentDescriptionEdit, setDeparmentDescriptionEdit] = useState("");
    const [departmentNameError, setRoleNameError] = useState(false);
    const [departmentDescriptionError, setRoleDescriptionError] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [searchVal, setSearchVal] = useState("");
    const [rowsRoles, setRowsRoles] = useState([]);
    const [rowRolesCount, setRowRolesCount] = useState(0); // total elements from backend
    const [openRolesEditModal, setOpenRolesEditModal] = useState(false);
    const [roleDescriptionErrorEdit, setroleDescriptionErrorEdit] = useState(false);
    const [roleNameErrorEdit, setroleNameErrorEdit] = useState(false);
    const [departmentSortModel, setSortModel] = useState([{field: "id", sort: "desc"}]);
    const [departmentRows, setDepartmentRows] = useState([]);
    const [rolesRows, setRolesRows] = useState([]);
    const [departmentRowCount, setDepartmentRowCount] = useState(0); // total elements from backend
    const [rolesRowCount, setRolesRowCount] = useState(0); // total elements from backend
    const [selectedDepartmentRow, setRoleSelectedRow] = useState(null);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [departmentPaginationModel, setDepartmentPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [departments, setDepartments] = useState([]);
    const [departments2, setDepartments2] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editRoleFormData, setEditRoleFormData] = useState({
        id: "",
        name: "",
        description: "",
        department: null,
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
    const [selectedDepartment, setselectedDepartment] = useState(null);
    const [departmentError, setdepartmentError] = useState(false);
    const [loadingDepartments, setloadingDepartments] = useState(false);
    const handleAddRole = async () => {
        if (!roleName) {
            setSnackbar({open: true, message: "Please enter role name", severity: "error"});
            setRoleNameError(true);
            return;
        }

        setRoleNameError(false);

        if (!selectedDepartment) {
            setSnackbar({open: true, message: "Please enter department", severity: "error"});
            setdepartmentError(true);
            return;
        }

        console.log('selectedDepartment - ', selectedDepartment)
        setdepartmentError(false);

        if (!roleDescription) {
            setSnackbar({open: true, message: "Please enter role description", severity: "error"});
            setRoleDescriptionError(true);
            return;
        }

        setRoleDescriptionError(false);

        setLoading(true);
        const params = {
            name: roleName,
            description: roleDescription,
            department: selectedDepartment.id,
        };

        try {
            const data = await CreateRole(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)
            console.log("data2department - ",data.data.department)
            console.log("data2name - ",data.data.department.name)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const newRole = {
                    id: data.data.id,
                    name: roleName,
                    description: roleDescription,
                    department: data.data.department.name,
                    status: data.data.status?.name ?? "Active",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                    dateCreated: data.data.createdBy,
                    dateUpdated: data.data.updatedBy,
                };

                console.log('newRole - ', newRole)

                setRolesRows((prev) => [newRole, ...prev]);
                setRolesRowCount((prev) => prev + 1);
                // Optional: clear fields
                setRoleName("");
                setRoleDescription("");
                setselectedDepartment(null);
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
        setRoleSelectedRow(row);
        setOpenApproveDialog(true);
    };

    const handleRolesEditClick = () => {
    };

    const handleRolesEditModalClose = () => {
    };

    const handleRolesEditSave = async () => {

    };
    const handleRolesFormChange = (field, value) => {
    };

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
        setEditRoleFormData({id: "", name: "", description: "", department: null});
    };
    const handleEditRole = async () => {
        console.log('editRoleFormData = ', editRoleFormData)
        if (!editRoleFormData.name) {
            setSnackbar({open: true, message: "Please enter name", severity: "error"});
            setroleNameErrorEdit(true);
            return;
        }
        setroleNameErrorEdit(false);

        if (!editRoleFormData.description) {
            setSnackbar({open: true, message: "Please enter description", severity: "error"});
            setroleDescriptionErrorEdit(true);
            return;
        }
        setroleDescriptionErrorEdit(false);

        setLoading(true);
        const params = {
            id: editRoleFormData.id,
            name: editRoleFormData.name,
            department: editRoleFormData.department.id,
            description: editRoleFormData.description,
        };
        console.log('editRoleFormDataparams = ', params)
        try {
            const data = await EditRole(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedRole = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    department: data.data.department.name,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedRole - ", updatedRole);

                // ✅ Update the existing row in DataGrid
                setRolesRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedRole.id ? updatedRole : row
                    )
                );

                // ✅ Close the dialog
                setOpenEditModal(false);

                // ✅ Optionally reset form
                setEditRoleFormData({
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
        console.log("Approved:", selectedDepartmentRow);
        handleApproveSubmit("approve");
    };

    const handleReject = () => {
        console.log("Rejected:", selectedRow);
        handleApproveSubmit("reject");
    };
    const handleApproveSubmit = async (action) => {
        console.log("Approved:", selectedDepartmentRow);
        setLoading(true);
        const params = {
            id: selectedDepartmentRow.id,
            action: action,
        };

        try {
            const data = await UpdateRole(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedRole = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    department: data.data.department.name,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedDepartment - ", updatedRole);

                // ✅ Update the existing row in DataGrid
                setRolesRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedRole.id ? updatedRole : row
                    )
                );

                setOpenApproveDialog(false);
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to create department", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleFormChange = (field, value) => {
        setEditRoleFormData((prev) => ({...prev, [field]: value}));
    };

    const handleRoleEditMenuOpen = useCallback((e, row) => {
        e.stopPropagation();
        console.log('rowRoles05 - ', departments2);

        const departmentObj = departments2.find(dept => dept.name === row.department);

        console.log('departmentObj220983 >>> ', departmentObj);

        setEditRoleFormData({
            id: row.id || "",
            name: row.name || "",
            description: row.description || "",
            department: departmentObj || null,
        });

        setOpenEditModal(true);
    }, [departments2]); // ✅ ADD departments2 to dependency array
    const rolesColumns = useMemo(() => {
        const cols = [
            {field: "name", headerName: "Name", flex: 1, minWidth: 150},
            {field: "department", headerName: "Department", flex: 1, minWidth: 150},
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
        if (userRole === "ICT_Service_Desk_Checker") {
            cols.push({
                field: "edit",
                headerName: "",
                width: 70,
                sortable: false,
                renderCell: (params) => (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRoleEditMenuOpen(e, params.row);
                        }}
                        size="small"
                    >
                        <Edit2 size="14" color="#116530"/>
                    </IconButton>
                ),
            });
        } else if (userRole === "ICT_Service_Desk_Maker") {
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
    }, [userRole, handleRoleEditMenuOpen]);

    // Fetch pageable users
    const fetchAllRoles = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = departmentSortModel[0]?.field || "id";
            const sortDir = departmentSortModel[0]?.sort?.toUpperCase() || "DESC";

            const response = await fetch(
                `http://localhost:8082/api/role/findAllRole?start=${departmentPaginationModel.page}&length=${departmentPaginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('dataRole ----------------------------------- ', data)

            setRolesRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    name: item.name || "-",
                    description: item.description || "-",
                    department: item.department.name || "-",
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
            setRolesRowCount(data.totalElements);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    }, [departmentPaginationModel, departmentSortModel, searchVal]);

    useEffect(() => {
        fetchAllRoles();
    }, [fetchAllRoles]);

    useEffect(() => {
        const loadDepartments = async () => {
            setLoading(true);
            try {
                const data = await FetchDepartments();
                console.log('depts303 - ', data)
                //setDepartments(data);
                setDepartments2(data);
            } catch (error) {
                setSnackbar({ open: true, message: "Failed to fetch departments", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        loadDepartments();
    }, []);

    return (
        <Paper elevation={5} sx={{p: 2, borderRadius: 2, backgroundColor: "#fff"}}>
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
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    mb: 2,
                    justifyContent: "space-between",
                }}
            >
                <TextField
                    size="small"
                    label="Role Name"
                    variant="outlined"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    error={departmentNameError}
                    InputProps={{
                        startAdornment:
                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                {/* icon inherits currentColor from the adornment */}
                                <Profile size="16"
                                            color={
                                                departmentNameError && !roleName
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

                <Autocomplete
                    options={departments2} // 👈 departments is your fetched list
                    value={selectedDepartment}
                    onChange={(e, newValue) => setselectedDepartment(newValue)}
                    getOptionLabel={(option) => option?.name || ""} // 👈 show department name
                    loading={loadingDepartments}
                    size="small"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Department"
                            error={departmentError && !selectedDepartment}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ color: "grey.500" }}>
                                        <Data size="16"
                                                  color={
                                                      departmentError && !selectedDepartment
                                                          ? "#d32f2f" // 🔴 red when error
                                                          : "currentColor" // normal color
                                                  }/> {/* optional icon */}
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <>
                                        {loadingDepartments ? <CircularProgress size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                    sx={{
                        flex: 1,
                        minWidth: "220px",
                        "& .MuiInputBase-input": { fontSize: "0.9rem" },
                        "& .MuiInputLabel-root": { fontSize: "1.0rem", color: "black" },
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
                    label="Role Description"
                    variant="outlined"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                    error={departmentDescriptionError}
                    InputProps={{
                        startAdornment:
                            <InputAdornment position="start" sx={{color: "grey.500"}}>
                                {/* icon inherits currentColor from the adornment */}
                                <Keyboard size="18"
                                          color={
                                              departmentDescriptionError && !roleDescription
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
                <Button
                    variant="contained"
                    onClick={handleAddRole}
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
                    {loading ? <CircularProgress size={20} color="inherit"/> : "Add Role"}
                </Button>
            </Box>

            <Divider sx={{mb: 2}}/>
            <Box sx={{height: 440}}>
                <DataGrid
                    rows={rolesRows}
                    columns={rolesColumns}
                    rowCount={rolesRowCount}
                    loading={loading}
                    paginationModel={departmentPaginationModel}
                    onPaginationModelChange={setDepartmentPaginationModel}
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
                        Edit Role
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>

                            {/* Name */}
                            <TextField
                                label="Role Name"
                                fullWidth
                                type="text"
                                size="small"
                                value={editRoleFormData.name}
                                onChange={(e) =>
                                    setEditRoleFormData({
                                        ...editRoleFormData,
                                        name: e.target.value,
                                    })
                                }
                                error={roleNameErrorEdit}
                                InputProps={{
                                    sx: { fontSize: 14, height: 36 },
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.700",marginLeft: "-12px", paddingX: "6px"  }}>
                                            <Profile
                                                size="16    "
                                                color={
                                                    roleNameErrorEdit && !editRoleFormData.name
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

                            <Autocomplete
                                options={departments2}
                                value={editRoleFormData.department} // ✅ CHANGED from .name to .department
                                onChange={(e, newValue) => {
                                    setEditRoleFormData({
                                        ...editRoleFormData,
                                        department: newValue,
                                    });
                                }}
                                getOptionLabel={(option) => option?.name || ""}
                                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                                loading={loadingDepartments}
                                size="small"
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Department"
                                        error={departmentError && !editRoleFormData.department}
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Data
                                                        size="16"
                                                        color={
                                                            departmentError && !editRoleFormData.department
                                                                ? "#d32f2f"
                                                                : "currentColor"
                                                        }
                                                    />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <>
                                                    {loadingDepartments ? <CircularProgress size={20} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                                sx={{
                                    flex: 1,
                                    minWidth: "220px",
                                    "& .MuiInputBase-input": { fontSize: "0.9rem" },
                                    "& .MuiInputLabel-root": { fontSize: "1.0rem", color: "black" },
                                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                                    "& .MuiInputLabel-root.Mui-error": {
                                        color: "#d32f2f !important",
                                    },
                                    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#d32f2f !important",
                                    },
                                }}
                            />

                            {/* Name */}
                            <TextField
                                label="Role Description"
                                fullWidth
                                type="text"
                                size="small"
                                value={editRoleFormData.description}
                                onChange={(e) =>
                                    setEditRoleFormData({
                                        ...editRoleFormData,
                                        description: e.target.value,
                                    })
                                }
                                error={roleNameErrorEdit}
                                InputProps={{
                                    sx: { fontSize: 14, height: 36 },
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.700",marginLeft: "-12px", paddingX: "6px"  }}>
                                            <Receipt1
                                                size="16"
                                                color={
                                                    roleNameErrorEdit && !editRoleFormData.name
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
                            onClick={handleEditRole}
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
                        Validate Role
                    </DialogTitle>
                    <DialogContent sx={{mt: 3, pb: 2}}>
                        {selectedDepartmentRow && (
                            <Box>
                                <Typography sx={{mb: 3, color: "#555", fontSize: "1.1rem", fontWeight: 800}}>
                                    Confirm role
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
                                                {selectedDepartmentRow.name}
                                            </Typography>
                                        </Box>
                                        <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                            <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                Department
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontWeight: 600,
                                                    color: "#116530",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                {selectedDepartmentRow.department}
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
                                                {selectedDepartmentRow.description}
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
                                {selectedDepartmentRow?.status === 'PENDING' && (
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
                                {selectedDepartmentRow?.status === 'ACTIVE' && (
                                    <Button
                                        onClick={handleReject}
                                        variant="outlined"
                                        color="error"
                                        sx={{ mr: 1 }}
                                    >
                                        Reject
                                    </Button>
                                )}

                                {selectedDepartmentRow?.status === 'REJECTED' && (
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

export default RolesTab;
