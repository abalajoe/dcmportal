import React, {useEffect, useState, useRef, useMemo} from "react";
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
    DialogActions, InputAdornment, Autocomplete, Tooltip, Fade, Menu, MenuItem, FormControlLabel, Checkbox, IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
    Profile2User,
    Sms,
    User,
    Wallet2,
    SmsSearch,
    Book1,
    FilterSearch,
    GlobalSearch,
    SearchNormal, SearchNormal1, Export, Edit2, Settings
} from "iconsax-react";
import AddIcon from "@mui/icons-material/Add";
import {DataGrid} from "@mui/x-data-grid";

const PrintHistory = () => {
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [searchVal, setSearchVal] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const tableBodyRef = useRef(null);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [sortModel, setSortModel] = useState([{field: "id", sort: "desc"}]);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 9,
    });


    // 🔥 Fetch data from backend
    const fetchData = async () => {
        setLoading(true);

        // Add fade effect only to tbody
        if (tableBodyRef.current) {
            tableBodyRef.current.style.opacity = "0.3";
        }

        try {
            const params = {
                start: paginationModel.page * paginationModel.pageSize, // offset
                length: paginationModel.pageSize,                      // limit
                search: searchVal || "",                               // match backend param name
                sortBy: sortModel[0]?.field || "logId",                // match backend
                sortOrder: sortModel[0]?.sort || "desc",               // match backend
            };
            let url = `${process.env.REACT_APP_LOG_URL}/retrieveHistory`;
            // const response = await axios.get("http://localhost:7081/api/accountstatementengine/v1/user/findAllPrintHistory", {
            const response = await axios.get(url, {
                params,
            });
            console.log('response2 -', response.data)
            console.log('response22 -', response.data.data)
            console.log('response23 -', response.data.recordsTotal)

            /*setRows(response.data.data || []);
            setRowCount(response.data.recordsTotal || 0);*/

            setRows(
                response.data.data.map((item, index) => ({
                    ...item, // keep everything (logId, user, account, etc.)
                    logDate: new Date(item.logDate).toLocaleString() || "-",
                    startDate: new Date(item.startDate).toLocaleString() || "-",
                    endDate: new Date(item.endDate).toLocaleString() || "-",
                }))
            );
            setRowCount(response.data.recordsTotal);
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
    }, [paginationModel, sortModel, searchVal]);

    const columns = useMemo(() => {
        const cols = [
            {field: "logId", headerName: "Log Id", flex: 1, minWidth: 150},
            {field: "user", headerName: "User", flex: 1, minWidth: 150},
            {field: "account", headerName: "Account", flex: 1, minWidth: 150},
            {field: "logDate", headerName: "Log Date", flex: 1, minWidth: 150},
            {field: "startDate", headerName: "Start Date", flex: 1, minWidth: 150},
            {field: "endDate", headerName: "End Date", flex: 1, minWidth: 150},
        ];
        return cols;
    }, []);

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
            {/* Page Header */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#116530", mb: 0.5 }}
                >
                    Print History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor audit trail of printed resources.
                </Typography>
            </Box>

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
                            placeholder="Search account..."
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
                            getRowId={(row) => row.logId}
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
                </Paper>
            </Fade>
        </Box>
    );
};

export default PrintHistory;