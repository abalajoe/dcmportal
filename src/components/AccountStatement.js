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
import {Sms, Calendar, Card, Book1, Export, ArrowRotateRight, Printer} from "iconsax-react";
import {Document, pdfjs, Page} from "react-pdf";
import {ImportCurve, CloseCircle} from "iconsax-react";
import {AccountSmtAPI, DownloadSmtAPI, FetchSignature, PrintSmtAPI, WaiveChargeAPI, EmailSmtAPI} from "../services/Api";
import axios from "axios";
import SignatureModal from "./SignatureModal";
import ConfirmModal from "./ConfirmPayment";
import ModalComponent from "./ConfirmPrint";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

const AccountStatement = () => {
    const userRole = localStorage.getItem("role");
    const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "success"});
    const [accountNumber, setAccountNumber] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [loading, setLoading] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [loadingDownload, setLoadingDownload] = useState(false);
    const [base64, setBase64] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [image1, setImage1] = useState(null);
    const [captured, setCaptured] = useState(false);
    const [retrieved, setRetrieved] = useState(false);
    const [base64Image, setBase64Image] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [charges, setCharges] = useState("");
    const [pages, setPages] = useState("");
    const [currency, setCurrency] = useState("");
    const [captureEnabled, setCaptureEnabled] = useState(true);
    const [retrieveEnabled, setRetrieveEnabled] = useState(false);
    const [image, setImage] = useState("");
    const [accObject, setAccObject] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isPrintingStmt, setIsPrintingStmt] = useState(false);
    const [isCharged, setCharged] = useState(false);
    const [data, setData] = useState({
        title: "",
        description: "",
    });
    const [showPayModal, setShowPayModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [actionConfirmed, setActionConfirmed] = useState(false);
    const usrtype = localStorage.getItem("userRole");
    const branch = localStorage.getItem("branch");
    const curUserEmail = localStorage.getItem("curUserEmail");

    const handleCloseSignatureModal = () => {
        setModalOpen(false);
        setCaptureEnabled(true);
        setRetrieveEnabled(false);
        setImage("");
        setImage1("");
    };

    const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // All teens use 'th'
        switch (day % 10) {
            case 1:
                return "st";
            case 2:
                return "nd";
            case 3:
                return "rd";
            default:
                return "th";
        }
    };

    const updateAccountParams = (accParams) => {
        let accPrms = {
            loanAcc: accParams.loanAcc,
            startDt: accParams.startDt,
            endDt: accParams.endDt,
            base64Stmt: base64,
            numPages: 0,
            curUser: localStorage.getItem("curUserEmail"),
            request: `account`,
        };
        setAccObject(accPrms);
    };

    const formatDate = (date) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        const formattedDate = new Date(date).toLocaleDateString("en-GB", options);

        const day = new Date(date).getDate(); // Get the day of the month
        const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`; // Add the ordinal suffix to the day

        // Replace the default day number with the day and ordinal suffix
        return formattedDate.replace(/\d+/, dayWithSuffix);
    };

    function onDocumentLoadSuccess({numPages}) {
        console.log("numPages - ", numPages);
        setNumPages(numPages);
    }

    const emailStatement = () => {
        setIsSendingEmail(true);
        EmailSmtAPI(accObject).then((emailStatus) => {
            setIsSendingEmail(false);
            return window.alert(`${emailStatus.status} `);
        });
    };

    function startDownload() {
        setLoadingDownload(true);
        const linkSource = `data:application/pdf;base64,${base64}`;
        const downloadLink = document.createElement("a");
        document.body.appendChild(downloadLink);
        downloadLink.href = linkSource;
        downloadLink.target = "_self";
        downloadLink.download = "Account statement";
        downloadLink.click();

        DownloadSmtAPI(accObject).then((r) => {
            console.log("Logged");
            setLoadingDownload(false);
        });
    }

    const handleAccountStatement = async () => {
        setLoading(true);
        const email = localStorage.getItem('curUserEmail');
        console.log('email -- ', email)
        const userParams = {
            curUser: email,
            loanAcc: accountNumber,
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
                updateAccountParams(userParams);
                setSnackbar({open: true, message: "Statement loaded", severity: "success"});
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to fetch statement", severity: "error"});
        } finally {
            setLoading(false);
        }
    };
    const fetchSignature = async () => {
        /*axios
            .get(
                `${process.env.REACT_APP_SIGN_URL}/retrieve?accountNumber=${accountNumber}`
            )
            .then((response) => {
                const data = response.data;
                console.log('dt - ', data)
            })
            .catch(() => {
                alert("Sorry, service unavailable. Try again later.");
            });*/
        try {
            const data = await FetchSignature(accountNumber);
            console.log('data -> ',data)
            if (data) {
                const signatureImage = `data:image/png;base64,${data}`;
                setRetrieved(true);
                console.log("Retrieved after", retrieved)
                // console.log("Signature fetched successfully: ", signatureImage);
                console.log("Retrieved clicked with captured:", captured, "retrieved:", retrieved);
                setImage1(signatureImage);
            } else {
                alert("No signature found for this account.");
            }
        } catch (error) {
            console.error(error);
            setSnackbar({open: true, message: "Failed to fetch statement", severity: "error"});
        } finally {
            setLoading(false);
        }
    };

    const captureSignature = () => {
        setImage("");
        setCaptureEnabled(false);
        setRetrieveEnabled(true);

        axios
            .get(`${process.env.REACT_APP_SIGN_URL}/capture`)
            .then((response) => response.data)
            .then((data) => {
                const capturedSignature = `data:image/png;base64,${data}`;
                setImage(capturedSignature); // Set the image data to state
                console.log("Base64 Image:", data);
            })
            .catch((error) => {
                console.error("Error fetching image:", error);
                setImage(""); // Optionally set an error message or keep it empty
            });
    };

    const retrieveSignature = () => {
        console.log('Retrieving signature for account : ' + accObject.loanAcc)
        axios
            .get(
                `${process.env.REACT_APP_SIGN_URL}/retrieve?accountNumber=${accObject.loanAcc}`
            )
            .then((response) => {
                const data = response.data;
                const retrievedSignature = `data:image/png;base64,${data}`;
                if (data) {
                    setCaptureEnabled(true);
                    setImage1(retrievedSignature);
                } else {
                    alert("No signature found for this account.");
                }
            })
            .catch(() => {
                alert("Sorry, service unavailable. Try again later.");
            });
    };

    const storeSignature = () => {
        const url = `${process.env.REACT_APP_SIGN_URL}/store`;
        const payload = {
            accountNumber: accObject.loanAcc,
            AccountNo: accObject.loanAcc,
            signature: image,
        };
        axios
            .post(url, payload)
            .then((response) => {
                console.log("Response:", response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handleSignatureApproval = () => {
        console.log('respBal02')
        handleCloseSignatureModal();
        console.log('respBal03')
        printStatement();
    };

    const handleSignatureRejection = () => {
        handleCloseSignatureModal();
    };


    const printStatement = () => {

        setIsLoading(true); // Start the loader
        accObject.numPages = numPages;
        accObject.base64Stmt = base64;
        console.log('accObject - ', accObject)
        PrintSmtAPI(accObject)
            .then((respBal) => {
                setIsLoading(false);
                console.log('respBal - ', respBal)

                if (respBal.status === "008") {
                    data.title = "Account Balance Inquiry";
                    data.description = `${respBal.statusDesc} `;
                    setData(data);
                    handleOpenPayModal();
                } else {
                    data.title = "Account Balance Inquiry Error!!";
                    data.description = `${respBal.statusDesc} `;
                    setData(data);
                    handleOpenModal();
                }
            })
            .catch((err) => {
                setIsLoading(false);
                // setError(err);
                console.log('Closed Account Response.' + err);
                if(err == 'Error: Request failed with status code 500'){
                    data.title = "Balance Inquiry Error!!";
                    data.description = "Kindly note that there is an issue with the Account Number Provided. For A Closed Account, Kindly Proceed to Recover the Charges Manually";
                    setData(data);
                    handleWaive();
                    handleOpenModal();
                }
            });
    };

    const handleClosePayModal = () => {
        setShowPayModal(false);
    };

    const handleButtonClick = () => {
        // console.log(
        //   "window.wizardEventController ====>" + window.wizardEventController
        // );
        // console.log(
        //   "window.wizardEventController.start_stop ====>" +
        //     window.wizardEventController.start_stop
        // );
        if (
            window.wizardEventController &&
            window.wizardEventController.start_stop
        ) {
            window.wizardEventController.start_stop(3); // Call start_stop function
        }
        setCaptured(true);
        console.log("Captured clicked with captured:", captured, "retrieved:", retrieved);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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

    const handleDeny = () => {
        setActionConfirmed(false);
        console.log("Transaction Denied, Not Processed.");
        setShowPayModal(false);
    };

    const handleWaive = () => {
        setActionConfirmed(true);
        setIsPrintingStmt(true);
        accObject.curUserEmail = curUserEmail;
        WaiveChargeAPI(accObject)
            .then((data) => {
                setIsPrintingStmt(false);
                if (data.status === "002") {
                    data.title = "Charge Waiving";
                    data.description = `${data.statusDesc} `;
                    setData(data);
                    setShowPayModal(false);
                    handleOpenModal();
                } else {
                    setShowPayModal(false);
                    data.title = "Charge Waiving";
                    data.description = `${data.statusDesc} `;
                    setData(data);
                    handleOpenModal();
                }
            })
            .catch((err) => {
                // setError(err);
                console.log(err);
            });
        console.log("Charge Waiver Processed!");
        setShowPayModal(false);
    };

    const handleOpenPayModal = () => {
        setShowPayModal(true);
    };

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleConfirm = () => {
        setActionConfirmed(true);
        setIsPrintingStmt(true);
        PrintSmtAPI(accObject)
            .then((data) => {
                setIsPrintingStmt(false);
                // if(true){
                //   handleOpenPayModal();
                // }else{

                // }
                if (data.status === "002") {
                    handlePrint(base64);
                    // return window.alert(`${data.statusDesc} `);
                    data.title = "Account Statement Printing";
                    data.description = `${data.statusDesc} `;
                    setData(data);
                    setShowPayModal(false);
                    handleOpenModal();
                    setCharged(true);
                } else {
                    // return window.alert(`${data.statusDesc} `);
                    setShowPayModal(false);
                    data.title = "Account Statement Printing";
                    data.description = `${data.statusDesc} `;
                    setData(data);
                    handleOpenModal();
                }
            })
            .catch((err) => {
                // setError(err);
                console.log(err);
            });
        console.log("Transaction Accepted and Processed!");
        setShowPayModal(false);
    };

    const handlePrint = (base64) => {
        const linkSource = `data:application/pdf;base64,${base64}`;
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.src = linkSource;

        document.body.appendChild(iframe);

        // iframe.onload = () => {
        //   iframe.contentWindow.focus();
        //   iframe.contentWindow.print();
        //   document.body.removeChild(iframe); // Clean up after printing
        // };
    };

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
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
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
                            {base64 && ["Branch_Maker", "Branch_Checker", "Head_Office", "Security_Services_User"].includes(userRole) && (
                                <Button
                                    variant="contained"
                                    onClick={() => setModalOpen(true)}
                                    // onClick={() => setOpenDialog(true)}
                                    //disabled={loading}
                                    startIcon={<Printer size="18" color="#fff"/>}
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
                            {base64 && ["Branch_Maker", "Branch_Checker", "Head_Office", "Security_Services_User"].includes(userRole) && (
                                <Button
                                    variant="contained"
                                    onClick={startDownload}
                                    disabled={loadingDownload}
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

                            {/* Email Button */}
                            {base64 && ["Contact_Centre_Officer"].includes(userRole) && (
                                <Button
                                    variant="contained"
                                    onClick={emailStatement}
                                    disabled={isSendingEmail}
                                    startIcon={<Sms size="18" color="#fff"/>}
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
                                    {loading ? <CircularProgress size={20} color="inherit"/> : "Email"}
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
            {/*<Dialog
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
                            {accountNumber || "—"}
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
                            {image1 && (
                                <img
                                    src={image1}
                                    alt="Base64 Image"
                                    style={{
                                        height: "35mm",
                                        width: "60mm",
                                        border: "1px solid #d3d3d3",
                                    }}
                                />
                            )}
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
                            onClick={handleButtonClick}
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
                            onClick={fetchSignature}
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
            </Dialog>*/}
            <SignatureModal
                isOpen={modalOpen}
                onClose={handleCloseSignatureModal}
                charges={charges}
                pages={pages}
                currency={currency}
                image={image}
                image1={image1}
                accountNo={accountNumber}
                stDate={formatDate(startDate)}
                enDate={formatDate(endDate)}
                captureSignature={captureSignature}
                retrieveSignature={retrieveSignature}
                handleSignatureApproval={handleSignatureApproval}
                handleSignatureRejection={handleSignatureRejection}
                storeSignature={storeSignature}
                captureEnabled={captureEnabled}
                retrieveEnabled={retrieveEnabled}
            />

            <ConfirmModal
                data={data}
                show={showPayModal}
                onClose={handleClosePayModal}
                onConfirm={handleConfirm}
                onWaive={handleWaive}
                onDeny={handleDeny}
            />
            <ModalComponent
                data={data}
                show={showModal}
                onClose={handleCloseModal}
            />
        </Box>
    );
};

export default AccountStatement;