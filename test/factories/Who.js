/**
 * Created by desaroger on 4/09/16.
 */

const Factory = require('../../src/factories/Who');
const {expect, ModelMock} = require('../utils');

module.exports = () => {

	it('is a function', () => {
	    expect(Factory).to.be.a('function');
	});

	describe('instance', () => {

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

			it('returns true if match id', () => {
				let instance = Factory({id: 23});
				expect(instance.check({type: 'Role'})).to.equal(false);
				expect(instance.check({id: 30})).to.equal(false);
				expect(instance.check({id: 23})).to.equal(true);
				expect(instance.check({type: 'Role', id: 23})).to.equal(true);
			});

			it('returns true if match type and id', () => {
				let instance = Factory({type: 'Role', id: 23});
				expect(instance.check({type: 'Role'})).to.equal(false);
				expect(instance.check({id: 'Role'})).to.equal(false);
				expect(instance.check({type: 'Role', id: 30})).to.equal(false);
				expect(instance.check({type: 'Segment', id: 23})).to.equal(false);
				expect(instance.check({type: 'Role', id: 23})).to.equal(true);
			});

			it('has loopback', () => {
			    let Model = ModelMock('Juan');
				Model.applyMixin();
			});

		});

	});

};
