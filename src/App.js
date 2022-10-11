import logo from './logo.svg';
import './App.css';
import ThemeProvider from "./theme";
import ScrollToTop from "./components/ScrollToTop";

import Router from "./routes";

function App() {
    return (
        <ThemeProvider>
            <ScrollToTop/>
            <Router/>
        </ThemeProvider>
    );
}

export default App;
