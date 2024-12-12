import { makeStyles } from "@material-ui/core";
import Homepage from "./Pages/HomePage";
import SignInPage from "./Pages/SignInPage";
import SignUpPage from "./Pages/SignUpPage";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import CoinPage from "./Pages/CoinPage";
import { FearGreedIndex } from "./Pages/FearGreedIndex";
import PortfolioPage from "./Pages/PortfolioPage";
import Watchlist from "./Pages/Watchlist";

const useStyles = makeStyles(() => ({
  App: {
    backgroundColor: "#14161a",
    color: "white",
    minHeight: "100vh",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter>
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
          <Route path="/fgi" element={<FearGreedIndex />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/favorites" element={<Watchlist/>} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
