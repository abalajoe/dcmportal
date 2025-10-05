import React, { useState } from "react";
import { Box, TextField, Button, CircularProgress } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Dashboard = () => {
    const [statement, setStatement] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);

    const handleSearch = () => {
        setLoading(true);

        // simulate API call
        setTimeout(() => {
            setLoading(false);
            console.log("Statement:", statement);
            console.log("Start Date:", startDate?.format("YYYY-MM-DD"));
            console.log("End Date:", endDate?.format("YYYY-MM-DD"));
        }, 2000);
    };

    return (
        <Box sx={{ p: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" }, // column on mobile, row on larger screens
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "center",
                        maxWidth: "900px",
                        mx: "auto", // center horizontally
                        width: "100%",
                    }}
                >
                    {/* Statement TextField */}
                    <TextField
                        label="Account Number"
                        variant="outlined"
                        size="small"
                        fullWidth
                        value={statement}
                        onChange={(e) => setStatement(e.target.value)}
                        sx={{
                            "& .MuiInputBase-root": { height: 40 },
                        }}
                    />

                    {/* Start Date */}
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                            textField: {
                                size: "small",
                                fullWidth: true,
                                sx: { "& .MuiInputBase-root": { height: 40 } },
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
                                sx: { "& .MuiInputBase-root": { height: 40 } },
                            },
                        }}
                    />

                    {/* Button with Loader */}
                    <Button
                        variant="contained"
                        onClick={handleSearch}
                        disabled={loading}
                        sx={{
                            height: 38,
                            minWidth: 100,
                            backgroundColor: "#116530",
                            textTransform: "none",
                            fontWeight: 500,
                            mt: -0.2,
                            "&:hover": { backgroundColor: "#0d4d24" },
                            width: { xs: "100%", sm: "auto" }, // full width on mobile
                        }}
                    >
                        {loading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            "Generate"
                        )}
                    </Button>
                </Box>
            </LocalizationProvider>
        </Box>
    );
};

export default Dashboard;
