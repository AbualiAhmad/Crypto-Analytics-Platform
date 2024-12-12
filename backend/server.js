const axios = require("axios");
const { Pool } = require("pg");
const express = require("express");
const pg = require("pg");
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();
const cors = require("cors");
const port = 5000;
const hostname = "localhost";
app.use(express.json());
const corsOptions = {
    origin:'http://localhost:3000', 
    credentials:true,
    optionSuccessStatus:200
}

app.use(cors(corsOptions));
app.use(express.static("public"));
const coingeckoBaseURL = "https://api.coingecko.com/api/v3";

let { PGUSER, PGDATA, PGPASSWORD, PGPORT, PGHOST } = process.env;
let pool = new Pool({ PGUSER, PGDATA, PGPASSWORD, PGPORT, PGHOST });

pool.connect().then(function () {
  console.log(`Connected to the database`);
});

const hashPassword = async (plainTextPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainTextPassword, saltRounds);
  return hash;
};

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const client = await pool.connect();
    console.log(req);
    const result = await client.query('INSERT INTO accounts (username, password) VALUES ($1, $2) RETURNING id', [username, hashedPassword]);
    console.log(req);
    res.status(201).json({ id: result.rows[0].id, message: 'User created successfully' });
    client.release();
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, password FROM accounts WHERE username = $1', [username]);
    if (result.rows.length > 0) {
      const isValid = await bcrypt.compare(password, result.rows[0].password);
      if (isValid) {
        res.status(200).json({ id: result.rows[0].id, message: 'Authentication successful' });
      } else {
        res.status(401).json({ message: 'Authentication failed' });
      }
    } else {
      res.status(404).json({ message: 'User not found' });
    }
    client.release();
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});

app.get("/coin-list", async (req, res) => {
  try {
    const currency = "usd";
    const coinListURL = `${coingeckoBaseURL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`;
    const coinListResponse = await axios.get(coinListURL);
    res.json(coinListResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching coin list data" });
  }
});

app.get("/trending-coins", async (req, res) => {
  try {
    const currency = "usd";
    const trendingCoinsURL = `${coingeckoBaseURL}/coins/markets?vs_currency=${currency}&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`;
    console.log(trendingCoinsURL);
    const trendingCoinsResponse = await axios.get(trendingCoinsURL);
    console.log("HTTP request received");
    res.json(trendingCoinsResponse.data);
  } catch (error) {
    console.error(error);
    console.log("errd");
    res.status(500).json({ error: "An error occurred while fetching trending coin data" });
  }
});

app.get("/single-coin/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const singleCoinURL = `${coingeckoBaseURL}/coins/${id}`;
    const singleCoinResponse = await axios.get(singleCoinURL, config);
    res.json(singleCoinResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching single coin data" });
  }
});

app.get("/historical-chart/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const days = req.query.days;
    console.log(days);
    const currency = "usd";
    const historicalChartURL = `${coingeckoBaseURL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`;
    const historicalChartResponse = await axios.get(historicalChartURL);
    res.json(historicalChartResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching historical chart data" });
  }
});


app.get("/transactions/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await pool.query('SELECT * FROM crypto_transactions WHERE user_id = $1', [userId]);
    res.json(transactions.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching transactions" });
  }
});

app.post("/transactions", async (req, res) => {
  const { user_id, id, transaction_type, amount, price } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query('INSERT INTO crypto_transactions (user_id, id, transaction_type, amount, price) VALUES ($1, $2, $3, $4, $5) RETURNING transaction_id', [user_id, id, transaction_type, amount, price]);
    res.status(201).json({ transaction_id: result.rows[0].transaction_id, message: 'Transaction created successfully' });
    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating transaction' });
  }
});

app.post("/add-favorite", async (req, res) => {
  const { user_id, coin_id } = req.body;
  try {
    const client = await pool.connect();
    await client.query('INSERT INTO favorites (user_id, coin_id) VALUES ($1, $2)', [user_id, coin_id]);
    console.log('Favorite added successfully'); // Add this line for logging
    res.status(201).json({ message: 'Favorite added successfully' });
    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding favorite' });
  }
});

app.post("/remove-favorite", async (req, res) => {
  const { user_id, coin_id } = req.body;
  try {
    const client = await pool.connect();
    await client.query(
      "DELETE FROM favorites WHERE user_id = $1 AND coin_id = $2",
      [user_id, coin_id]
    );
    console.log("Favorite removed successfully"); // Add this line for logging
    res.status(200).json({ message: "Favorite removed successfully" });
    client.release();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing favorite" });
  }
});

app.get("/favorites/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const favorites = await pool.query('SELECT coin_id FROM favorites WHERE user_id = $1', [userId]);
    res.json(favorites.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching favorites" });
  }
});


app.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
