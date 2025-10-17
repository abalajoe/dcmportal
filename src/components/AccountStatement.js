import React, {useEffect, useState} from "react";
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
    Alert,
    Snackbar,
    DialogContent,
    DialogTitle,
    Dialog,
    DialogActions, Fade,
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {Sms, Calendar, Card, Book1, Export, ArrowRotateRight} from "iconsax-react";
import {Document, pdfjs, Page} from "react-pdf";
import {ImportCurve, CloseCircle} from "iconsax-react";
import {AccountSmtAPI} from "../services/Api";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const AccountStatement = () => {
    const userRole = localStorage.getItem("role");
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [statement, setStatement] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [base64, setBase64] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    function onDocumentLoadSuccess({numPages}) {
        console.log("numPages - ", numPages);
        setNumPages(numPages);
    }

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
                setSnackbar({open: true, message: pth.error, severity: "error"});
                return;
            }

            if (pth.status === "00") {
                setBase64(pth.base64);
                setSnackbar({open: true, message: "Statement loaded", severity: "success"});
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to fetch statement", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (base64) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [base64]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                pt: {xs: 0, sm: 0, md: 0},
                px: {xs: 1, sm: 2, md: 3},
                backgroundColor: "#f6f8fa",
                fontFamily: "'SUSE', sans-serif",
                overflow: "hidden",
            }}
        >
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({...snackbar, open: false})}
                anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            >
                <Alert
                    onClose={() => setSnackbar({...snackbar, open: false})}
                    severity={snackbar.severity}
                    sx={{width: "100%"}}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
            <Fade in timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "#116530", mb: 0.5}}
                    >
                        Account Statement
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate detailed account statements by selecting the date range below.
                    </Typography>
                </Box>
            </Fade>
            {/* Form Container */}
            <Fade in timeout={600}>
                <Paper elevation={5} sx={{flexShrink: 0, p: 2, mb: 2}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: {xs: "column", sm: "row"},
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
                                    style: {fontSize: '0.8rem'},
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{color: "grey.600"}}>
                                            <Card size="18" color="currentColor"/>
                                        </InputAdornment>
                                    ),
                                }}
                                InputLabelProps={{
                                    style: {
                                        fontSize: '1.0rem',
                                        backgroundColor: 'white',
                                        paddingLeft: '4px',
                                        paddingRight: '4px',
                                    }
                                }}
                                sx={{
                                    "& .MuiInputBase-input": {fontSize: "0.8rem"},
                                    "& .MuiInputLabel-root": {
                                        fontSize: "0.95rem",
                                        color: "black"
                                    },
                                    "& .MuiInputLabel-root.Mui-focused": {color: "#116530"},
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
                                        InputProps: {
                                            style: {fontSize: '0.8rem'},
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{color: "grey.600"}}>
                                                    <Calendar size="18" color="currentColor"/>
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
                                            "& .MuiInputBase-input": {fontSize: "0.8rem"},
                                            "& .MuiInputLabel-root": {
                                                fontSize: "0.9rem",
                                                color: "black",
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {color: "#116530", fontSize: "0.9rem"},
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
                                            style: {fontSize: '0.8rem'},
                                            startAdornment: (
                                                <InputAdornment position="start" sx={{color: "grey.600"}}>
                                                    <Calendar size="18" color="currentColor"/>
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
                                            "& .MuiInputBase-input": {fontSize: "0.8rem"},
                                            "& .MuiInputLabel-root": {
                                                fontSize: "0.8rem",
                                                color: "black",
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {color: "#116530"},
                                        },
                                    },
                                }}
                            />

                            {/* Generate Button */}
                            <Button
                                variant="contained"
                                onClick={handleAccountStatement}
                                disabled={loading}
                                startIcon={<ArrowRotateRight size="18" color="#fff"/>}
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
                                        background: "linear-gradient(90deg, #0d4d24, #156e35)",
                                        boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={20} color="inherit"/> : "Generate"}
                            </Button>

                            {/* Print Button */}
                            {base64 && ["Branch_Maker", "Branch_Checker", "Security_Services_User", "Head_Office"].includes(userRole) && (
                                <Button
                                    variant="contained"
                                    onClick={() => setOpenDialog(true)}
                                    disabled={loading}
                                    startIcon={<Export size="18" color="#fff"/>}
                                    sx={{
                                        height: 34,
                                        minWidth: 120,
                                        background: "linear-gradient(90deg, #1565C0, #1E88E5)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "#fff",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #0D47A1, #1565C0)",
                                            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={20} color="inherit"/> : "Print"}
                                </Button>
                            )}

                            {/* Download Button */}
                            {base64 && ["Contact_Centre_Officer", "Head_Office", "Security_Services_User"].includes(userRole) && (
                                <Button
                                    variant="contained"
                                    onClick={handleAccountStatement}
                                    disabled={loading}
                                    startIcon={<ImportCurve size="18" color="#fff"/>}
                                    sx={{
                                        height: 34,
                                        minWidth: 120,
                                        background: "linear-gradient(90deg, #6A1B9A, #8E24AA)",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        fontSize: "0.9rem",
                                        color: "#fff",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                                        "&:hover": {
                                            background: "linear-gradient(90deg, #4A148C, #7B1FA2)",
                                            boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                                        },
                                    }}
                                >
                                    {loading ? <CircularProgress size={20} color="inherit"/> : "Download"}
                                </Button>
                            )}
                        </Box>
                    </LocalizationProvider>
                </Paper>
            </Fade>
            {/* PDF Viewer */}
            {base64 && (
                <Fade in timeout={600}>
                    <Paper
                        elevation={5}
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#666",
                            borderRadius: 1,
                            overflow: "hidden",
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                p: 2,
                                boxSizing: "border-box",
                            }}
                        >
                            <Box sx={{width: "100%", display: "flex", justifyContent: "center"}}>
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
                                <Box sx={{height: {xs: 2, sm: 2}, flexShrink: 0}}/>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            )}

            {/* Signature Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: "16px",
                        position: "relative",
                        backdropFilter: "blur(6px)",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                    },
                }}
            >
                <IconButton
                    onClick={() => setOpenDialog(false)}
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: 12,
                        color: "#333",
                        zIndex: 1,
                        "&:hover": {color: "#116530", background: "transparent"},
                    }}
                >
                    <CloseCircle size="20" color="#116530"/>
                </IconButton>

                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: "900",
                        color: "#1565C0",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        pt: 3,
                        pb: 2,
                    }}
                >
                    Signature
                </DialogTitle>

                <DialogContent sx={{textAlign: "center", pb: 2}}>
                    <Typography sx={{fontWeight: 600, mb: 1}}>
                        Account Number:{" "}
                        <Box component="span" sx={{fontWeight: 500}}>
                            {statement || "—"}
                        </Box>
                    </Typography>

                    <Typography sx={{mb: 1}}>
                        <strong>Period start:</strong> {startDate?.format("DD/MM/YYYY") || "—"}
                    </Typography>
                    <Typography sx={{mb: 3}}>
                        <strong>Period end:</strong> {endDate?.format("DD/MM/YYYY") || "—"}
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                height: 200,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fafafa",
                            }}
                        >
                            <Typography sx={{fontSize: 13}}>
                                Captured Signature
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                height: 200,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fafafa",
                            }}
                        >
                            <Typography sx={{fontSize: 13}}>
                                Retrieved Signature
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>

                <DialogActions
                    sx={{
                        flexDirection: "column",
                        gap: 2,
                        px: 3,
                        pb: 3,
                        pt: 0,
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            ml: 1,
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                background: "#116530",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                py: 1.2,
                                fontSize: "0.85rem",
                                "&:hover": {background: "#0d4d26"},
                            }}
                        >
                            Capture Signature
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                background: "#116530",
                                textTransform: "uppercase",
                                fontWeight: 600,
                                py: 1.2,
                                fontSize: "0.85rem",
                                "&:hover": {background: "#0d4d26"},
                            }}
                        >
                            Retrieve Signature
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{
                                fontWeight: 600,
                                py: 1.2,
                                border: 2,
                                fontSize: "0.85rem",
                                "&:hover": {background: "#7a1212"},
                            }}
                        >
                            Reject
                        </Button>

                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                textTransform: "uppercase",
                                fontWeight: 600,
                                py: 1.2,
                                fontSize: "0.85rem",
                                "&:hover": {background: "#0d4d26"},
                            }}
                        >
                            Approve
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountStatement;