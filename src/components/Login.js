import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Checkbox,
    Snackbar,
    FormControlLabel,
    CircularProgress, Alert,
} from "@mui/material";
import { loginUser } from "../services/Api"; // import the API function
import { useNavigate} from "react-router-dom";
function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState({ error: false, helperText: "" });
    const [passwordError, setPasswordError] = useState({ error: false, helperText: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    let navigate = useNavigate();

    const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email) {
            setSnackbar({ open: true, message: "Please enter email address", severity: "error" });
            setEmailError({ error: true, helperText: "Email is required" });
            return;
        }

        // if (!validateEmail(email)) {
        //     setSnackbar({ open: true, message: "Please enter a valid email address", severity: "error" });
        //     setEmailError({ error: true, helperText: "Enter a valid email address" });
        //     return;
        // } else {
        //     setEmailError({ error: false, helperText: "" });
        // }

        if (!password) {
            setSnackbar({ open: true, message: "Please enter password", severity: "error" });
            setPasswordError({ error: true, helperText: "Password is required" });
            return;
        } else {
            setPasswordError({ error: false, helperText: "" });
        }
        setLoading(true);
        setEmailError("");
        setPasswordError("");

        console.log("Login", email, password);

        let completeEmail = "";

        var lowredEmail=email.toLowerCase();
        console.log(lowredEmail)
        if (lowredEmail.slice(-16, -1) !== "@co-opbank.co.k") {
            completeEmail = `${lowredEmail}@co-opbank.co.ke`;
        } else {
            completeEmail = lowredEmail;
        }
        try {
            const data = await loginUser(email, password);
            // const data = await loginUser(completeEmail, password);
            console.log("Login successful:", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("curUserEmail", data.email);

            const role = JSON.parse(data.role);
            const roleName = role.roleName;
            localStorage.setItem("role", roleName);
            console.log(roleName);
            console.log('--> ',localStorage.getItem('role'));
            if (roleName === "ICT_Administrator") {
                //setubmitting(false);
                console.log("User is an ICT Administrator.");
                localStorage.setItem("userRole", "ICT_Administrator");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else if (roleName === "ICT_Service_Desk_Maker") {
                //setubmitting(false);
                console.log("User is an ICT Service Desk Maker.");
                localStorage.setItem("userRole", "ICT_Service_Desk_Maker");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/createAccountManagement");
            } else if (roleName === "ICT_Service_Desk_Checker") {
                //setubmitting(false);
                console.log("User is an ICT Service Desk Checker.");
                localStorage.setItem("userRole", "ICT_Service_Desk_Checker");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/approveAccountManagement");
            } else if (roleName === "Contact_Centre_Officer") {
                //setubmitting(false);
                console.log("User is a Contact Centre Officer.");
                localStorage.setItem("userRole", "Contact_Centre_Officer");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else if (roleName === "Branch_Maker") {
                //setubmitting(false);
                console.log("User is a Branch Maker.");
                localStorage.setItem("userRole", "Branch_Maker");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else if (roleName === "Branch_Checker") {
                //setubmitting(false);
                console.log("User is a Branch Checker.");
                localStorage.setItem("userRole", "Branch_Checker");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else if (roleName === "Security_Services_User") {
                //setubmitting(false);
                console.log("User is a Security Services User.");
                localStorage.setItem("userRole", "Security_Services_User");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else if (roleName === "Head_Office") {
                //setubmitting(false);
                console.log("User is a Head Office User.");
                localStorage.setItem("userRole", "Head_Office");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountStatement");
            } else {
                console.log("Role not recognized.");
                navigate("/");
            }
            // console.log("Login successful22:", data.access_token);
            // localStorage.setItem("authToken", data.access_token);
            // if (rememberMe) {
            //     localStorage.setItem("authToken", data.token);
            // }

            //setSnackbar({ open: true, message: "Login successful!", severity: "success" });
            // navigate("/trackRecord");
            // navigate("/accountstatement");
           // window.location.href = "/dashboard"; // redirect after login
        } catch (err) {
            setSnackbar({ open: true, message: "Login failed!", severity: "error" });
            console.error(err);
            setEmailError(err.message);
            setPasswordError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
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
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 0 }}>
                <Box
                    sx={{
                        backgroundColor: "green",
                        color: "white",
                        px: 3,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        borderRadius: 1,
                        boxShadow: 3,
                    }}
                >
                    <Typography variant="h6" sx={{fontWeight: "bold", mt: 1}}>
                        <img src="/cooplogo.jpeg" alt="logo" style={{height: 36}}/>
                    </Typography>
                    <Typography variant="h6">ACCOUNT STATEMENT ENGINE</Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mt: -20
                }}
            >
                <Card sx={{ width: 600, boxShadow: 3 }}>
                    <CardContent>
                        <Box
                            component="form"
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            onSubmit={handleLogin}
                        >
                            <TextField
                                label="Email Address"
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                error={emailError.error}
                                helperText={emailError.helperText}
                                sx={{ "& .MuiInputBase-root": { height: 40 } }}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                size="small"
                                fullWidth
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                error={passwordError.error}
                                helperText={passwordError.helperText}
                                sx={{ "& .MuiInputBase-root": { height: 40 } }}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                }
                                label="Remember me"
                            />

                            <Button
                                variant="contained"
                                color="success"
                                fullWidth
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : "LOGIN"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default LoginPage;
