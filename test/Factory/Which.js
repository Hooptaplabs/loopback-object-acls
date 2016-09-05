/**
 * Created by roger on 3/09/16.
 */

const Factory = require('../../src/factories/Which');
const {expect} = require('../utils');

module.exports = () => {

	it('is a function', () => {
	    expect(Factory).to.be.a('function');
	});

	it('accepts a object', () => {
		let instance = Factory({type: 'READ'});
		expect(instance.toObject()).to.deep.equal({property: null, type: 'READ'});
		instance = Factory({property: 'instantiate'});
		expect(instance.toObject()).to.deep.equal({property: 'instantiate', type: null});
	});

	it('has as defaults all void', () => {
		let instance = Factory();
		expect(instance.toObject()).to.deep.equal({property: null, type: null});
	});

	describe('instances', () => {

		it('has a score of 100 both, property and type are, defined', () => {
			expect(Factory({property: 'asd', type: 'READ'}).getScore()).to.equal(30);
		});

		it('has a score of 80 if only the Property is defined', () => {
			expect(Factory({property: 'asd'}).getScore()).to.equal(20);
		});

		it('has a score of 20 if only the Type is defined', () => {
			expect(Factory({type: 'READ'}).getScore()).to.equal(10);
		});

		it('has valueOf with the score', () => {
			let instance = Factory({type: 'READ'});
			expect(instance.valueOf()).to.equal(10);
			expect(Factory({property: 'ins'}) > Factory({type: 'READ'})).to.equal(true);
		});

		describe('.check', () => {

			it('returns true if there is no requirements', () => {
				let instance = Factory();
				expect(instance.check({type: 'Role'})).to.equal(true);
				expect(instance.check({id: 'Role'})).to.equal(true);
				expect(instance.check({type: 'Role', id: 23})).to.equal(true);
			});

			it('returns true if match type', () => {
				let instance = Factory({type: 'Role'});
				expect(instance.check({type: 'Role'})).to.equal(true);
				expect(instance.check({type: 'Segment'})).to.equal(false);
				expect(instance.check({id: 23})).to.equal(false);
				expect(instance.check({type: 'Role', id: 23})).to.equal(true);
			});

			it('returns true if match property', () => {
				let instance = Factory({property: 'instantiate'});
				expect(instance.check({type: 'READ'})).to.equal(false);
				expect(instance.check({property: 'create'})).to.equal(false);
				expect(instance.check({property: 'instantiate'})).to.equal(true);
				expect(instance.check({type: 'WRITE', property: 'instantiate'})).to.equal(true);
			});

			it('returns true if match type and id', () => {
				let instance = Factory({type: 'WRITE', property: 'create'});
				expect(instance.check({type: 'Role'})).to.equal(false);
				expect(instance.check({property: 'Role'})).to.equal(false);
				expect(instance.check({type: 'Role', property: 'find'})).to.equal(false);
				expect(instance.check({type: 'Segment', property: 'create'})).to.equal(false);
				expect(instance.check({type: 'WRITE', property: 'create'})).to.equal(true);
			});

		});

	});



};
