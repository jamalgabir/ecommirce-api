const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const cookie = require("cookie");
const dotenv =require('dotenv').config();
const userRouter = require('./routers/user');
const loginandRegisterRouter = require('./routers/LoginAndRegister');
const productsRouter = require('./routers/product');
const CardRoter = require('./routers/card');
const OrderRouter = require('./routers/order');
const cors = require('cors');
const StripeRoutere = require('./routers/strip');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_URL)
.then(()=>console.log('the dataBase connected successfuly'))
.catch((error)=>{
    console.log(error)
});

const app = express();
app.use(cookieParser())
app.use(cors());
const port = process.env.PORT || 3001;
app.use(express.json({credentials: true}));

app.use('/api',userRouter);
app.use('/api',loginandRegisterRouter);
app.use('/api/products',productsRouter);
app.use('/api/card',CardRoter);
app.use('/api/orders',OrderRouter);
app.use('/api/checkout',StripeRoutere);

app.listen(port, () =>{
    console.log(port)
});
