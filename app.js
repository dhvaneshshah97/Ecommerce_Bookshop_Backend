const express = require('express');
const app = express();
require('dotenv').config();

const authRoute = require('./routes/auth.js');
const userRoute = require('./routes/user.js');
const categoryRoute = require('./routes/category.js');
const productRoute = require('./routes/product.js');
const braintreeRoute = require('./routes/braintree');
const orderRoute = require('./routes/order');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const mongoose = require('mongoose');

// Database conncetion
mongoose.connect(
    process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true}
).then( () => console.log('Database Connceted') );

mongoose.connection.on('error', err => {
    console.log(`DB Conncetion Error: ${err.message}` );
});

// this middleware is used to log incoming requests
app.use(morgan('dev'))

//this package is used to access client's request data in request.body object as a json.
app.use(bodyParser.json())

app.use(cookieParser())

// This package is used to validate signup details.
app.use(expressValidator())

// Reason to use this CORS(Cross Origin Resource Sharing) package: when we send request from forntend(from port 3000) to backend(to port 8000), it will give cors errors, because here both port are different(not the same origin), and to share data between different origins, we have to use CORS.   
app.use(cors());

// we need to import route middlewares to use
app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", braintreeRoute);
app.use("/api", orderRoute);

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});