let productModel = require('../models/product.model');
let _ = require('lodash');
module.exports = function (req, res, next) {
    if (req.body) {
        let status = '',
            isNEW = false;
        const automaticallyUpdatedFields = ['totalQuantity', 'averageQuantity', 'lastPurchase', 'NumberOfPurchases'],//these fields can't be updated manually
            options = { new: true, runValidators: true, upsert: true },
            productName = req.body.name;
        if (_.isUndefined(productName))
            return next(new Error('NO NAME COULD BE RETRIEVED'));
            //with findOneAndUpdate I could't know if a product is new or not even checking
            //the property .isNew doesn't work. Thus I have to check if it's already in the db with findONe.
        productModel.findOne(
            { name: productName },
            function (err, prod) {
                if(err) next(new Error('INTERNAL ERROR'));
                if (_.isNull(prod)) {
                    isNEW = true;
                }
            });
        productModel.findOneAndUpdate(
            { name: productName },
            _.omit(req.body, automaticallyUpdatedFields), 
            options,
            function (err, product) {
                if (err)
                    return next(new Error('INTERNAL ERROR'));
                status = isNEW ? 'PRODUCT CREATED SUCCESSFULLY' : 'PRODUCT UPDATED SUCCESSFULLY';
                if (req.body.quantity) {
                    product.updateLastPurchase();
                    product.updateNumberOfPurchases();
                    product.updateAverageQuantity();
                    product.updateTotalQuantity();
                }
                product.save()
                    .then(() => res.status(201).json(
                        {
                            status,
                            product
                        }
                    )).catch(err => next(new Error('INTERNAL ERROR OCCURED!')));
            });
    }
}