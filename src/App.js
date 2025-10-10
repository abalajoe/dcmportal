import './App.css';
import MainRouter from "./router";
import {BrowserRouter} from "react-router-dom";
import theme from './theme/theme';
import {ThemeProvider} from "@mui/material"; // Bold

// Import SUSE font weights
import '@fontsource/suse/400.css'; // Regular
import '@fontsource/suse/600.css'; // SemiBold
import '@fontsource/suse/700.css'; // Bold
function App() {
    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <MainRouter />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
