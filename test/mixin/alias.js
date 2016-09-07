/**
 * Created by desaroger on 7/09/16.
 */

let {expect, G, ModelMock} = require('../utils');

module.exports = () => {

	let Model, instance;
	before(G(function* () {
		Model = ModelMock('TestModel', {}, {strict: true});
		Model.applyMixin();
		instance = yield Model.create();
	}));
	
	it('instances has method "addAclsAlias"', () => {
	    expect(instance.addAclsAlias).to.be.a('function');
	});

	it('by default there is no default method type for "which"', G(function* () {
			let request = {which: 'instantiate'};
			let list = [{want: 'DENY', which: {type: 'EXEC'}}];
			expect(yield check(request, list)).to.equal(true);
	}));

	it('we can specify the instance type', G(function* () {
		let request = {which: {type: 'EXEC', id: 'instantiate'}};
		let list = [{want: 'DENY', which: {type: 'EXEC'}}];
		expect(yield check(request, list)).to.equal(false);
	}));

	it('but is a good approach to add an alias', G(function* () {
		instance.addAclsAlias('Which', 'instantiate', {type: 'EXEC', id: '$' /* $ equals to alias key */});
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', which: {type: 'EXEC'}}];
		expect(yield check(request, list)).to.equal(false);
	}));

	function check(request, acls) {
		let ignore = [];
		return instance.updateAttributes({acls})
			.then(() => {
				return instance.can(request);
			})
			.catch(e => {
				if (!ignore.some(ignored => ~e.message.indexOf(ignored))) {
					console.log('ERROR', e);
				}
				throw e;
			});
	}

};
