/**
 * Created by desaroger on 7/09/16.
 */

let {expect, G, ModelMock, TimeMock} = require('../utils');

module.exports = () => {
	// skip

	let Model, time, instance, setUser;
	before(G(function* () {
		time = TimeMock();
		Model = ModelMock('TestModel', {name: String, stock: Number}, {strict: true});
		Model.applyMixin();
		
		// Sugar
		
		Model.addAclsSugar('stock', (stock) => {
		    return [{want: 'DENY', which: 'buy', when: {getTickets: {gte: stock}}}]
		});
		
		// Test mock
		let currentUser = false;
		let instances = [{user: 'pepe', date: time.get()}];
		setUser = function(user) {
			currentUser = user;
		};
		Model.prototype.buy = G(function* () {
			yield this.requireCan('buy');
		    instances.push({
				user: currentUser,
				date: time.get()
			})
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
