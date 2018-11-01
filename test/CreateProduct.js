process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let productModel = require('../models/product.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);

describe('create new product', () => {
    beforeEach((done) => {
        productModel.remove({}, (err) => {
            done();
        });
    });

    it('create a new Product', (done) => {
        let product = {
            name: 'mercedes-benz',
            bought: true,
            quantity: 4,
            unitPrice: 80000,
            description: 'german car',
        };
        chai.request(server)
            .post('/product/create')
            .send(product)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('product');
                res.body.product.should.have.property('description');
                res.body.product.totalQuantity.should.be.eql(product.quantity);
                res.body.product.unitPrice.should.be.eql(product.unitPrice);
                done();
            });
    });

    it('should test when POSTing a product that already exists (new purchase)', (done) => {
        let alpha = {
            name: 'alfa romeo',
            bought: true,
            quantity: 6,
            unitPrice: 5000,
            description: 'italian car'
        },
            alpaSister = {
                name: 'alfa romeo',
                quantity: 4,
                description: 'override italian car'
            };

        chai.request(server)
            .post('/product/create')
            .send(alpha)
            .end((err, res) => {
                chai.request(server)
                    .post('/product/create')
                    .send(alpaSister)
                    .end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.have.property('product');
                        res.body.product.totalQuantity.should.be.eql(alpha.quantity + alpaSister.quantity);
                        res.body.product.averageQuantity.should.be.eql((alpha.quantity + alpaSister.quantity) / 2);
                        res.body.product.NumberOfPurchases.should.be.eql(2);
                        done();
                    })
            });

    });
});