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
    CircularProgress, Alert, Autocomplete,
} from "@mui/material";
import {createUser, loginUser} from "../services/Api"; // import the API function
import { useNavigate} from "react-router-dom";
function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState({ error: false, helperText: "" });
    const [passwordError, setPasswordError] = useState({ error: false, helperText: "" });
    const [cpasswordError, setCpasswordError] = useState({ error: false, helperText: "" });
    const [roleError, setRoleError] = useState({ error: false, helperText: "" });
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    let navigate = useNavigate();
    const [role, setRole] = useState(null);
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!email) {
            setSnackbar({ open: true, message: "Please enter email address", severity: "error" });
            setEmailError({ error: true, helperText: "Email is required" });
            return;
        }
        setEmailError("");

        if (!password) {
            setSnackbar({ open: true, message: "Please enter password", severity: "error" });
            setPasswordError({ error: true, helperText: "Password is required" });
            return;
        } else {
            setPasswordError({ error: false, helperText: "" });
        }

        setPasswordError("");

        if (!cpassword) {
            setSnackbar({ open: true, message: "Passwords do not matchd", severity: "error" });
            setCpasswordError({ error: true, helperText: "Passwords do not match" });
            return;
        } else {
            setCpasswordError({ error: false, helperText: "" });
        }

        if(password !== cpassword){
            setSnackbar({ open: true, message: "Passwords do not match", severity: "error" });
            setCpasswordError({ error: true, helperText: "Passwords do not match" });
            return;
        }

        if(!role){
            setSnackbar({ open: true, message: "Please select role", severity: "error" });
            setRoleError({ error: true, helperText: "Please select role" });
            return;
        }

        setRoleError("");
        setLoading(true);

        console.log("Login", email, password, cpassword, role);
        console.log("role",  role);
        try {
            const params = {email: email, password: password, cpassword: cpassword, role: 'role'}
            console.log('params', params)
            const data = await createUser(params);
            // const data = await loginUser(completeEmail, password);
            console.log("Login successful:", data);

            localStorage.setItem("token", data.token);
            localStorage.setItem("curUserEmail", data.email);

            const role = JSON.parse(data.role);
            const roleName = role.roleName;
            localStorage.setItem("role", roleName);
            console.log(roleName);
            console.log('--> ',localStorage.getItem('role'));
            if (roleName === "Supplier") {
                //setubmitting(false);
                console.log("User is an ICT Administrator.");
                localStorage.setItem("userRole", "Supplier");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/supplier");
            }
            else if (roleName === "ICT_Service_Desk_Officer") {
                //setubmitting(false);
                console.log("User is an ICT Service Desk Officer.");
                localStorage.setItem("userRole", "ICT_Service_Desk_Officer");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountManagement");
            } else if (roleName === "ICT_Service_Desk_Supervisor") {
                //setubmitting(false);
                console.log("User is an ICT Service Desk Supervisor.");
                localStorage.setItem("userRole", "ICT_Service_Desk_Supervisor");
                //localStorage.setItem("rights", permissionsArray);
                localStorage.setItem("expired", 0);
                navigate("/accountManagement");
            }
            else if (roleName === "Contact_Centre_Officer") {
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
                        backgroundColor: "white",
                        color: "purple",
                        px: 20,
                        py: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    {/*<Typography variant="h6" sx={{fontWeight: "bold", mt: 1}}>
                        <img src="/cooplogo.jpeg" alt="logo" style={{height: 36}}/>
                    </Typography>*/}
                    <Typography variant="h6"
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bolder",
                                    color: "purple"
                                }}>DCM</Typography>
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
                            onSubmit={handleRegister}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    mb: 1,        // margin bottom
                                    color: "purple"
                                }}
                            >
                                Sign Up
                            </Typography>
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

                            <TextField
                                label="Confirm Password"
                                variant="outlined"
                                type="password"
                                size="small"
                                fullWidth
                                value={cpassword}
                                onChange={(e) => setCpassword(e.target.value)}
                                error={cpasswordError.error}
                                helperText={cpasswordError.helperText}
                                sx={{ "& .MuiInputBase-root": { height: 40 } }}
                            />

                            <Autocomplete
                                size="small"
                                options={["Supplier", "Distributor", "Retailer"]}
                                value={role}
                                onChange={(event, newValue) => setRole(newValue)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Select Role"
                                        variant="outlined"
                                        sx={{ "& .MuiInputBase-root": { height: 40 } }}
                                    />
                                )}
                            />


                            {/* --- SIGN UP LINK HERE --- */}
                            <Typography
                                variant="body2"
                                sx={{ textAlign: "left", color: "purple", cursor: "pointer" }}
                                onClick={() => navigate("/")}
                            >
                                Sign In?
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                fullWidth
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default LoginPage;
