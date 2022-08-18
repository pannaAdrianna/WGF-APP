import logo from './logo.svg';
import './App.css';
import ThemeProvider from "./theme";
import ScrollToTop from "./components/ScrollToTop";
import {BaseOptionChartStyle} from "./components/chart/BaseOptionChart";
import Router from "./routes";

function App() {
  return (
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
  );
}

export default App;
