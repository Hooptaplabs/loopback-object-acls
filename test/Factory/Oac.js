/**
 * Created by roger on 3/09/16.
 */

const Factory = require('../../src/factories/Oac');
const {What, Who, Which, When, Request} = require('../../src/factories');
const {expect} = require('../utils');

module.exports = () => {

	it('is a function', () => {
	    expect(Factory).to.be.a('function');
	});

	describe('instances', () => {

		it('creates the defaults', () => {
			let instance = Factory();
			expect(What.isInstanceOf(instance.what)).to.equal(true);
			expect(Who.isInstanceOf(instance.who)).to.equal(true);
			expect(Which.isInstanceOf(instance.which)).to.equal(true);
			expect(When.isInstanceOf(instance.when)).to.equal(true);
		});

		it('has a score', () => {
			let instance = Factory();
			expect(Factory().getScore()).to.equal(0);
		});

	});

	describe('.sortListByScore', () => {
		
		it('(example 1)', () => {
			let oac0 = Factory({which: {property: 'create'}});
			let oac1 = Factory({which: {type: 'READ'}});
			let sortedList = Factory.sortListByScore([oac1, oac0]);

			expect(sortedList).to.be.an('array').and.to.have.length(2);
			expect(sortedList[0]).to.equal(oac0);
			expect(sortedList[1]).to.equal(oac1);
		});

		it('(example 2)', () => {
			let oac0 = Factory({which: {type: 'READ', property: 'create'}, who: {type: 'Role', id: 'admin'}});
			let oac1 = Factory({which: {type: 'READ', property: 'create'}, who: {id: 'admin'}});
			let oac2 = Factory({which: {type: 'READ', property: 'create'}});
			let oac3 = Factory({which: {property: 'create'}});

			let sortedList = Factory.sortListByScore([oac1, oac3, oac2, oac0]);

			//expect(sortedList).to.be.an('array').and.to.have.length(4);
			expect(sortedList[0]).to.equal(oac0);
			expect(sortedList[1]).to.equal(oac1);
			expect(sortedList[2]).to.equal(oac2);
			expect(sortedList[3]).to.equal(oac3);
		});

	});
	
	describe('.allows (static)', () => {

		it('(example 1) - If no Oacs, then is allowed', () => {
			let list = [];
			let r = Request();
			expect(Factory.allows(list, r)).to.equal(true);
		});

		it('(example 2) - If a void Oac, then is denied', () => {
			let list = [Factory()];
			let r = Request();
			expect(Factory.allows(list, r)).to.equal(false);
		});

		it('(example 3) - With two Oacs with same score, DENY wins', () => {
			let list = [Factory(), Factory({what: 'ALLOW'})];
			let r = Request();
			expect(Factory.allows(list, r)).to.equal(false);
		});

		it('(example 4) - Denied for all, allowed for a user', () => {
			let list = [Factory(), Factory({what: 'ALLOW', who: 'roger'})];
			let requestRoger = Request({who: 'roger'});
			let requestManu = Request({who: 'manu'});
			expect(Factory.allows(list, requestRoger)).to.equal(true);
			expect(Factory.allows(list, requestManu)).to.equal(false);
		});

		it('(example 5) - Allowed only for READ properties', () => {
			let list = [Factory(), Factory({what: 'ALLOW', which: {type: 'READ'}})];
			let requestWrite = Request({which: {type: 'WRITE'}});
			let requestRead = Request({which: {type: 'READ'}});
			expect(Factory.allows(list, requestWrite)).to.equal(false);
			expect(Factory.allows(list, requestRead)).to.equal(true);
		});





	});



};
