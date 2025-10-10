import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    Tooltip,
    Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { ProfileTick } from "iconsax-react";

export default function UserManagement() {
    const [loading, setLoading] = useState(false);
    const [rowCount, setRowCount] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
    const [search, setSearch] = useState(""); // 🔍 new state for search

    const roles = ["Admin", "Manager", "User", "Viewer"];
    const branches = ["Finance", "HR", "Sales", "IT", "Operations"];
    const managers = [
        "Manager1",
        "Manager2",
        "Manager3",
        "Manager4",
        "Manager5",
        "Manager6",
        "Manager7",
    ];

    const columns = [
        { field: "id", headerName: "ID", width: 80 },
        { field: "email", headerName: "Email Address", width: 220 },
        { field: "role", headerName: "Role", width: 180 },
        { field: "branch", headerName: "Branch", width: 180 },
        { field: "manager", headerName: "Manager", width: 180 },
        { field: "status", headerName: "Status", width: 120 },
    ];

    const rows = [
        { id: 1, email: "ken12@gmail.com", role: "User", branch: "Operations", manager: "Manager1", status: "Active" },
        { id: 2, email: "ken11@gmail.com", role: "Viewer", branch: "Operations", manager: "Manager9", status: "Active" },
        { id: 3, email: "ken10@gmail.com", role: "Viewer", branch: "Sales", manager: "Manager8", status: "Active" },
    ];

    // 🔍 Filtered rows based on search text
    const filteredRows = rows.filter((row) =>
        Object.values(row)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                minHeight: "100vh",
                pt: { xs: 1, sm: 1, md: 1 },
                px: { xs: 2, sm: 3, md: 5 },
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
                    User Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage system users, roles, and permissions.
                </Typography>
            </Box>

            {/* Filter + Add Button Section */}
            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    mb: 3,
                    borderRadius: 2,
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
                        InputProps={{
                            startAdornment: <ProfileTick size="24" color="currentColor" sx={{ mr: 1 }} />,
                        }}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />

                    {/* Role */}
                    <Autocomplete
                        options={roles}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Role"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <PersonIcon color="action" sx={{ mr: 1 }} />,
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />

                    {/* Branch */}
                    <Autocomplete
                        options={branches}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Branch"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <ApartmentIcon color="action" sx={{ mr: 1 }} />,
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />

                    {/* Manager */}
                    <Autocomplete
                        options={managers}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Manager"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: <SupervisorAccountIcon color="action" sx={{ mr: 1 }} />,
                                }}
                            />
                        )}
                        sx={{
                            flex: 1,
                            minWidth: "180px",
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />
                </Box>

                {/* Add User Button */}
                <Tooltip title="Add a new user">
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            background: "linear-gradient(90deg, #116530, #1b7a3e)",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 3,
                            py: 1,
                            boxShadow: 2,
                            fontSize: "0.9rem",
                            "&:hover": { background: "#0d4d24" },
                            minWidth: "150px",
                        }}
                    >
                        Add User
                    </Button>
                </Tooltip>
            </Paper>

            {/* 🔍 Data Table + Search */}
            <Paper
                elevation={3}
                sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#fff",
                }}
            >
                {/* 🔍 Search Field above DataGrid */}
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        label="Search users..."
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: "250px" },
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />
                </Box>

                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ height: 400, width: "100%" }}>
                        <DataGrid
                            rows={filteredRows} // 🔍 use filtered rows
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
                            rowHeight={40}
                            headerHeight={38}
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
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
