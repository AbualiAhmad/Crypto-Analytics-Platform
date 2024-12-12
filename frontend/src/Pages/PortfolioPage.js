import { Button, colors, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import * as React from 'react';
import TextField from '@mui/material/TextField';
import 'chart.js/auto';
import { Pie } from 'react-chartjs-2'; // assuming you're using the react-chartjs-2 library
import { Stack } from "@mui/material";
import CoinValues from "../components/CoinValues";

const PortfolioPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [idInput, setIdInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const [cryptoData, setCryptoData] = useState([]);
  const API = "https://crypto-metrics-backend.onrender.com"
  let CurrentValue = 0;
  let CurrentSpent = 0;
  const coinPrices = {
    "coins": {
      "solana": 60.25,
      "bitcoin": 42000.75,
      "ethereum": 2350.50
    }
  }

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Ensure that when cryptoData changes, CoinValues gets the updated data
    // Note: This assumes you have setCryptoData defined in your CryptoContext
    setCryptoData(getCryptoData(transactions));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const user_id = localStorage.getItem("userId");
      if (!user_id) {
        console.log("User is not logged in.");
        return; // Exit the function if user_id is null or undefined
      }
      console.log("idheree" + user_id)
      const response = await axios.get(`${API}/transactions/${user_id}`);
      setTransactions(response.data);
      updateCryptoData(response.data); // Update crypto data when transactions change
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };
  
  
  const updateCryptoData = (transactions) => {
    const updatedCryptoData = getCryptoData(transactions);
    setCryptoData(updatedCryptoData);
  };
  const handleBuyClick = async () => {
    try {
      const response = await axios.post(`${API}/transactions`, {
        user_id: localStorage.getItem("userId"),
        id: idInput,
        transaction_type: 'BUY',
        amount: quantityInput,
        price: priceInput,
      });
      console.log(response.data.message);
      fetchTransactions();
    } catch (error) {
      console.error('Error buying:', error);
    }
  };

  const handleSellClick = async () => {
    try {
      const response = await axios.post(`${API}/transactions`, {
        user_id: localStorage.getItem("userId"),
        id: idInput,
        transaction_type: 'SELL',
        amount: quantityInput,
        price: priceInput,
      });
      console.log(response.data.message);
      fetchTransactions();
    } catch (error) {
      console.error('Error selling:', error);
    }
  };
  const getCryptoData = () => {
    const groupedTransactions = transactions.reduce((acc, transaction) => {
      const { id, amount, price, transaction_type } = transaction;
      const key = id.toLowerCase(); // Use lowercase to make it case-insensitive
  
      // Initialize the entry if it doesn't exist
      if (!acc[key]) {
        acc[key] = {
          label: id,
          value: 0,
          amount: 0,
        };
      }
  
      // Adjust value based on transaction type
      if (transaction_type === 'BUY') {
        acc[key].value += parseFloat(amount) * parseFloat(price);
        acc[key].amount += parseFloat(amount);

      } else if (transaction_type === 'SELL') {
        acc[key].value -= parseFloat(amount) * parseFloat(price);
        acc[key].amount -= parseFloat(amount);
      }
      return acc;
    }, {});
  
    // Convert the grouped transactions object to an array
    const cryptoData = Object.values(groupedTransactions);
  
    // Calculate the total value of all holdings
    const totalValue = cryptoData.reduce((total, entry) => total + entry.value, 0);
  
    // Calculate the percentage for each holding
    cryptoData.forEach(entry => {
      entry.percentage = (entry.value / totalValue) * 100;
    });
  
    let curSpent = 0;
    let curValue = 0;
  
    cryptoData.forEach((holding) => {
      console.log(holding);
      const purchasePrice = holding.value;
      const purchaseAmount = holding.amount;
      
      const totalSpentForHolding = purchasePrice;
      
      // Calculate the current value for this holding
      const currentValueForHolding = coinPrices.coins[holding.label]  * purchaseAmount;
  
      // Update the overall current spent and current value
      curSpent += totalSpentForHolding;
      curValue += currentValueForHolding;
      console.log(curSpent, curValue);
    });
    CurrentSpent = curSpent !== undefined ? curSpent : 0;
    CurrentValue = curValue !== undefined ? curValue : 0;
    return cryptoData;
  };

  const calculatePortfolioValue = (holdings) => {

  };
  
  const getPieChartData = () => {
    const cryptoData = getCryptoData();
    // Create a pie chart data object
    const data = {
      labels: cryptoData.map(entry => `${entry.label} (${entry.percentage.toFixed(2)}%)`),
      datasets: [
        {
          data: cryptoData.map(entry => entry.value),
          backgroundColor: [
            'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'grey',
            // Add more colors as needed
          ],
        },
      ],
    };
    return data;
  };
  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid grey",
    },
    heading: {
      fontWeight: "bold",
      marginBottom: 20,
      fontFamily: "Montserrat",
    },
    description: {
      width: "100%",
      fontFamily: "Montserrat",
      padding: 25,
      paddingBottom: 15,
      paddingTop: 0,
      textAlign: "justify",
    },
    marketData: {
      alignSelf: "start",
      padding: 25,
      paddingTop: 10,
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-around",
      },
      [theme.breakpoints.down("xs")]: {
        alignItems: "start",
      },
    },
    inputField: {
      width:"100%",
      borderRadius:10,
      '& input': {
        color: 'white',
      },
    },
    buyButton: {
      background:"green",
      width:"100%;",
    },
    sellButton: {
      background:"red",
      width:"100%;",
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <Pie style={{maxHeight:350, margin:20}} data={getPieChartData()} />
        <div className={classes.marketData}>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              Current Value:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {CurrentValue}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            <Typography variant="h5" className={classes.heading}>
              All Time Profit:
            </Typography>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
              {CurrentValue - CurrentSpent}
            </Typography>
          </span>
          <span style={{ display: "flex" }}>
            &nbsp; &nbsp;
            <Typography
              variant="h5"
              style={{
                fontFamily: "Montserrat",
              }}
            >
            </Typography>
          </span>
                <Stack marginBottom={1} direction="row" spacing={.5}>
            <TextField
              className={classes.inputField}
              id="outlined-basic"
              variant="standard"
              label="Coin"
              value={idInput}
              onChange={(e) => setIdInput(e.target.value)}
           focused />

            <TextField
              className={classes.inputField}
              id="outlined-basic"
              label="Quantity"
              variant="standard"
              value={quantityInput}
              onChange={(e) => setQuantityInput(e.target.value)}
              InputProps={{
                style: { color: 'white' },
              }}
              focused />
            <TextField
              className={classes.inputField}
              id="outlined-basic"
              label="Price"
              variant="standard"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              focused />
          </Stack>
          <Stack direction="row" spacing={.5}>
            <Button className={classes.buyButton} variant="contained" onClick={handleBuyClick}>
              Buy
            </Button>
            <Button className={classes.sellButton} variant="contained" onClick={handleSellClick}>
              Sell
            </Button>
          </Stack>
        </div>
      </div>
      <CoinValues holdings={cryptoData} updateHoldings={setCryptoData} />
    </div>
  );
};

export default PortfolioPage;