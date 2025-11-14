import React, {useState, useEffect, useCallback, useMemo} from "react";

import {
    Box,Typography, Paper, InputAdornment, Fade, Chip, Slide
} from "@mui/material";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const Reports = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8082/api2/supplierReport")
            .then(response => response.json())
            .then(data => setData(data))
            .catch(err => console.error("Error fetching suppliers:", err));
    }, []);

    return (

        <Box
            sx={{
                backgroundColor: "#f6f8fa",
                pt: {xs: 0, sm: 0, md: 0},
                px: {xs: 1, sm: 2, md: 3},
                pb: {xs: 2, sm: 3, md: 5},
                fontFamily: "'SUSE', sans-serif",
            }}
        >
            {/* Page Header */}
            <Fade in={true} timeout={600}>
                <Box sx={{mb: 2}}>
                    <Typography
                        variant="h5"
                        sx={{fontWeight: 700, color: "purple", mb: 0.5}}
                    >
                        Reports
                    </Typography>
                    {/*<Typography variant="body2" color="text.secondary">
                        Manage system users, roles, and permissions.
                    </Typography>*/}
                </Box>
            </Fade>
            <Fade in={true} timeout={1200}>
                <Paper
                    elevation={5}
                    sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        alignItems: "center",
                        justifyContent: "space-between",
                        backgroundColor: "#fff",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            flexGrow: 1,
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ width: "100%", height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="sku" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />

                                    <Bar dataKey="quantity" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Box>
                </Paper>
            </Fade>

        </Box>
    );
};

export default Reports;
