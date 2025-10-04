import React, { useState } from "react";
import dayjs from "dayjs";
import { Box, Button, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Reports = () => {
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const handleSearch = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);

            // Generate 50 dummy rows
            const dummyRows = Array.from({ length: 50 }, (_, index) => ({
                id: index + 1,
                statement: `Statement ${index + 1}`,
                startDate: startDate.format("YYYY-MM-DD"),
                endDate: endDate.format("YYYY-MM-DD"),
            }));

            setRows(dummyRows);
        }, 1000);
    };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "statement", headerName: "Statement", flex: 1 },
        { field: "startDate", headerName: "Start Date", width: 150 },
        { field: "endDate", headerName: "End Date", width: 150 },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "900px",
                        mx: "auto",
                        width: "100%",
                    }}
                >
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        slotProps={{ textField: { size: "small", fullWidth: true } }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                        sx={{ height: 40, minWidth: 100, width: { xs: "100%", sm: "auto" } }}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                    </Button>
                </Box>

                <Box sx={{ mt: 4, height: 500, width: "100%" }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 20, 50]}
                        checkboxSelection
                    />
                </Box>
            </LocalizationProvider>
        </Box>
    );
};

export default Reports;
