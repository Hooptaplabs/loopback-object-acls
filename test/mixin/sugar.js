/**
 * Created by desaroger on 7/09/16.
 */

let {expect, G, ModelMock} = require('../utils');

module.exports = () => {

	let Model, instance, resetTickets;
	before(G(function* () {
		Model = ModelMock('TestModel', {name: String, stock: Number}, {strict: true});
		Model.applyMixin();


		// Sugar
		Model.addAclsSugar('stock', (stock) => {
		    return [{want: 'DENY', which: 'buy', when: {getTickets: {gte: stock}}}]
		});

		// Test mock
		let tickets = 0;
		resetTickets = () => tickets = 0;
		Model.prototype.buy = G(function* Buy() {
			tickets++;
		});
		Model.prototype.buyWithAcls = G(function* Buy() {
			yield this.requireCan('buy');
			tickets++;
		});
		Model.prototype.getTickets = function() {
			return tickets;
		};

		instance = yield Model.create({name: 'juan', stock: 0});
	}));

	it('can get the tickets', () => {
		expect(instance.getTickets()).to.equal(0);
	});

	it('increments tickets when buy', G(function* () {
		yield instance.buy();
		expect(instance.getTickets()).to.equal(1);
		resetTickets();
	}));

	it('don\'t allow when there is no stock', G(function* () {
		expect(yield check({which: 'buy'})).to.equal(false);
	}));

	it('allow if there is stock', G(function* () {
		expect(yield check({which: 'buy'})).to.equal(false);
		yield instance.updateAttributes({stock: 1});
		expect(yield check({which: 'buy'})).to.equal(true);
	}));
	
	it('can be the function the one that allows or not.', G(function* () {
		yield instance.updateAttributes({stock: 1});
	    yield expect(instance.buy()).to.eventually.be.fulfilled;
	    yield expect(instance.buyWithAcls()).to.eventually.be.rejectedWith('Not allowed.');
	}));


	function check(request) {
		let ignore = [];
		return instance.can(request)
			.catch(e => {
				if (!ignore.some(ignored => ~e.message.indexOf(ignored))) {
					console.log('ERROR', e);
				}
				throw e;
			});
	}

};
