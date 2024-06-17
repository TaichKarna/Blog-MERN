const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')

const app = express();

mongoose.connect(process.env.MONGODB_URL)
.then(() => {
    console.log("database is connected")
})

app.listen(3000,() => {
    console.log("listening to this server")
})

app.use(express.json())
app.use(express.urlencoded())

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})