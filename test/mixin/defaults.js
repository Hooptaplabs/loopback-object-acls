/**
 * Created by desaroger on 7/09/16.
 */

let {expect, G, ModelMock} = require('../utils');

module.exports = () => {

	let Model, instance, setRole;
	before(G(function* () {
		Model = ModelMock('TestModel', {}, {strict: true});
		Model.applyMixin();

		Model.addAclsDefaults([
			{want: 'DENY'},
			{want: 'ALLOW', who: 'Admin'},
			{want: 'DENY', which: 'EXEC'}
		]);

		// Test mock
		let role = 'Customer';
		setRole = newRole => role = newRole;
		Model.prototype.delete = G(function* Buy() {
			yield this.requireCan({who: role});
		});
		Model.prototype.buy = G(function* Buy() {
			yield this.requireCan({which: {type: 'EXEC'}});
		});

		instance = yield Model.create({name: 'juan', stock: 0});
	}));

	it('don\'t allow delete for customers', G(function* () {
		yield expect(instance.delete()).to.eventually.be.rejectedWith('Not allowed.');
	}));

	it('allows for admins', G(function* () {
		setRole('Admin');
		yield expect(instance.delete()).to.eventually.be.fulfilled;
	}));

	it('DENY for EXEC for admins', G(function* () {
		setRole('Admin');
		yield expect(instance.buy()).to.eventually.be.rejectedWith('Not allowed.');
	}));

	it('DENY for EXEC for customers', G(function* () {
		setRole('Customer');
		yield expect(instance.buy()).to.eventually.be.rejectedWith('Not allowed.');
	}));


};
