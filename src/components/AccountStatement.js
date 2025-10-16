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
import {AccountSmtAPI} from "../services/Api";


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


    const handleAccountStatement = async () => {
        setLoading(true);
        const userParams = {
            loanAcc: statement,
            startDt: startDate,
            endDt: endDate,
        };

        try {
            const pth = await AccountSmtAPI(userParams);

            if (pth.status === "400") {
                setSnackbar({ open: true, message: pth.error, severity: "error" });
                return;
            }

            if (pth.status === "00") {
                setBase64(pth.base64);
                setSnackbar({ open: true, message: "Statement loaded", severity: "success" });
            }
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: "Failed to fetch statement", severity: "error" });
        } finally {
            setLoading(false);
        }
    };


    /*AccountSmtAPI(userParams)
        .then((pth) => {
            if (pth.status === "400") {
                // setsubmitting(false);
                return window.alert(`${pth.error} `);
            }
            if (pth.waived === true) {
                // setCharged(true);
            }
            // setPages(pth.pages)
            // setCharges(pth.charges)
            // setCurrency(pth.currency)
            if (pth.status === "00") {
                setBase64(pth.base64);
                //updateAccountParams(userParams);
                //console.log(isAdmin);
                //setIsEmailReady(true);
            }
            // let userRoles = localStorage.getItem("userRoles");
            // if (userRoles.includes("ICT_Administrator")) setIsAdmin(true);
            // if (userRoles.includes("ICT_Administrator")) setIsSender(true);

        })
        .then(() => {
            //setsubmitting(false);
        });*/

    /*const generate = async () => {
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
    };*/

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
                display: "flex",
                flexDirection: "column",
                height: "100%",
                pt: { xs: 0, sm: 0, md: 0 },
                px: { xs: 1, sm: 2, md: 3 },
                backgroundColor: "#f6f8fa",
                fontFamily: "'SUSE', sans-serif",
                overflow: "hidden", // prevent page scroll
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
            <Box sx={{ flexShrink: 0, p: 2 }}>
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
                    flexShrink: 0, p: 2, mb: 2
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
                            onChange={(newValue) => setStartDate(newValue)}
                            // minDate={startDate}
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
                            onClick={handleAccountStatement}
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
                            onClick={handleAccountStatement}
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
            {/* PDF Viewer */}
            {base64 && (
                <Paper
                    elevation={5}
                    sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#666",
                        borderRadius: 1,
                        overflow: "hidden", // keep page from scrolling
                    }}
                >
                    {/* Scrollable area - internal scroll only */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",        // inner scrolling
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            p: 2,
                            boxSizing: "border-box", // ensure padding is included in height calculations
                        }}
                    >
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                            <Document
                                file={`data:application/pdf;base64,${base64}`}
                                onLoadSuccess={onDocumentLoadSuccess}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 0.5,
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
                            {/* <<< Spacer inside the scrollable area: creates gap without affecting outer height */}
                            <Box sx={{ height: { xs: 2, sm: 2 }, flexShrink: 0 }} />
                        </Box>
                    </Box>
                </Paper>
            )}

        </Box>
    );
};

export default AccountStatement;
