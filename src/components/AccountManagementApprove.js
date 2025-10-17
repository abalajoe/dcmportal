import React, {useState, useEffect, useCallback} from "react";
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions, Typography, Paper, InputAdornment, Fade, Chip, Slide
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
    SearchNormal1, Settings
} from "iconsax-react";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const AccountManagementApprove = () => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [sortModel, setSortModel] = useState([{field: "id", sort: "desc"}]);
    const [searchVal, setSearchVal] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

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

    const [openDialog, setOpenDialog] = useState(false);
    const handleMenuOpen = (e, row) => {
        e.stopPropagation();
        setSelectedRow(row);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleApprove = () => {
        console.log("Approved:", selectedRow);
        setOpenDialog(false);
    };

    const handleReject = () => {
        console.log("Rejected:", selectedRow);
        setOpenDialog(false);
    };

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
                    onClick={(e) => handleMenuOpen(e, params.row)}
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
        },
    ];

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
                        Manage account management approvals
                    </Typography>
                </Box>
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
                    <Box sx={{mb: 1, display: "flex", justifyContent: "flex-end"}}>
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

                    <Box sx={{height: 550, width: "100%"}}>
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

                        {/* Dialog */}
                        <Dialog
                            open={openDialog}
                            onClose={handleCloseDialog}
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
                                Validate System User
                            </DialogTitle>
                            <DialogContent sx={{mt: 3, pb: 2}}>
                                {selectedRow && (
                                    <Box>
                                        <Typography sx={{mb: 3, color: "#555", fontSize: "1.1rem", fontWeight: 800}}>
                                            Confirm system user admission
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
                                                        Email
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                        {selectedRow.email}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Role
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: "#116530",
                                                            fontSize: "0.8rem",
                                                        }}
                                                    >
                                                        {selectedRow.role}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Branch
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                        {selectedRow.branch}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{display: "flex", justifyContent: "space-between"}}>
                                                    <Typography sx={{color: "#666", fontSize: "0.9rem"}}>
                                                        Manager
                                                    </Typography>
                                                    <Typography sx={{fontWeight: 600, fontSize: "0.8rem"}}>
                                                        {selectedRow.manager}
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
                                    <Button onClick={handleCloseDialog}
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
                                        {selectedRow?.status === 1 && (
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
                                        {selectedRow?.status === 2 && (
                                            <Button
                                                onClick={handleReject}
                                                variant="outlined"
                                                color="error"
                                                sx={{ mr: 1 }}
                                            >
                                                Reject
                                            </Button>
                                        )}

                                        {selectedRow?.status === 3 && (
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
            </Fade>
        </Box>
    );
};

export default AccountManagementApprove;
