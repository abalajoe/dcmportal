import React, { useState,  } from "react";
import dayjs from "dayjs";
import {
    Box,
    Button,
    CircularProgress,
    TextField, Typography, Paper, Tooltip, InputAdornment, Alert, Snackbar
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
    Calendar
} from "iconsax-react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {FetchSignature, TrackSmtAPI} from "../services/Api";

const TrackRecord = () => {
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowCount, setRowCount] = useState(0); // total elements from backend
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 8,
    });
    const [sortModel, setSortModel] = useState([{ field: "id", sort: "desc" }]);
    const [searchVal, setSearchVal] = useState("");

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const trackRecord = async () => {
        console.log('hello')
        setLoading(true);
        // const params = {
        //     stdt: startDate,
        //     eddt: endDate,
        // };

        const params = {
            startDt: startDate ? dayjs(startDate).toISOString() : null,
            endDt: endDate ? dayjs(endDate).toISOString() : null,
        };
        console.log('hello - ', params )
        try {
            const data = await TrackSmtAPI(params)
            console.log('data -> ',data)
            if (data) {
                setRows(data)
            } else {
                setSnackbar({ open: true, message: "No values recorded", severity: "success" });
            }
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Something went wrong", severity: "error" });
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { field: "senderemail", headerName: "Staff Email", flex: 1, minWidth: 150 },
        { field: "totalsent", headerName: "Customer Email", flex: 1, minWidth: 150 },
        { field: "branch", headerName: "Customer Account", flex: 1, minWidth: 150 },
        { field: "manager", headerName: "Sent On", flex: 1, minWidth: 150 },
        { field: "statementdate", headerName: "From", flex: 1, minWidth: 150 },
        { field: "datecreated", headerName: "To", flex: 1, minWidth: 150 },
    ];

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
            {/* Page Header */}
            <Box sx={{ mb: 2 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#116530", mb: 0.5 }}
                >
                    Track Record
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor customer print statement activities
                </Typography>
            </Box>

            {/* Filter + Add Button Section */}
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

                        {/* Start Date */}
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
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

                        {/* Generate Button */}
                        <Button
                            variant="contained"
                            disabled={loading}
                            onClick={trackRecord}
                            sx={{
                                height: 34,
                                minWidth: 120,
                                background: "linear-gradient(90deg, #116530, #1b7a3e)",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                color: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    background: "#0d4d24",
                                    boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                                },
                                transition: "all 0.2s ease-in-out",
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Paper>

            {/* 🔍 Data Table + Search */}
            <Paper
                elevation={3}
                sx={{
                    p: 1,
                    mt: 3,
                    borderRadius: 1,
                    backgroundColor: "#fff",
                }}
            >
                {/* 🔍 Search Field above DataGrid */}
                <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
                    <TextField
                        label="Search users..."
                        variant="outlined"
                        size="small"
                        value={searchVal}
                        onChange={(e) => setSearchVal(e.target.value)}
                        sx={{
                            width: { xs: "100%", sm: "250px" },
                            "& .MuiInputBase-input": { fontSize: "0.9rem" },
                            "& .MuiInputLabel-root": { fontSize: "0.85rem" },
                        }}
                    />
                </Box>

                <Box sx={{ height: 450, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[5]}
                    />
                    {/*<DataGrid
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
                                    <CircularProgress />
                                </Box>
                            ),
                        }}
                    />*/}
                </Box>
            </Paper>
        </Box>
    );
};

export default TrackRecord;
