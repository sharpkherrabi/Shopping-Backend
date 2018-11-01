let productModel = require('../models/product.model');
const _ = require('lodash');
// When a product got updated using put. It means modify the last purchase of this product..
module.exports = function (req, res, next) {
    let options = { new: true, runValidators: true, setDefaultsOnInsert: true };
    const productNotExisting = 'PRODUCT DOES\'T EXIST!';
    if (_.isUndefined(req.params.productId))
        return next(new Error('URL DOESN\'T CONTAIN AN ID!'));
    if (req.body.quantity) {
        productModel.findById(
            req.params.productId,
            function (err, prod) {
                if (err || _.isNull(prod)) return next(new Error(productNotExisting));
                prod.downgradeAverageQuantity();
                prod.downgradeTotalQuantity();
                prod.save().then(() => updateProduct()).catch((err) => next(err));
            });
    }
    function updateProduct() {
        productModel.findByIdAndUpdate(
            req.params.productId,
            req.body,
            options,
            (err, product) => {
                if (err) return next(new Error(productNotExisting));
                if (req.body.quantity) {
                    setTimeout(function () {
                        product.updateAverageQuantity();
                        product.updateTotalQuantity();
                    });
                }
                product.save()
                    .then(() => res.status(201).json(
                        {
                            status: 'UPDATED!',
                            product
                        }
                    )).catch(err => next(new Error('INTERNAL ERROR OCCURED!')));
            });
    };

}