import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { CoinHoldings } from "../config/api";
import _debounce from "lodash/debounce";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
let globIds = "";
export default function CoinValues({ holdings }) {
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
  const { currency, symbol, user_id } = CryptoState();
  const CoinDataCache = [{"id":"bitcoin","symbol":"btc","name":"Bitcoin","image":"https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1696501400","current_price":41779,"market_cap":816833510906,"market_cap_rank":1,"fully_diluted_valuation":876906849801,"total_volume":39566836953,"high_24h":42403,"low_24h":40672,"price_change_24h":1107.39,"price_change_percentage_24h":2.72276,"market_cap_change_24h":22661041901,"market_cap_change_percentage_24h":2.85342,"circulating_supply":19561375.0,"total_supply":21000000.0,"max_supply":21000000.0,"ath":69045,"ath_change_percentage":-39.52126,"ath_date":"2021-11-10T14:24:11.849Z","atl":67.81,"atl_change_percentage":61480.91653,"atl_date":"2013-07-06T00:00:00.000Z","roi":null,"last_updated":"2023-12-05T02:44:07.086Z"},{"id":"ethereum","symbol":"eth","name":"Ethereum","image":"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628","current_price":2230.59,"market_cap":268074983240,"market_cap_rank":2,"fully_diluted_valuation":268074983240,"total_volume":28899240241,"high_24h":2271.34,"low_24h":2208.31,"price_change_24h":17.15,"price_change_percentage_24h":0.77472,"market_cap_change_24h":2126957630,"market_cap_change_percentage_24h":0.79976,"circulating_supply":120233028.208889,"total_supply":120233028.208889,"max_supply":null,"ath":4878.26,"ath_change_percentage":-54.30591,"ath_date":"2021-11-10T14:24:19.604Z","atl":0.432979,"atl_change_percentage":514723.48357,"atl_date":"2015-10-20T00:00:00.000Z","roi":{"times":70.40679473504282,"currency":"btc","percentage":7040.679473504282},"last_updated":"2023-12-05T02:44:04.378Z"},{"id":"solana","symbol":"sol","name":"Solana","image":"https://assets.coingecko.com/coins/images/4128/large/solana.png?1696504756","current_price":60.19,"market_cap":25529162829,"market_cap_rank":6,"fully_diluted_valuation":33931424673,"total_volume":2234871496,"high_24h":65.14,"low_24h":59.96,"price_change_24h":-3.830949408693371,"price_change_percentage_24h":-5.98374,"market_cap_change_24h":-1621055741.6901398,"market_cap_change_percentage_24h":-5.97069,"circulating_supply":424351899.208649,"total_supply":564016321.229134,"max_supply":null,"ath":259.96,"ath_change_percentage":-76.85775,"ath_date":"2021-11-06T21:54:35.825Z","atl":0.500801,"atl_change_percentage":11912.8338,"atl_date":"2020-05-11T19:35:23.449Z","roi":null,"last_updated":"2023-12-05T02:44:00.212Z"}]

  const useStyles = makeStyles({
    row: {
      backgroundColor: "#16171a",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#131111",
      },
      fontFamily: "Montserrat",
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "gold",
      },
    },
  });

  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const fetchCoins = async () => {
    try {
      setLoading(true);
      let ids = holdings.map((coin) => coin.label).join('%2C');
      
      if (ids !== undefined) {
        const data = CoinDataCache
        console.log(data);
        setCoins(data);
        globIds = ids.split("%2C");
        console.log(globIds)
      }
    } catch (error) {
      console.error("Error fetching coins:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchCoins = _debounce(fetchCoins, 1000);
  
  useEffect(() => {
    debouncedFetchCoins();
    // Cancel the debounce on component unmount
    return () => debouncedFetchCoins.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdings, currency]);

  const handleSearch = () => {
    const filteredCoins = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
    coins.forEach((coin)=>console.log(globIds));
    // Filter the coins based on the ids list
    const filteredCoinsByIds = filteredCoins.filter(
      (coin) => globIds.includes(coin.id)
    );
    console.log(filteredCoinsByIds);
    return filteredCoinsByIds;
  };
  

  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: "center" }}>
        <Typography
          variant="h4"
          style={{ margin: 18, fontFamily: "Montserrat" }}
        >
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search For a Crypto Currency.."
          variant="outlined"
          style={{ marginBottom: 20, width: "100%" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer component={Paper}>
          {loading ? (
            <LinearProgress style={{ backgroundColor: "gold" }} />
          ) : (
            <Table aria-label="simple table">
              <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                    <TableCell
                      style={{
                        color: "black",
                        fontWeight: "700",
                        fontFamily: "Montserrat",
                      }}
                      key={head}
                      align={head === "Coin" ? "center" : "right"}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          style={{
                            display: "flex",
                            gap: 15,
                          }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height="50"
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                textTransform: "uppercase",
                                fontSize: 22,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: "darkgrey" }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit > 0 ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {symbol}{" "}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        {/* Comes from @material-ui/lab */}
        <Pagination
          count={10}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}