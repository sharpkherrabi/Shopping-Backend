const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const config = require('./config/config');

const productRoute = require('./routes/product.route');
const devDbUrl = `${config.dbUrl}:${config.mongoPort}/${config.db}`;
let corsOptions = {
    origin: function(origin, callback){
          let isWhitelisted = config.originsWhitelist.indexOf(origin) !== -1;
          callback(null, isWhitelisted);
    },
    credentials:true
  }

//connection to mongo db
mongoose.connect(devDbUrl, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//parsing using bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

//creating a route handler
app.use('/product', productRoute);
app.use(function (err, req, res, next) {
    if (err)
        res.status(500).json(
            {
                message: err.toString(),
                err
            }
        );
});

//firing the app
app.listen(3000, () => {
    console.log('listenning on port 3000');
});

module.exports = app;