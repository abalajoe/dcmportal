import React, {useState, useEffect, useCallback, useMemo} from "react";
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
    Alert, Typography, Paper, InputAdornment, Fade, Chip, Slide
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Edit,
    Trash,
    Add,
    SearchNormal1, Settings, Data, Hashtag, More
} from "iconsax-react";
import {CreateSupplier,
} from "../services/Api";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Inventory = () => {
    const userRole = localStorage.getItem("role");
    const [sku, setSku] = useState("");
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
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
    const [skuError, setSkuError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [quantityError, setQuantityError] = useState(false);
    const [emailHelper, setEmailHelper] = useState("");
    const [skuErrorEdit, setSkuErrorEdit] = useState(false);
    const [nameErrorEdit, setNameErrorEdit] = useState(false);
    const [quantityErrorEdit, setQuantityErrorEdit] = useState(false);
    const [openApproveDialog, setOpenApproveDialog] = useState(false);
    const [editFormData, setEditFormData] = useState({
        id: "",
        sku: "",
        name: "",
        quantity: "",
    });

    // Fetch pageable users
    const fetchSuppliers = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = sortModel[0]?.field || "id";
            const sortDir = sortModel[0]?.sort?.toUpperCase() || "DESC";

            const response = await fetch(
                `http://localhost:8082/api/findAllSuppliers?start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('fetch-data - ', data)

            setRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    sku: item.sku || "-",
                    name: item.name || "-",
                    quantity: item.quantity || "-",
                    createdby: item.createdby || "-",
                    // datecreated: item.datecreated || "-",
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
        fetchSuppliers();
    }, [fetchSuppliers]);

    // Add account
    const handleAddSupplier = async () => {
        console.log('hello')
        if (!sku) {
            console.log('hello1')
            setSnackbar({open: true, message: "Please enter sku", severity: "error"});
            setSkuError(true);
            setEmailHelper("Enter sku");
            return;
        }

        // reset sku error if valid
        setSkuError(false);
        setEmailHelper("");

        // ✅ Role validation
        if (!name) { // role is your state from Autocomplete
            console.log('hello2')
            setSnackbar({open: true, message: "Please select name", severity: "error"});
            setNameError(true);
            return;
        }

        // reset role error if valid
        setNameError(false);

        // ✅ Branch validation
        if (!quantity) { // role is your state from Autocomplete
            console.log('hello3')
            setSnackbar({open: true, message: "Please select quantity", severity: "error"});
            setQuantityError(true);
            return;
        }

        // reset role error if valid
        setQuantityError(false);

        const custEmail = localStorage.getItem("curUserEmail");
        const params = {
            sku: sku,
            name: name,
            quantity: quantity,
            createdby: custEmail
        };

        console.log('params --> ', params)
        try {
            const data = await CreateSupplier(params);
            console.log("data - ",data)

            if (data.status === 200) {
                setSnackbar({open: true, message: "User loaded", severity: "success"});

                // ✅ Add to DataGrid state immediately
                const newUser = {
                    id: data.data.id,
                    sku: sku,
                    name: name,
                    quantity: quantity,
                    createdby: custEmail,
                    datecreated: new Date(data.data.datecreated).toLocaleString(),
                    status: data.data.status,
                };

                console.log('newUser - ', newUser)

                setRows((prev) => [newUser, ...prev]);
                setRowCount((prev) => prev + 1);
                // Optional: clear fields
                setSku("");
                setName("");
                setQuantity("");
            } else {
                setSnackbar({open: true, message: data.error, severity: "error"});
                //return;
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to create department", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const handleEditMenuOpen = useCallback((e, row) => {
        e.stopPropagation();

        setEditFormData({
            id: row.id || "",
            sku: row.sku || "",
            name: row.name || '',
            quantity: row.quantity || '',
        });
        setOpenEditModal(true);
    }, []); // ✅ ADD departments2 to dependency array

    const handleApproveMenuOpen = (e, row) => {
        e.stopPropagation();
        setSelectedRow(row);
        setOpenApproveDialog(true);
    };
    const handleMenuClose = () => setAnchorEl(null);

    const handleApproveCloseDialog = () => {
        setOpenApproveDialog(false);
    };

    const handleEditClick = () => {
        console.log('selectedrow', selectedRow)
        setEditFormData({
            id: selectedRow.id,
            sku: selectedRow.sku,
            name: selectedRow.name,
            quantity: selectedRow.quantity,
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

    const handleDelete = () => {
        console.log("Delete:", selectedRow);
        deleteAsync(selectedRow.id)
        setOpenApproveDialog(false);
    };

    const handleSaveChanges = async () => {
        console.log("New values:", editFormData);
        console.log("New values2:", editFormData.email);

        if (!editFormData.sku) {
            setSnackbar({open: true, message: "Please enter sku", severity: "error"});
            setSkuErrorEdit(true);
            return;
        }

        setSkuErrorEdit(false);

        // ✅ Branch validation
        if (!editFormData.name) { // role is your state from Autocomplete
            setSnackbar({open: true, message: "Please enter name", severity: "error"});
            setNameErrorEdit(true);
            return;
        }

        setNameErrorEdit(false);

        // ✅ Branch validation
        if (!editFormData.quantity) {
            setSnackbar({open: true, message: "Please enter quantity", severity: "error"});
            setQuantityErrorEdit(true);
            return;
        }

        setNameErrorEdit(false);

        const params = {
            id: editFormData.id,
            sku: editFormData.sku,
            name: editFormData.name,
            quantity: editFormData.quantity,
        };

        console.log('theparams - ', params)
        // return
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8082/api/supplier/"+editFormData.id,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(params),
                }
            );
            if (response.status !== 200) {
                const errData = await response.json();
                setSnackbar({open: true, message: "Something went wrong", severity: "error"});
                return
                //throw new Error(errData.message || "Failed to add user");
            }
            setSnackbar({open: true, message: "Successfully edited supplier", severity: "success"});
            await fetchSuppliers(); // refresh list from server
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
            handleEditModalClose()
        }
    };

    const deleteAsync = async (id) => {
        console.log('theparams - ', id)
        // return
        setLoading(true);
        try {
            const response = await fetch(
                "http://localhost:8082/api/supplier/"+id,
                {
                    method: "DELETE",
                    headers: {"Content-Type": "application/json"},
                    body: {},
                }
            );
            if (response.status !== 200) {
                const errData = await response.json();
                setSnackbar({open: true, message: "Something went wrong", severity: "error"});
                return
                //throw new Error(errData.message || "Failed to add user");
            }
            setSnackbar({open: true, message: "Successfully actioned user", severity: "success"});
            await fetchSuppliers(); // refresh list from server
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
            handleEditModalClose()
        }
    };

    const columns = useMemo(() => {
        const cols = [
            {field: "sku", headerName: "SKU", flex: 1, minWidth: 150},
            {field: "name", headerName: "Name", flex: 1, minWidth: 150},
            {field: "quantity", headerName: "Quantity", flex: 1, minWidth: 150},
            {field: "createdby", headerName: "Created By", flex: 1, minWidth: 150},
            {field: "datecreated", headerName: "Date Created", flex: 1, minWidth: 150},
        ];

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
                    <Edit size="14" color="purple" />
                </IconButton>
            ),
        });

        cols.push({
            field: "approve",
            headerName: "",
            width: 70,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={(e) => handleApproveMenuOpen(e, params.row)}
                    size="small"
                >
                    <Trash size="16" color="purple"/>
                </IconButton>
            ),
        });

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
            {/* Page Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "purple", mb: 0.5}}
                    >
                        Supplier
                    </Typography>
                    {/*<Typography variant="body2" color="text.secondary">
                        Manage system users, roles, and permissions.
                    </Typography>*/}
                </Box>
            </Fade>
            {/* Filter + Add Button Section */}
            {["Supplier"].includes(userRole) && (
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
                            {/* SKU */}
                            <TextField
                                size="small"
                                label="SKU"
                                variant="outlined"
                                value={sku}
                                onChange={(e) => setSku(e.target.value)}
                                error={skuError}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start" sx={{color: "grey.500"}}>
                                            {/* icon inherits currentColor from the adornment */}
                                            {/*<Hashtag size="18" color="currentColor"/>*/}
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

                            <TextField
                                size="small"
                                label="Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={nameError}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start" sx={{color: "grey.500"}}>
                                            {/* icon inherits currentColor from the adornment */}
                                            {/*<More size="18" color="currentColor"/>*/}
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
                            <TextField
                                size="small"
                                label="Quantity"
                                type="number"
                                variant="outlined"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                error={quantityError}
                                InputProps={{
                                    startAdornment:
                                        <InputAdornment position="start" sx={{color: "grey.500"}}>
                                            {/* icon inherits currentColor from the adornment */}
                                            {/*<Add size="18" color="currentColor"/>*/}
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

                        {/* Add User Button */}
                        <Button
                            variant="contained"
                            onClick={handleAddSupplier}
                            sx={{
                                background: "purple",
                                textTransform: "none",
                                fontWeight: 600,
                                height: 35,
                                px: 3,
                                py: 1,
                                boxShadow: 2,
                                fontSize: "0.9rem",
                                "&:hover": {background: "purple"},
                                minWidth: "150px",
                            }}
                        >
                            Create
                        </Button>
                    </Paper>
                </Fade>
            )}
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
                            placeholder="Search SKU..."
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
                                    background: "purple",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    py: 2.5,
                                }}
                            >
                                Edit Supply
                            </DialogTitle>
                            <DialogContent>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>
                                    {/* Email */}
                                    <TextField
                                        label="SKU"
                                        fullWidth
                                        size="small"
                                        value={editFormData.sku}
                                        error={skuErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {fontSize: 14}, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleFormChange("sku", e.target.value)}
                                    />

                                    <TextField
                                        label="Name"
                                        fullWidth
                                        size="small"
                                        value={editFormData.name}
                                        error={nameErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {fontSize: 14}, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleFormChange("name", e.target.value)}
                                    />

                                    <TextField
                                        label="Quantity"
                                        fullWidth
                                        type="number"
                                        size="small"
                                        value={editFormData.quantity}
                                        error={quantityErrorEdit}
                                        InputProps={{
                                            sx: {
                                                fontSize: 14, // 👈 reduce input text font size
                                                height: 36,   // optional: reduce height too
                                            },
                                        }}
                                        InputLabelProps={{
                                            sx: {fontSize: 14}, // 👈 reduce label font size
                                        }}
                                        onChange={(e) => handleFormChange("quantity", e.target.value)}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleEditModalClose}
                                    variant="outlined"
                                    sx={{
                                        color: "#555",
                                        borderColor: "#ccc",
                                        "&:hover": { borderColor: "#999" },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSaveChanges}
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: 'purple',   // your custom color
                                        color: '#fff',                // text color
                                        '&:hover': {
                                            backgroundColor: 'brown', // hover color
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={20}/> : "Update"}
                                </Button>
                            </DialogActions>
                        </Dialog>

                        <Dialog
                            open={openApproveDialog}
                            onClose={handleApproveCloseDialog}
                            maxWidth="sm"
                            fullWidth
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
                                    background: "purple",
                                    color: "#fff",
                                    fontWeight: 700,
                                    fontSize: "1.25rem",
                                    py: 2.5,
                                }}
                            >
                                Delete
                            </DialogTitle>

                            <DialogContent sx={{ mt: 3, pb: 2 }}>
                                <Typography sx={{ color: "#555", fontSize: "1.1rem" }}>
                                    Are you sure you want to delete this entry?
                                </Typography>
                            </DialogContent>

                            <DialogActions sx={{ p: 3, pt: 2, justifyContent: "flex-end" }}>
                                <Button
                                    onClick={handleApproveCloseDialog}
                                    variant="outlined"
                                    sx={{
                                        color: "#555",
                                        borderColor: "#ccc",
                                        "&:hover": { borderColor: "#999" },
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete} // your delete handler
                                    variant="contained"
                                    color="error"
                                    sx={{
                                        backgroundColor: 'purple',   // your custom color
                                        color: '#fff',                // text color
                                        '&:hover': {
                                            backgroundColor: 'brown', // hover color
                                        },
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Paper>
            </Fade>
        </Box>
    );
};

export default Inventory;
