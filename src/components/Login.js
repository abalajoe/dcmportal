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
    const [error, setError] = useState("");
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    let navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        console.log("Login", email, password);
        try {
            const data = await loginUser(email, password);
            console.log("Login successful:", data);

            if (rememberMe) {
                localStorage.setItem("authToken", data.token);
            }

            //setSnackbar({ open: true, message: "Login successful!", severity: "success" });
            navigate("/accountstatement");
           // window.location.href = "/dashboard"; // redirect after login
        } catch (err) {
            setSnackbar({ open: true, message: "Login failed!", severity: "error" });
            console.error(err);
            setError(err.message);
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
                    <Typography variant="h6">STATEMENT ENGINE</Typography>
                </Box>
            </Box>

            {/* Main Content */}
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Card sx={{ width: 500, boxShadow: 3 }}>
                    <CardContent>
                        <Box
                            component="form"
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                            onSubmit={handleLogin}
                        >
                            <TextField
                                label="Email address"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                            {error && (
                                <Typography color="error" variant="body2">
                                    {error}
                                </Typography>
                            )}

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
