const _ = require('lodash');
let productModel = require('../models/product.model');
module.exports = function (req, res, next) {
    let condition = {};
    if (!_.isUndefined(req.params.productId))
        condition._id = req.params.productId;

    productModel.remove(condition, function (err) {
        if (err) return next(err);
        res.status(201).json(
            {
                status: 'REMOVED',
                message: _.isUndefined(req.params.productId) ? 'ALL DOCUMENTS DELETED' : `DOCUMENT WITH ID ${req.params.productId} DELETED`
            }
        );
    });
}