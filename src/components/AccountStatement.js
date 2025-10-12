import React, {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Paper,
    InputAdornment, Alert, Snackbar,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Sms, Calendar, Card, Book1} from "iconsax-react";
import { Document, pdfjs, Page } from "react-pdf";
import {ImportCurve} from "iconsax-react";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const AccountStatement = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [statement, setStatement] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [base64, setBase64] = useState(null);
    const [numPages, setNumPages] = useState(null);
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

    function onDocumentLoadSuccess({ numPages }) {
        console.log("numPages - ", numPages)
        setNumPages(numPages);
    }
    //pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

    const generate = async () => {
        setLoading(true);
        const newUser = {
            AccountNo: "3121212",
            endDt: "10/10/2025",
            startDt: "10/10/2025",
        };

        try {
            const response = await fetch(
                "http://localhost:7081/api/accountstatementengine/v1/user/accountStatement",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newUser),
                }
            );

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to fetch PDF");
            }

            setSnackbar({ open: true, message: "Statement generated", severity: "success" });

            // ✅ Parse JSON properly
            const data = await response.json();
            console.log("Backend response:", data);

            if (data.status === "00" && data.base64) {
                setBase64(data.base64); // ✅ now base64 actually contains your PDF
            } else {
                console.error("Invalid response or missing base64");
            }

        } catch (err) {
            console.error("Error fetching PDF:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Use useEffect to toggle page scrolling
    useEffect(() => {
        if (base64) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto"; // cleanup when unmounted
        };
    }, [base64]);


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
                            onClick={generate}
                            disabled={loading}
                            startIcon={<Book1 size="18" color="#fff" />}
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
                            {loading ? <CircularProgress size={20} color="inherit" /> : "View"}
                        </Button>
                        {/* Generate Button */}
                        {base64 && (
                        <Button
                            variant="contained"
                            onClick={generate}
                            disabled={loading}
                            startIcon={<ImportCurve size="18" color="#fff" />}
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
                            {loading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                "Print"
                            )}
                        </Button>
                        )}
                    </Box>

                </LocalizationProvider>
            </Paper>
            {base64 && (
            <Paper
                elevation={5}
                sx={{
                    p: 2,
                    mb: 2,
                    borderRadius: 1,
                    gap: 2,
                    backgroundColor: "#666",
                }}
            >

                    <Box
                        sx={{
                            mt: 2,
                            mx: "auto",
                            width: "100%",
                            height: "470px", // or 80vh if you want responsive
                            display: "flex",
                            justifyContent: "center", // ✅ centers horizontally
                            alignItems: "flex-start", // top-align vertically
                            overflow: "auto",
                            backgroundColor: "#666",
                            p: 0,
                        }}
                    >
                        <Document
                            file={`data:application/pdf;base64,${base64}`}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<Typography>Loading PDF...</Typography>}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 0.5, // ✅ reduce vertical gap between pages (e.g., 0.5 = ~4px)
                                }}
                            >
                                {Array.from(new Array(numPages), (_, index) => (
                                    <Page
                                        key={`page_${index + 1}`}
                                        pageNumber={index + 1}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        width={800}
                                    />
                                ))}
                            </Box>
                        </Document>
                    </Box>
            </Paper>
            )}
        </Box>
    );
};

export default AccountStatement;
