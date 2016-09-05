/**
 * Created by roger on 3/09/16.
 */

const Factory = require('../../src/factories/What');
const {expect} = require('../utils');

module.exports = () => {

	it('is a function', () => {
	    expect(Factory).to.be.a('function');
	});

	it('accepts a object', () => {
		let instance = Factory({permission: 'DENY'});
		let obj = instance.toObject();
		expect(obj).to.deep.equal({permission: 'DENY'});
	});

	it('has as defaults permission: DENY', () => {
		let instance = Factory();
		let obj = instance.toObject();
		expect(obj).to.deep.equal({permission: 'DENY'});
	});

	describe('instances', () => {

		it('has a score of 100 if the permission is the default (DENY)', () => {
			expect(Factory({permission: 'DENY'}).getScore()).to.equal(20);
		});

		it('has a score of 100 if the permission is DENY', () => {
			expect(Factory({permission: 'DENY'}).getScore()).to.equal(20);
		});

		it('has a score of 50 if the permission is ALLOW', () => {
			expect(Factory({permission: 'ALLOW'}).getScore()).to.equal(10);
		});

		it('has valueOf with the score', () => {
			let instance = Factory({permission: 'ALLOW'});
			expect(instance.valueOf()).to.equal(10);
			expect(Factory({permission: 'DENY'}) > Factory({permission: 'ALLOW'}));
		});

	});



};
