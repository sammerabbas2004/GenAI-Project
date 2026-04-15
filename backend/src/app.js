const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
//Using cookie parser middleware to parse cookies in incoming requests
app.use(cookieParser());
app.use(express.json());
//Requires all auth routes here
const authRouter=require('./routes/auth.routes');
//using auth routes here
app.use('/api/auth',authRouter);

module.exports = app;