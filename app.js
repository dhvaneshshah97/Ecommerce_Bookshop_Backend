const express = require('express');
const app = express();
require('dotenv').config();
const authRoute = require('./routes/auth.js');
const userRoute = require('./routes/user.js');
const categoryRoute = require('./routes/category.js');
const productRoute = require('./routes/product.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

// Database conncetion
mongoose.connect(
    process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true}
).then( () => console.log('Database Connceted') );

mongoose.connection.on('error', err => {
    console.log(`DB Conncetion Error: ${err.message}` );
});

// middlewares
app.use(morgan('dev'))

//this package is used to access client's request data in request.body object as a json.
app.use(bodyParser.json())

app.use(cookieParser())

// This package is used to validate signup details.
app.use(expressValidator())

// we need to import route middlewares to use
app.use("/api",authRoute);
app.use("/api",userRoute);
app.use("/api",categoryRoute);
app.use("/api",productRoute);

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});