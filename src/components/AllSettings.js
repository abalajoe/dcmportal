import React, {useCallback, useEffect, useMemo, useState} from "react";
import {
    Box,
    Tabs,
    Tab,
    Paper,
    Typography,
    Fade,
    Divider,
    Button,
    TextField,
    InputAdornment,
    CircularProgress,
    Autocomplete,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    FormControlLabel,
    Checkbox,
    DialogActions, Slide, Chip, Snackbar, Alert, IconButton,
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
    SearchNormal1,
    Hashtag,
    Link2,
    Link1,
    UserEdit,
    Keyboard,
    Setting4, Cpu, Profile2User, Save2, Firstline, Data, Sms, InfoCircle, Edit2,Settings,
} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";
import {AccountSmtAPI, CreateDept, EditDept, UpdateDept} from "../services/Api";
import DepartmentTab from "./DepartmentTab";
import RolesTab from "./RolesTab";

const RolesTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function TabPanel({children, value, index}) {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && (
                <Fade in={true} timeout={500}>
                    <Box sx={{py: 2}}>{children}</Box>
                </Fade>
            )}
        </div>
    );
}
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const AllSettings = () => {
    const userRole = localStorage.getItem("role");
    const [departmentName, setDeparmentName] = useState("");
    const [departmentDescription, setDeparmentDescription] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);
    const [departmentNameEdit, setDeparmentNameEdit] = useState("");
    const [departmentDescriptionEdit, setDeparmentDescriptionEdit] = useState("");
    const [departmentNameError, setDepartmentNameError] = useState(false);
    const [departmentDescriptionError, setDepartmentDescriptionError] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [searchVal, setSearchVal] = useState("");
    const [rowsRoles, setRowsRoles] = useState([]);
    const [rowRolesCount, setRowRolesCount] = useState(0); // total elements from backend
    const [openRolesEditModal, setOpenRolesEditModal] = useState(false);
    const [departmentDescriptionErrorEdit, setDepartmentDescriptionErrorEdit] = useState(false);
    const [departmentNameErrorEdit, setDepartmentNameErrorEdit] = useState(false);
    const [departmentSortModel, setDepartmentSortModel] = useState([{field: "id", sort: "desc"}]);
    const [departmentRows, setDepartmentRows] = useState([]);
    const [departmentRowCount, setDepartmentRowCount] = useState(0); // total elements from backend
    const [selectedDepartmentRow, setDepartmentSelectedRow] = useState(null);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [departmentPaginationModel, setDepartmentPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editDepartmentFormData, setEditDepartmentFormData] = useState({
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
    const handleAddDepartment = async () => {
        if (!departmentName) {
            setSnackbar({open: true, message: "Please enter name", severity: "error"});
            setDepartmentNameError(true);
            return;
        }
        setDepartmentNameError(false);

        if (!departmentDescription) {
            setSnackbar({open: true, message: "Please enter description", severity: "error"});
            setDepartmentDescriptionError(true);
            return;
        }

        setDepartmentDescriptionError(false);

        setLoading(true);
        const params = {
            name: departmentName,
            description: departmentDescription,
        };

        try {
            const data = await CreateDept(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const newDepartment = {
                    id: data.data.id,
                    name: departmentName,
                    description: departmentDescription,
                    status: data.data.status?.name ?? "Active",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                    dateCreated: data.data.createdBy,
                    dateUpdated: data.data.updatedBy,
                };

                console.log('newDepartment - ', newDepartment)

                setDepartmentRows((prev) => [newDepartment, ...prev]);

                // Optional: clear fields
                setDeparmentName("");
                setDeparmentDescription("");
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
        setDepartmentSelectedRow(row);
        setOpenApproveDialog(true);
    };

    const handleDepartmentEditMenuOpen = (e, row) => {
        e.stopPropagation();
        setDepartmentSelectedRow(row);
        console.log(row)
        setEditDepartmentFormData({
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
        setEditDepartmentFormData({id: "", name: "", email: "", role: ""});
    };
    const handleEditDepartment = async () => {
        if (!editDepartmentFormData.name) {
            setSnackbar({open: true, message: "Please enter name", severity: "error"});
            setDepartmentNameErrorEdit(true);
            return;
        }
        setDepartmentNameErrorEdit(false);

        if (!editDepartmentFormData.description) {
            setSnackbar({open: true, message: "Please enter description", severity: "error"});
            setDepartmentDescriptionErrorEdit(true);
            return;
        }
        setDepartmentDescriptionErrorEdit(false);

        setLoading(true);
        const params = {
            id: editDepartmentFormData.id,
            name: editDepartmentFormData.name,
            description: editDepartmentFormData.description,
        };

        try {
            const data = await EditDept(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedDepartment = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedDepartment - ", updatedDepartment);

                // ✅ Update the existing row in DataGrid
                setDepartmentRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedDepartment.id ? updatedDepartment : row
                    )
                );

                // ✅ Close the dialog
                setOpenEditModal(false);

                // ✅ Optionally reset form
                setEditDepartmentFormData({
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
            const data = await UpdateDept(params);
            console.log("data - ",data)
            console.log("data2 - ",data.status)

            if (data.status === 400) {
                setSnackbar({open: true, message: data.error, severity: "error"});
                return;
            }

            if (data.status === 200) {
                setSnackbar({open: true, message: "Department loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const updatedDepartment = {
                    id: data.data.id,
                    name: data.data.name,
                    description: data.data.description,
                    status: data.data.status?.name ?? "Active",
                    dateCreated: new Date(data.data.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(data.data.dateUpdated).toLocaleString() || "-",
                    createdBy: data.data.createdBy,
                    updatedBy: data.data.updatedBy,
                };

                console.log("updatedDepartment - ", updatedDepartment);

                // ✅ Update the existing row in DataGrid
                setDepartmentRows((prevRows) =>
                    prevRows.map((row) =>
                        row.id === updatedDepartment.id ? updatedDepartment : row
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
        setEditDepartmentFormData((prev) => ({...prev, [field]: value}));
    };
    const departmentColumns = useMemo(() => {
        const cols = [
            {field: "name", headerName: "Name", flex: 1, minWidth: 150},
            {field: "description", headerName: "Description", flex: 1, minWidth: 150},
            {field: "createdBy", headerName: "Created By", flex: 1, minWidth: 150},
            {field: "updatedBy", headerName: "Updated By", flex: 1, minWidth: 150},
            {field: "dateCreated", headerName: "Date Created", flex: 1, minWidth: 150},
            {field: "dateUpdated", headerName: "Date Updated", flex: 1, minWidth: 150},
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
                            handleDepartmentEditMenuOpen(e, params.row);
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
    }, [userRole]);

    // Fetch pageable users
    const fetchUsers = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = departmentSortModel[0]?.field || "id";
            const sortDir = departmentSortModel[0]?.sort?.toUpperCase() || "DESC";

            const response = await fetch(
                `http://localhost:8082/api/accountstatementengine/v1/user/findAllDepartments?start=${departmentPaginationModel.page}&length=${departmentPaginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('data - ', data)

            setDepartmentRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    name: item.name || "-",
                    description: item.description || "-",
                    createdBy: item.createdBy || "-",
                    updatedBy: item.updatedBy || "-",
                    dateCreated: new Date(item.dateCreated).toLocaleString() || "-",
                    dateUpdated: new Date(item.dateUpdated).toLocaleString() || "-",
                    status: item.status.name || "-",
                }))
            );
            setDepartmentRowCount(data.totalElements);
        } catch (error) {
            console.error("Error fetching account data:", error);
        } finally {
            setLoading(false);
        }
    }, [departmentPaginationModel, departmentSortModel, searchVal]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

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
                        sx={{fontWeight: 700, color: "#116530", mb: 0.5}}
                    >
                        Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage global settings
                    </Typography>
                </Box>
            </Fade>

            {/* 🔹 Pills Navigation */}
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 1,
                        backgroundColor: "#fff",
                        mb: 0,
                    }}
                >
                    <Tabs
                        value={tabIndex}
                        onChange={handleChange}
                        textColor="primary"
                        indicatorColor="primary"
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                color: "#444",
                                minHeight: 48,
                                borderRadius: "10px",
                                textAlign: "center", // ✅ center text within each tab
                                justifyContent: "center",
                            },
                            "& .Mui-selected": {
                                color: "#116530 !important",
                                fontsize: "25px",
                                transition: "all 0.3s ease",
                            },
                        }}
                    >
                        <Tab icon={<Data size="18" color="currentColor"/>} iconPosition="start"
                             label="Departments"/>
                        <Tab icon={<UserEdit size="18" color="currentColor"/>} iconPosition="start" label="Roles"/>
                        <Tab icon={<Save2 size="18" color="currentColor"/>} iconPosition="start" label="Branches"/>
                        <Tab icon={<Profile2User size="18" color="currentColor"/>} iconPosition="start"
                             label="Managers"/>
                        <Tab icon={<Cpu size="18" color="currentColor"/>} iconPosition="start" label="Config Type"/>
                        <Tab icon={<Setting4 size="18" color="currentColor"/>} iconPosition="start"
                             label="Config Category"/>
                        <Tab icon={<Firstline size="18" color="currentColor"/>} iconPosition="start"
                             label="Logs Category"/>
                    </Tabs>
                </Paper>
            </Fade>

            {/* ------------------------ TAB 1: Departments ------------------------ */}
            <TabPanel value={tabIndex} index={0}>
                <DepartmentTab/>
            </TabPanel>

            {/* ------------------------ TAB 1: Roles ------------------------ */}
            <TabPanel value={tabIndex} index={1}>
                <RolesTab />
            </TabPanel>

            {/* ------------------------ TAB 3: Permissions ------------------------ */}
            <TabPanel value={tabIndex} index={2}>
                <Paper elevation={5} sx={{p: 2, borderRadius: 2, backgroundColor: "#fff"}}>
                    <Typography variant="body1" sx={{mb: 2}}>
                        Manage permissions for roles and users.
                    </Typography>
                    <Divider sx={{mb: 2}}/>
                    <Box sx={{height: 400}}>
                        <DataGrid rows={sampleRows} columns={columns} disableColumnMenu/>
                    </Box>
                </Paper>
            </TabPanel>


            <TabPanel value={tabIndex} index={3}>
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
                        <TextField
                            label="Parameter Type"
                            size="small"
                            sx={{flex: 1, minWidth: 180}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Link2 size="18" color="#666"/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Parameter Category"
                            size="small"
                            sx={{flex: 1, minWidth: 180}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Link1 size="18" color="#666"/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Parameter Value"
                            size="small"
                            sx={{flex: 1, minWidth: 180}}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Hashtag size="18" color="#666"/>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            sx={{
                                height: 36,
                                background: "linear-gradient(90deg, #116530, #1b7a3e)",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            Add Config
                        </Button>
                    </Box>

                    <Divider sx={{mb: 2}}/>
                    <Box sx={{height: 440}}>
                        <DataGrid
                            rows={rowsRoles}
                            columns={columns}
                            rowCount={rowRolesCount}
                            loading={loading}
                            paginationModel={paginationRolesModel}
                            onPaginationModelChange={setPaginationRolesModel}
                            paginationMode="server"
                            sortingMode="server"
                            onSortModelChange={setSortRolesModel}
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
                            open={openRolesEditModal}
                            onClose={handleRolesEditModalClose}
                            maxWidth="sm"
                            disableRestoreFocus
                            fullWidth
                            TransitionComponent={RolesTransition}
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
                                Edit Department
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>


                                    {/* Email */}
                                    <TextField
                                        label="Parameter Value"
                                        fullWidth
                                        type="text"
                                        size="small"
                                        value={editRolesFormData.value}
                                        error={departmentDescriptionErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {fontSize: 14}, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleRolesFormChange("value", e.target.value)}
                                    />
                                    {/* Status */}
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={editRolesFormData.status === 1}
                                                onChange={(e) => handleRolesFormChange("active", e.target.checked)}
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
                                <Button onClick={handleRolesEditModalClose} disabled={loading}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRolesEditSave}
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? <CircularProgress size={20}/> : "Save Changes"}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Box>
                </Paper>
            </TabPanel>

        </Box>
    );
};

export default AllSettings;
