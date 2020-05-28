const express = require('express');
const app = express();
require('dotenv').config();
const userRouter = require('./routes/route.js');
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
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
console.log("after validator")
// route middleware
app.use("/api",userRouter);

const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});