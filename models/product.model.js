const mongoose = require('mongoose');
const _ = require('lodash');
const { Schema } = mongoose;
const validator = require('validator');
const timestampPlugin = require('./plugins/timestamp');
const findOneAndUpdatePlugin = require('./plugins/findOneAndUpdate');

const unitOfMass = { 'mg': 1, 'g': 1000, 'kg': 1000000 };

let productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        validate: (value) => {
            return validator.matches(value, /^[a-z0-9 ]+$/i);;
        }
    },
    quantity: {
        type: Number,
        required: true,
        validate: (value) => {
            return parseInt(value) >= 0;
        }
    },
    unitPrice: {
        type: Number,
        required: true,
        validate: (value) => {
            return parseInt(value) > 0
        }
    },
    totalQuantity: {
        type: Number,
        default: 0,
        validate: (value) => {
            return parseInt(value) >= 0;
        }
    },
    mass: {
        type: Number,
        validate: (value) => {
            return parseFloat(value) >= 0;
        }
    },
    unit: {
        type: String,
        validate: (value) => {
            return _.keys(unitOfMass).includes(value);
        }
    },
    bought: {
        type: Boolean,
        default: false
    },
    averageQuantity: {
        type: Number,
        validate: (value) => {
            return parseFloat(value) >= 0;
        }
    },
    lastPurchase: Date,
    NumberOfPurchases: {
        type: Number,
        default: 0,
        validate: (value) => {
            return parseInt(value) >= 0;
        }
    }
});

productSchema.plugin(timestampPlugin);
productSchema.plugin(findOneAndUpdatePlugin);

productSchema.methods.updateAverageQuantity = function () {
    if (_.isUndefined(this.get('averageQuantity'))) {
        this.set('averageQuantity', this.get('quantity'));
    } else {
        // take a look at the readme for clarification
        this.set('averageQuantity', (this.get('averageQuantity', Number) * (this.get('NumberOfPurchases', Number) - 1) + this.get('quantity', Number)) / this.get('NumberOfPurchases', Number));
    }
};

productSchema.methods.downgradeAverageQuantity = function () {
    // take a look at the readme for clarification
    if (this.get('NumberOfPurchases', Number) > 1)
        this.set('averageQuantity', (this.get('averageQuantity', Number) * this.get('NumberOfPurchases', Number) - this.get('quantity')) / (this.get('NumberOfPurchases', Number) - 1));
    else
        this.set('averageQuantity', 0);
};

productSchema.methods.updateLastPurchase = function () {
    this.set('lastPurchase', Date.now());
};

productSchema.methods.updateNumberOfPurchases = function () {
    let NOP = this.get('NumberOfPurchases', Number);
    this.set('NumberOfPurchases', ++NOP);
};

productSchema.methods.updateTotalQuantity = function () {
    this.set('totalQuantity', this.get('totalQuantity', Number) + this.get('quantity', Number));
};

productSchema.methods.downgradeTotalQuantity = function () {
    this.set('totalQuantity', this.get('totalQuantity', Number) - this.get('quantity', Number));
}

module.exports = mongoose.model('Product', productSchema);