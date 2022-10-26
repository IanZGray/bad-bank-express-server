require('dotenv').config()
const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");

// if (process.env.NODE_ENV !== 'production') {
//     require('dotenv').config()
// }


const PORT = process.env.PORT || 3001

connectDB();

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', require('./routes/usersRoute'));

//Serve static assets if in production
if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static("/views"));
  
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "views", "index.html"));
    });
}

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,`mongoErrLog.log`)
})