let productModel = require('../models/product.model');
let csv = require('csv-express');
const _ = require('lodash');

const pickedProperties = ['name', "description", "quantity", "unitPrice", "createdAt", "updatedAt", "lastPurchase", "NumberOfPurchases"];
module.exports = function (req, res, next) {
    productModel.find({}, function (err, products) {
        if (err) return next(new Error('COULDN\'T FIND ANY PRODUCT'));
        let productList = [];
        productList.push(pickedProperties);
        _.each(products, function (product) {
            productList.push(_.chain(product).pick(pickedProperties).values().value());
        });
        res.csv(productList);
    })
}