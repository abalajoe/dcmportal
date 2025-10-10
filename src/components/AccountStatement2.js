import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    InputAdornment,
    Paper,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Sms } from "iconsax-react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import dayjs from "dayjs";

const AccountStatement2 = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    return (
        <Box sx={{ p: 3 }}>
            <Typography
                variant="h6"
                sx={{
                    mb: 2,
                    fontWeight: 600,
                    color: "#116530",
                }}
            >
                User Management
            </Typography>

            <Paper
                elevation={2}
                sx={{
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                {/* Email Field */}
                <TextField
                    size="small"
                    label="Account Number"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={emailError}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                <Sms size="18" color="currentColor" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flex: 1,
                        minWidth: "180px",
                        "& .MuiInputBase-input": { fontSize: "0.9rem" },
                        "& .MuiInputLabel-root": { fontSize: "0.9rem", color: "black" },
                        "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                    }}
                />

                {/* Date Pickers Section */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        slotProps={{
                            textField: {
                                size: "small",
                                InputProps: {
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                            <CalendarTodayIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                                sx: {
                                    flex: 1,
                                    minWidth: "180px",
                                    "& .MuiInputBase-input": { fontSize: "0.9rem" },
                                    "& .MuiInputLabel-root": { fontSize: "0.9rem", color: "black" },
                                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                                },
                            },
                        }}
                    />

                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minDate={startDate}
                        slotProps={{
                            textField: {
                                size: "small",
                                InputProps: {
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                            <CalendarTodayIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                },
                                sx: {
                                    flex: 1,
                                    minWidth: "180px",
                                    "& .MuiInputBase-input": { fontSize: "0.9rem" },
                                    "& .MuiInputLabel-root": { fontSize: "0.9rem", color: "black" },
                                    "& .MuiInputLabel-root.Mui-focused": { color: "black" },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>

                {/* Add User Button */}
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#116530",
                        textTransform: "none",
                        fontWeight: 500,
                        height: 38,
                        minWidth: 120,
                        "&:hover": { backgroundColor: "#0d4d24" },
                    }}
                >
                    Add User
                </Button>
            </Paper>
        </Box>
    );
};

export default AccountStatement2;
