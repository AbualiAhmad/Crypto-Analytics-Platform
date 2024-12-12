import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {
  createTheme,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: "D3D3D3",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

function Header() {
  const classes = useStyles();
  const { currency, setCurrency } = CryptoState();
  const userId = localStorage.getItem('userId');  // Get user ID from local storage

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userId'); // Remove user ID from local storage
    navigate('/signin'); // Redirect to sign-in page after logout
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate(`/`)}
              variant="h6"
              className={classes.title}
            >
              Crypto Metrics
            </Typography>
            <Typography
              onClick={() => navigate(`/fgi`)}
              variant="h6"
              className={classes.title}
            >
              Fear Greed Index
            </Typography>
            <Typography
              onClick={() => navigate(`/portfolio`)}
              variant="h6"
              className={classes.title}
            >
              Portfolio
            </Typography>
            <Typography
              onClick={() => navigate(`/favorites`)}
              variant="h6"
              className={classes.title}
            >
              Watchlist
            </Typography>
            {userId ? (
              // Show Log Out option if user is logged in
              <Typography
                onClick={handleLogout}
                variant="h6"
                className={classes.title}
              >
                Log Out
              </Typography>
            ) : (
              // Show Sign In option if user is not logged in
              <Typography
                onClick={() => navigate(`/signin`)}
                variant="h6"
                className={classes.title}
              >
                Sign In
              </Typography>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
