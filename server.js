require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
// const { application } = require("express");


const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }


const PORT = process.env.PORT || 3001

connectDB()

app.use(cors(corsOptions));

app.use(express.json());

// add static path?

// add main route?

app.use('/', require('./routes/usersRoute'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        // res.sendFile(path.join(__dirname, 'views', '404.html'))
        console.log('404 Not Found')
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// app.listen(PORT, () => {
//     console.log(`express server is running on port ${PORT}`)
// })

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,`mongoErrLog.log`)
})