require('./config/config');
// imports
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');

const app = express();

//Enable cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

// Enable static Folder and use fake path
app.use('/files', express.static(path.resolve(__dirname, '../uploads')))
app.use(morgan('dev'))


// Routes global Configuration
app.use(require('./routes/index'));



// // database conection
// mongoose.connect(process.env.URLDB, (err, res) => {
    
//     if (err) throw err;
    
//     console.log('Database SUCCESSFULLY connected');
    
// });
mongoose.connection.openUri('mongodb+srv://master:890607@cluster0-7cace.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {

        if (err) throw err;
        console.log('Basde de datos: \x1b[32m%s\x1b[0m', 'online');
    });
// (err, res) => {

    //     if (err) throw err;
    //     console.log('Basde de datos: \x1b[32m%s\x1b[0m', 'online');
    // });

    
// listen app
app.listen(process.env.PORT, () => {
    console.log('This is where magic happens: ', process.env.PORT);
});



