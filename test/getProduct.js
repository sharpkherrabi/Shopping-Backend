process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let productModel = require('../models/product.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

describe('get products', () => {
    beforeEach((done) => {
        productModel.remove({}, (err) => {
            done();
        });
    });

    it('should test getting a product', (done) => {
        let product = {
            name: 'the BEAST',
            description: 'or Me',
            quantity: 3,
            unitPrice: 400,
            bought: true
        };

        chai.request(server)
            .post('/product/create')
            .send(product)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('product');
                chai.request(server)
                    .get(`/product/get/${res.body.product._id}`)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('products');
                        res.body.products[0].should.be.a('object');
                        res.body.products[0].name.should.be.eql(product.name);
                        done();
                    });
            })
    });
});