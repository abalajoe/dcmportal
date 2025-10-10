import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Paper,
    InputAdornment,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Sms, Calendar, Card} from "iconsax-react";

const AccountStatement = () => {
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
        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                pt: { xs: 0, sm: 0, md: 0 },
                px: { xs: 1, sm: 2, md: 3 },
                pb: { xs: 2, sm: 3, md: 5 },
                fontFamily: "'SUSE', sans-serif",
            }}
        >
            {/* Header */}
            <Box sx={{ textAlign: "left", mb: 3 }}>
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: "#116530", mb: 0.5 }}
                >
                    Account Statement
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Generate detailed account statements by selecting the date range below.
                </Typography>
            </Box>

            {/* Form Container */}
            <Paper
                elevation={5}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 2,
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
                            label="Account Number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={statement}
                            onChange={(e) => setStatement(e.target.value)}
                            InputProps={{
                                style: { fontSize: '0.8rem' },
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ color: "grey.600" }}>
                                        <Card size="18" color="currentColor" />
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

                        {/* Generate Button */}
                        <Button
                            variant="contained"
                            onClick={handleSearch}
                            disabled={loading}
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
                                "Generate"
                            )}
                        </Button>
                    </Box>
                </LocalizationProvider>
            </Paper>
        </Box>
    );
};

export default AccountStatement;
