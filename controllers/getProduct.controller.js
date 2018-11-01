const request = require('request-promise');
let productModel = require('../models/product.model');
const _ = require('lodash');
const config = require('../config/config');
module.exports = function (req, res, next) {
    let condition = {}, listOfSymbols = [], convertRate = 0;
    if (!_.isUndefined(req.params.productId))
        condition._id = req.params.productId;

    request.get( // get all currency symbols 
        `${config.forexUrl}symbols?api_key=${config.forexApiKey}`,
        { json: true },
        function (err, res, body) {
            if (err) return next(err);
            _.each(body, function (currency) {
                listOfSymbols = listOfSymbols.concat(currency.match(/.{1,3}/g)); //the api just offers symbols concatenated, with this line I'm seperating the strings
            });
            listOfSymbols = _.uniq(listOfSymbols); //delete duplicates
        }).then(() => findProduct());

    function findProduct() {
        productModel.find(condition, async function (err, products) {
            if (err) return next(new Error('COULDN\'T FIND THIS PRODUCT'));
            if (!_.isUndefined(req.query.curr)) {
                if (!listOfSymbols.includes(req.query.curr)) return next(new Error('THIS CURRENCY IS NOT SUPPORTED'));
                await request.get(
                    `${config.forexUrl}quotes?pairs=EUR${req.query.curr}&api_key=${config.forexApiKey}`,
                    { json: true },
                    function (err, res, body) {
                        if (err) return next(err);
                        convertRate = _.head(body).price;
                    });
                updatePrices(products);
            }

            res.status(200).json({
                status: 'OK',
                products
            })
        });
    }

    function updatePrices(products) {
        _.each(products, function (product) {
            product.set('unitPrice', product.get('unitPrice', Number) * convertRate);
        })
    }
}