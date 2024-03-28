const express = require("express");
const app = express();
var cors = require("cors");
const PORT = 3001;

const stripe = require("stripe")("sk_test_51Oqv91IsLSX0wXZBfBMh01oIDqdwKmZRMTOoD1V5AyDyseDSKX64vgRmvC0TYZppyZgqOesKihAInmtuoFJDhYdL00pywuCxag");

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Create a Payment Intent (returns the client with a temporary secret)
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: price*100,
    currency: "usd",
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/create-payment-intent", async (req, res) => {
    res.send("test shohid");
  });

app.listen(PORT, () => {
  console.log(`app is listening on port ~${PORT}`);
});