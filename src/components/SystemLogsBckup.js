import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
    Box,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Typography,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment, Autocomplete, Snackbar, Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    Sms,
    People,
    Export,
    SearchNormal,
    Card,
    Calendar,
    Book1,
    ImportCurve,
    Wallet2,
    HambergerMenu
} from "iconsax-react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {FetchLogCategories, FetchManagers} from "../services/Api";

const StyledTableHeadCell = styled(TableCell)({
    backgroundColor: "#0b4b2b",
    color: "white",
    fontWeight: 600,
    textAlign: "left",
    willChange: "auto",
    transform: "translateZ(0)",
    backfaceVisibility: "hidden",
    WebkitFontSmoothing: "subpixel-antialiased",
    position: "sticky",
    top: 0,
    zIndex: 100,
});

const StyledTableRow = styled(TableRow)(({ index }) => ({
    backgroundColor: index % 2 === 0 ? "#fff" : "#f5f5f5",
}));

const SystemLogsBckup = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const branchOptions = ["Finance", "IT", "HR", "Sales", "Operations"];
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const tableBodyRef = useRef(null);
    const [manager, setManager] = useState(null);
    const [managers, setManagers] = useState([]);
    const [loadingManagers, setLoadingManagers] = useState(false);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('logDate');
    const [account, setAccount] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('');
    // 🔥 Fetch data from backend
    const fetchData = async () => {
        setLoading(true);

        // Add fade effect only to tbody
        if (tableBodyRef.current) {
            tableBodyRef.current.style.opacity = "0.3";
        }

        try {
            const params = {
                start: page,
                length: rowsPerPage,
                searchVal: searchVal || "",
                sort: ["id", "desc"],
            };

            /*const response = await axios.get("http://localhost:7081/api/accountstatementengine/v1/user/findAllPrintHistory", {
                params,
            });*/
            const response = await axios.get(`${process.env.REACT_APP_LOG_URL}/retrieve`, {
                params: {
                    start: pageIndex * pageSize,
                    length: pageSize,
                    sortBy: orderBy,
                    sortOrder: order,
                    search,
                    filterAccount: account,
                    // filterCategory: selectedCategory === 'All' ? undefined : selectedCategory,
                    // startDate: startDate ? startDate.toISOString() : undefined,
                    // endDate: endDate ? endDate.toISOString() : undefined,
                },
            });

            console.log("response1 - ", response)
            console.log("response2 - ", response.data)
            console.log("response3 - ", response.data.data)

            setData(response.data.data || []);
            setTotalPages(response.data.recordsTotal || 0);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);

            // Restore tbody opacity
            if (tableBodyRef.current) {
                tableBodyRef.current.style.opacity = "1";
            }
        }
    };

    useEffect(() => {
        const loadLogCategories = async () => {
            setLoading(true);
            try {
                const data = await FetchLogCategories();
                console.log('managers - ', data)

            } catch (error) {
                setSnackbar({ open: true, message: "Failed to fetch managers", severity: "error" });
            } finally {
                setLoading(false);
            }
        };
        loadLogCategories();
    }, []);

    // 🔄 Fetch whenever page or search changes
    useEffect(() => {
        fetchData();
    }, [page, searchVal]);

    const handleSearchChange = (e) => {
        setSearchVal(e.target.value);
        setPage(0);
    };

    const handleNext = () => {
        if (page < totalPages - 1) setPage((p) => p + 1);
    };

    const handlePrevious = () => {
        if (page > 0) setPage((p) => p - 1);
    };

    const handleOpenModal = (signature) => {
        setSelectedSignature(signature);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSignature(null);
    };

    const exportToExcel = () => {
        if (data.length === 0) {
            alert("No data to export!");
            return;
        }

        const formattedData = data.map((row) => ({
            User: row.email,
            "Log Date": new Date(row.logdate).toLocaleString(),
            "Account No": row.accountnumber,
            "Account Name": row.accountname,
            "Nat ID No": row.natid,
            "Pages No": row.pageno,
            Currency: row.currency,
            Charges: row.charges,
            "Start Date": new Date(row.startdate).toLocaleDateString(),
            "End Date": new Date(row.enddate).toLocaleDateString(),
            Signature: row.signature,
        }));

        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Print Logs");
        XLSX.writeFile(workbook, "PrintLogs.xlsx");
    };

    return (
        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                pt: { xs: 0, sm: 0, md: 0 },
                px: { xs: 1, sm: 2, md: 3 },
                pb: { xs: 2, sm: 3, md: 5 },
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
            {/* Header */}
            <Box sx={{ textAlign: "left", mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#116530", mb: 0.5 }}
                >
                    System Logs
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor system audit trails and logs.
                </Typography>
            </Box>

            {/* Form Container */}
            <Paper
                elevation={5}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    gap: 2,
                    backgroundColor: "#fff",
                }}
            >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            gap: 2,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Account Number */}
                        <TextField
                            label="Search"
                            variant="outlined"
                            size="small"
                            fullWidth
                            InputProps={{
                                style: { fontSize: '0.8rem' },
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                        <SearchNormal size="18" color="currentColor" />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                style: {
                                    fontSize: '1.0rem', // Increased label size
                                    backgroundColor: 'white',
                                    paddingLeft: '4px',
                                    paddingRight: '4px',
                                }
                            }}
                            sx={{
                                "& .MuiInputBase-input": { fontSize: "0.8rem" },
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.95rem", // Increased label size
                                    color: "black"
                                },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#116530" },
                            }}
                        />

                        {/* Start Date */}
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            minDate={startDate}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                    InputProps: {
                                        style: { fontSize: '0.8rem' }, // Add this for input text
                                        startAdornment: (
                                            <InputAdornment
                                                position="start"
                                                sx={{ color: "grey.600" }}
                                            >
                                                <Calendar size="18" color="currentColor" />
                                            </InputAdornment>
                                        ),
                                    },
                                    InputLabelProps: {
                                        style: {
                                            fontSize: '1.0rem',
                                            backgroundColor: 'white',
                                            paddingLeft: '4px',
                                            paddingRight: '4px',
                                        }
                                    },
                                    sx: {
                                        "& .MuiInputBase-input": { fontSize: "0.8rem" }, // Changed from 0.9rem
                                        "& .MuiInputLabel-root": {
                                            fontSize: "0.9rem", // Changed from 0.9rem
                                            color: "black",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": { color: "#116530", fontSize: "0.9rem",},
                                    },
                                },
                            }}
                        />

                        {/* End Date */}
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            minDate={startDate}
                            slotProps={{
                                textField: {
                                    size: "small",
                                    fullWidth: true,
                                    InputProps: {
                                        style: { fontSize: '0.8rem' }, // Add this for input text
                                        startAdornment: (
                                            <InputAdornment
                                                position="start"
                                                sx={{ color: "grey.600" }}
                                            >
                                                <Calendar size="18" color="currentColor" />
                                            </InputAdornment>
                                        ),
                                    },
                                    InputLabelProps: {
                                        style: {
                                            fontSize: '1.0rem',
                                            backgroundColor: 'white',
                                            paddingLeft: '4px',
                                            paddingRight: '4px',
                                        }
                                    },
                                    sx: {
                                        "& .MuiInputBase-input": { fontSize: "0.8rem" }, // Changed from 0.9rem
                                        "& .MuiInputLabel-root": {
                                            fontSize: "0.8rem", // Changed from 0.9rem
                                            color: "black",
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": { color: "#116530" },
                                    },
                                },
                            }}
                        />

                        {/* Branch */}
                        <Autocomplete
                            options={branchOptions}
                            size="small"
                            getOptionLabel={(option) => option}
                            sx={{
                                width: "100%", // ✅ matches TextField & DatePicker width
                                "& .MuiInputBase-root": {
                                    height: 34, // ✅ consistent height
                                },
                                "& .MuiOutlinedInput-root": {
                                    fontSize: "0.8rem",
                                },
                                "& .MuiAutocomplete-input": {
                                    padding: "4px 8px !important",
                                    fontSize: "0.8rem",
                                },
                                "& .MuiInputLabel-root": {
                                    fontSize: "0.9rem",
                                    color: "black",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#116530",
                                },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="All"
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                            <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                                <People size="18" color="currentColor" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    InputLabelProps={{
                                        style: {
                                            fontSize: "0.95rem",
                                            backgroundColor: "white",
                                            paddingLeft: "4px",
                                            paddingRight: "4px",
                                        },
                                    }}
                                />
                            )}
                        />




                        {/* Generate Button */}
                        <Button
                            variant="contained"
                            disabled={loading}
                            startIcon={<SearchNormal size="18" color="#fff" />}
                            sx={{
                                height: 34,
                                minWidth: 120,
                                background: "linear-gradient(90deg, #116530, #1b7a3e)",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                                "&:hover": {
                                    background: "linear-gradient(90deg, #0d4d24, #156e35)", // same gradient tone, slightly darker
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                    transform: "translateY(0px)", // subtle lift
                                },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : "Search"}
                        </Button>

                    </Box>

                </LocalizationProvider>
            </Paper>

            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 1,
                    minHeight: 400,
                    maxHeight: 600,
                    mt: 2,
                    overflow: "auto",
                    overflowX: "auto", // Allow horizontal scroll on small screens
                }}
            >
                <Table
                    size="small"
                    sx={{
                        "& th": {
                            padding: "6px 10px",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap", // Prevent text wrapping in headers
                        },
                        "& td": {
                            padding: "10px 10px",
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap", // Prevent text wrapping in cells
                        },
                        "& thead": {
                            transform: "translateZ(0)",
                            willChange: "auto",
                        },
                        tableLayout: { xs: "auto", md: "fixed" }, // Auto on mobile, fixed on desktop
                        width: "100%",
                        minWidth: { xs: "1200px", md: "100%" }, // Minimum width on mobile for horizontal scroll
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <StyledTableHeadCell sx={{ width: "20%" }}>Log ID</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "20%" }}>Log Date</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "20%" }}>User</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "20%" }}>Category</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "20%" }}>Account</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "100%" }}>Description</StyledTableHeadCell>
                        </TableRow>
                    </TableHead>

                    <TableBody
                        ref={tableBodyRef}
                        sx={{
                            transition: 'opacity 0.2s ease-in-out',
                        }}
                    >
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    <CircularProgress size={28} color="success" />
                                </TableCell>
                            </TableRow>
                        ) : data.length > 0 ? (
                            data.map((row, index) => (
                                <StyledTableRow key={row.id} index={index}>
                                    <TableCell>{row.logId}</TableCell>
                                    <TableCell>
                                        {new Date(row.logDate).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{row.user}</TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell>{row.account}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                </StyledTableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} align="center">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                }}
            >
                <Button
                    variant="contained"
                    onClick={handlePrevious}
                    disabled={page === 0}
                    sx={{
                        backgroundColor: page === 0 ? "#ccc" : "#0b4b2b",
                        "&:hover": { backgroundColor: "#0d5c35" },
                    }}
                >
                    Previous
                </Button>
                <Typography>
                    Page {page + 1} of {totalPages || 1}
                </Typography>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={page >= totalPages - 1}
                    sx={{
                        backgroundColor:
                            page >= totalPages - 1 ? "#ccc" : "#0b4b2b",
                        "&:hover": { backgroundColor: "#0d5c35" },
                    }}
                >
                    Next
                </Button>
            </Box>

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle>Signature Preview</DialogTitle>
                <DialogContent sx={{ textAlign: "center" }}>
                    {selectedSignature ? (
                        selectedSignature.startsWith("data:image") ? (
                            <img
                                src={selectedSignature}
                                alt="Signature"
                                style={{ width: "100%", height: "auto", marginTop: 10 }}
                            />
                        ) : (
                            <Typography variant="body1" sx={{ mt: 2 }}>
                                {selectedSignature}
                            </Typography>
                        )
                    ) : (
                        <Typography variant="body2" sx={{ mt: 2 }}>
                            No signature data available
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} variant="contained" color="success">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default SystemLogsBckup;