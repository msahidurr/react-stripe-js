const express = require("express");
const app = express();
var cors = require("cors");
const PORT = 3004;

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

app.post('/create-subscription', async (req, res) => {

  const { priceId, name, email, paymentMethod } = req.body;

  const customer = await stripe.customers.create({
    name: name,
    email: email,
    payment_method: paymentMethod,
    invoice_settings: {
      default_payment_method: paymentMethod,
    },
  });
  
  // create a stripe subscription
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: priceId }],
    payment_settings: {
      payment_method_options: {
        card: {
          request_three_d_secure: 'any',
        },
      },
      payment_method_types: ['card'],
      save_default_payment_method: 'on_subscription',
    },
    expand: ['latest_invoice.payment_intent'],
  });

  // return the client secret and subscription id
  res.send( {
    clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    subscriptionId: subscription.id,
  });
})

app.get("/test", async (req, res) => {
    res.send("test shohid");
  });

app.listen(PORT, () => {
  console.log(`app is listening on port ~${PORT}`);
});