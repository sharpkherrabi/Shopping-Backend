process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let productModel = require('../models/product.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('update already existed product', () => {
    beforeEach((done) => {
        productModel.remove({}, (err) => {
            done();
        });
    });

    it('should check if a product is successfully updated after creating it', (done) => { // updating with put means modifiying last purchase
        let product = {
            name: 'the best',
            description: 'or nothing',
            quantity: 3,
            unitPrice: 400,
            bought: true
        };

        let newProd = {
            name: 'the best',
            quantity: 2,

        };

        chai.request(server)
            .post('/product/create')
            .send(product)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('product');
                chai.request(server)
                    .put(`/product/update/${res.body.product._id}`)
                    .send(newProd)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.product.quantity.should.be.eql(newProd.quantity);
                        res.body.product.NumberOfPurchases.should.be.eql(1);
                        res.body.product.averageQuantity.should.be.eql(newProd.quantity);
                        done();
                    });
            });
    });
});