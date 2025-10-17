import React, {useState} from "react";
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
    DialogActions, Slide,
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
    SearchNormal1,
    Hashtag,
    Link2,
    Link1,
    UserEdit,
    Setting2,
    Setting3,
    Setting4,
    ShieldTick, Cpu, Profile2User, Save2, Firstline, Data,
} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";

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

const Settings = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searchVal, setSearchVal] = useState("");
    const [parameterValue, setParameterValue] = useState("");
    const [parameterValueError, setParameterValueError] = useState(false);
    const [rowsRoles, setRowsRoles] = useState([]);
    const [rowRolesCount, setRowRolesCount] = useState(0); // total elements from backend
    const [openRolesEditModal, setOpenRolesEditModal] = useState(false);
    const [parameterValueErrorEdit, setParameterValueErrorEdit] = useState(false);
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
    const [sortRolesModel, setSortRolesModel] = useState([{field: "id", sort: "desc"}]);
    const [rolesAnchorEl, setRolesAnchorEl] = useState(null);
    const handleChange = (_, newIndex) => setTabIndex(newIndex);
    const handleRolesMenuClose = () => setRolesAnchorEl(null);
    const handleAddConfig = async () => {
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
                        centered
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
                <Paper elevation={5} sx={{p: 2,
                    borderRadius: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            flexGrow: 1,
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
                                Edit Config
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

            {/* ------------------------ TAB 1: Roles ------------------------ */}
            <TabPanel value={tabIndex} index={1}>
                <Paper elevation={5} sx={{p: 2, borderRadius: 1, backgroundColor: "#fff"}}>
                    {/* Search + Add */}
                    <Box sx={{display: "flex", justifyContent: "space-between", mb: 2}}>
                        <TextField
                            placeholder="Search role..."
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
                                width: {xs: "100%", sm: "250px"},
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                    backgroundColor: "#f8f9fa",
                                },
                            }}
                        />

                        <Button
                            variant="contained"
                            startIcon={<AddIcon/>}
                            sx={{
                                background: "linear-gradient(90deg, #116530, #1b7a3e)",
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit"/> : "Add Role"}
                        </Button>
                    </Box>

                    <Divider sx={{mb: 2}}/>

                    {/* Data Table */}
                    <Box sx={{height: 400}}>
                        <DataGrid
                            rows={sampleRows}
                            columns={columns}
                            loading={loading}
                            disableColumnMenu
                            pageSizeOptions={[5, 10, 20]}
                        />
                    </Box>
                </Paper>
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
                                Edit Config
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

export default Settings;
