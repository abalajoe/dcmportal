import React, {useState, useEffect, useCallback, useMemo} from "react";
import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Snackbar,
    Alert,
    Typography,
    Paper,
    InputAdornment,
    Fade,
    Chip,
    Slide,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {
    Edit,
    SearchNormal1, Trash
} from "iconsax-react";
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Orders = () => {
    const userRole = localStorage.getItem("role");
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });
    const [selectedRow, setSelectedRow] = useState(null);
    const [sortModel, setSortModel] = useState([{field: "id", sort: "desc"}]);
    const [searchVal, setSearchVal] = useState("");
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [editPriceFormData, setEditPriceFormData] = useState({
        price: "",
    });
    const [priceErrorEdit, setPriceErrorEdit] = useState(false);
    const [openOrderPriceDialog, setOpenOrderPriceDialog] = useState(false);
    const [openEditPriceModal, setOpenEditPriceModal] = useState(false);
    // Fetch pageable users
    const fetchOrders = useCallback(async () => {

        setLoading(true);
        try {
            const sortField = sortModel[0]?.field || "id";
            const sortDir = sortModel[0]?.sort?.toUpperCase() || "DESC";
            const custId = localStorage.getItem("curUserId");
            const response = await fetch(
                `http://localhost:8082/api/findAllOrders?id=${custId}&start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
                // `http://localhost:8082/api/findAllOrders?id=0&start=${paginationModel.page}&length=${paginationModel.pageSize}&searchVal=${searchVal}&sort=${sortField},${sortDir}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log('fetch-data - ', data)


            setRows(
                data.content.map((item, index) => ({
                    id: item.id,
                    sku: item.supplier !== null ? item.supplier.sku : item.orders.supplier.sku,
                    name: item.supplier !== null ? item.supplier.name : item.orders.supplier.name,
                    quantity: item.quantity,
                    price: item.price,
                    // sku: item.supplier.sku || "-",
                    // name: item.supplier.name || "-",
                    // quantity: item.supplier.quantity || "-",
                    // price: item.supplier.price || "-",
                    // userid: item.userid || "-",
                    // createdby: item.createdby || "-",
                    // // datecreated: item.datecreated || "-",
                    datecreated: new Date(item.datecreated).toLocaleString() || "-",
                    // status: item.status || "-",
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
        fetchOrders();
    }, [fetchOrders]);

    const handleEditPriceMenuOpen = useCallback((e, row) => {
        e.stopPropagation();

        setEditPriceFormData({
            id: row.id || "",
            sku: row.sku || "",
            name: row.name || '',
            quantity: row.quantity || '',
            price: row.price || '',
        });
        setOpenEditPriceModal(true);
    }, []); // ✅ ADD departments2 to dependency array

    const handleOrderPriceCloseDialog = () => {
        setOpenEditPriceModal(false);
    };

    const columns = useMemo(() => {
        const cols = [
            {field: "sku", headerName: "SKU", flex: 1, minWidth: 150},
            {field: "name", headerName: "Name", flex: 1, minWidth: 150},
            {field: "quantity", headerName: "Quantity", flex: 1, minWidth: 150},
            {field: "price", headerName: "Price", flex: 1, minWidth: 150},
            {field: "datecreated", headerName: "Date Created", flex: 1, minWidth: 150},
        ];

        if (userRole === "Distributor") {
            cols.push({
                field: "edit",
                headerName: "",
                width: 70,
                sortable: false,
                renderCell: (params) => (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditPriceMenuOpen(e, params.row);
                        }}
                        size="small"
                    >
                        <Edit size="14" color="purple" />
                    </IconButton>
                ),
            });
        }
        return cols;
    }, [userRole]);

    const handleOrderEditPrice = () => {
        console.log("handleOrderEditPrice:", editPriceFormData);
        console.log("selectedRow:", selectedRow);

        if(editPriceFormData.price === ''){
            setPriceErrorEdit(true)
            setSnackbar({open: true, message: "Enter new price", severity: "error"});
            return;
        }
        //updatePriceAsync(selectedRow, orderFormData)
        updatePriceAsync(editPriceFormData.id, parseInt(editPriceFormData.price))
        setOpenEditPriceModal(false);
    };

    const handleFormOrderPriceChange = (field, value) => {
        setEditPriceFormData((prev) => ({...prev, [field]: value}));
    };

    const updatePriceAsync = async (id, price) => {
        console.log('theparams - ', id)
        // return
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:8082/api/order/${id}/${price}`,
                {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: {},
                }
            );

            console.log('00 = ', response)
            if (response.status !== 200) {
                const errData = await response.json();
                setSnackbar({open: true, message: "Something went wrong", severity: "error"});
                return
                //throw new Error(errData.message || "Failed to add user");
            }
            setSnackbar({open: true, message: "Successfully edited order price", severity: "success"});
            setPriceErrorEdit(false)
            await fetchOrders(); // refresh list from server
        } catch (err) {
            console.error("Add user error:", err);
            alert(err.message);
        } finally {
            setLoading(false);
            //handleEditModalClose()
        }
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
                        sx={{fontWeight: 700, fontSize: 18, color: "purple", mb: 0.5}}
                    >
                        {userRole} > My Orders
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
                    </Box>

                    <Dialog
                        open={openEditPriceModal}
                        onClose={handleOrderPriceCloseDialog}
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
                            Edit Price
                        </DialogTitle>
                        <DialogContent>
                            <Box sx={{display: "flex", flexDirection: "column", gap: 2, pt: 2}}>
                                <TextField
                                    label="Price"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={editPriceFormData.price}
                                    error={priceErrorEdit}
                                    InputProps={{
                                        sx: {
                                            fontSize: 14, // 👈 reduce input text font size
                                            height: 36,   // optional: reduce height too
                                        },
                                    }}
                                    InputLabelProps={{
                                        sx: {fontSize: 14}, // 👈 reduce label font size
                                    }}
                                    onChange={(e) => handleFormOrderPriceChange("price", e.target.value)}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions sx={{ p: 3, pt: 2, justifyContent: "flex-end" }}>
                            <Button
                                onClick={handleOrderPriceCloseDialog}
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
                                onClick={handleOrderEditPrice} // your delete handler
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
                                Edit Price
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Paper>
            </Fade>
        </Box>
    );
};

export default Orders;
