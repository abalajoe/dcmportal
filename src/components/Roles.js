import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Roles = () => {
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
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [error, setError] = useState(false);
    const [helperText, setHelperText] = useState("");

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
                `http://localhost:7081/api/accountstatementengine/v1/user/findAll?start=${paginationModel.page}&length=${paginationModel.pageSize}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) throw new Error("Failed to fetch users");
            const data = await response.json();

            // Spring Page<User> => map to DataGrid
            const mappedRows = data.content.map((user) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                datecreated: dayjs(user.datecreated).format("DD MMM YYYY"),
                role: user.roles?.name || "",
            }));

            setRows(mappedRows);
            setRowCount(data.totalElements);
        } catch (err) {
            console.error("Fetch users failed:", err);
        } finally {
            setLoading(false);
        }
    }, [paginationModel, sortModel]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Add user
    const handleAddUser = async () => {
        if (!email) {
            setSnackbar({ open: true, message: "Please enter email address", severity: "error" });
            setError(true);
            setHelperText("Email is required");
            return;
        }
        if (!validateEmail(email)) {
            setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
            setError(true);
            setHelperText("Enter a valid email address");
            return;
        }

        setLoading(true);
        const newUser = { email: email.toLowerCase(), role: "Admin" };

        try {
            const response = await fetch(
                "http://localhost:7081/api/accountstatementengine/v1/user/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                }
            );
            if (!response.ok) {
                const errData = await response.json();
                setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
                throw new Error(errData.message || "Failed to add user");
            }
            await fetchUsers(); // refresh list from server
            setSnackbar({ open: true, message: "Successfully added user", severity: "success" });
            setRoles("");
            setEmail("");
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
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
            name: selectedRow.name,
            email: selectedRow.email,
            role: selectedRow.role,
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

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "name", headerName: "Name", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "datecreated", headerName: "Date Created", width: 150 },
        { field: "role", headerName: "Role", width: 120 },
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
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    maxWidth: "420px",
                    mx: "auto",
                    width: "100%",
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

                <TextField
                    label="Email Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={error}
                    sx={{ "& .MuiInputBase-root": { height: 40 } }}
                />
                <Button
                    variant="contained"
                    onClick={handleAddUser}
                    disabled={loading}
                    sx={{ height: 38, minWidth: 150, width: { xs: "100%", sm: "auto" }, textTransform: "none", mt: -0.2}}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Add User"}
                </Button>
            </Box>

            <Box sx={{ mt: 4, height: 500, width: "100%" }}>
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
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={editFormData.name}
                            onChange={(e) => handleFormChange("name", e.target.value)}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            type="email"
                            value={editFormData.email}
                            onChange={(e) => handleFormChange("email", e.target.value)}
                        />
                        <TextField
                            label="Role"
                            fullWidth
                            value={editFormData.role}
                            onChange={(e) => handleFormChange("role", e.target.value)}
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

export default Roles;
