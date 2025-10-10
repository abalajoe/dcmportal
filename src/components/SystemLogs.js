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
} from "@mui/material";
import { styled } from "@mui/material/styles";

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

const SystemLogs = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const tableBodyRef = useRef(null);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedSignature, setSelectedSignature] = useState(null);

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

            const response = await axios.get("http://localhost:7081/api/accountstatementengine/v1/user/findAllPrintHistory", {
                params,
            });

            setData(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
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
        <Box sx={{ p: 3 }}>
            {/* Toolbar */}
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
                <TextField
                    size="small"
                    placeholder="Search by email"
                    value={searchVal}
                    onChange={handleSearchChange}
                    sx={{ flexGrow: 1, maxWidth: 300 }}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#0b4b2b",
                        "&:hover": { backgroundColor: "#0d5c35" },
                    }}
                    onClick={exportToExcel}
                >
                    Export to Excel
                </Button>
            </Box>

            {/* Table */}
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    minHeight: 400,
                    maxHeight: 600,
                    mt: 4,
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
                            padding: "4px 10px",
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
                            <StyledTableHeadCell sx={{ width: "12%" }}>User</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "12%" }}>Log Date</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "8%" }}>Acc No</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "10%" }}>Acc Name</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "9%" }}>Nat ID</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "7%" }}>Pages No</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "7%" }}>Currency</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "7%" }}>Charges</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "9%" }}>Start Date</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "9%" }}>End Date</StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: "10%" }}>Signature</StyledTableHeadCell>
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
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>
                                        {new Date(row.logdate).toLocaleString()}
                                    </TableCell>
                                    <TableCell>{row.accountnumber}</TableCell>
                                    <TableCell>{row.accountname}</TableCell>
                                    <TableCell>{row.natid}</TableCell>
                                    <TableCell>{row.pageno}</TableCell>
                                    <TableCell>{row.currency}</TableCell>
                                    <TableCell>{row.charges}</TableCell>
                                    <TableCell>
                                        {new Date(row.startdate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(row.enddate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Button size="small" color="success" onClick={() => handleOpenModal(row.email)}>
                                            {row.signature}
                                        </Button>
                                    </TableCell>
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

export default SystemLogs;