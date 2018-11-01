process.env.NODE_ENV = 'dev';

let mongoose = require("mongoose");
let productModel = require('../models/product.model');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

describe('deleting product', () => {
    beforeEach((done) => {
        productModel.remove({}, (err) => {
            done();
        });
    });

    it('should test deleting all products', (done) => {
        chai.request(server)
            .delete('/product/delete')
            .end((err, res) => {
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('ALL DOCUMENTS DELETED');
                done();
            });
    });

    it('should test when deleting a single product', (done) => {
        let product = {
            name: 'the BASS',
            description: 'or nothing',
            quantity: 3,
            unitPrice: 400,
            bought: true
        };
        chai.request(server)
            .post('/product/create')
            .send(product)
            .end((err, res) => {
                let id = res.body.product._id;
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('product');
                chai.request(server)
                .delete(`/product/delete/${id}`)
                .end((err, res)=> {
                    res.body.should.be.a('object');
                    res.body.should.have.property('message').eql(`DOCUMENT WITH ID ${id} DELETED`);
                    done();
                })
            });
    })
})