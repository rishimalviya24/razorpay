require('dotenv').config();
const express = require('express')
const app = express()
app.set('view engine','ejs')

const Razorpay = require('razorpay');
const connect = require('./db/db.config');
const paymentModel = require('./models/payment');


connect();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get('/',(req,res) => {
    res.render('index'); 
})

app.post('/create/orderId', async (req, res) => {
    const options = {
      amount: 5000 * 100, // amount in smallest currency unit
      currency: "INR",
    };
    try {
      const order = await razorpay.orders.create(options);
      res.send(order);
  
      const newPayment = await paymentModel.create({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        status: 'pending',
      });
  
    } catch (error) {
      res.status(500).send('Error creating order');
    }
  });

app.listen(3000);