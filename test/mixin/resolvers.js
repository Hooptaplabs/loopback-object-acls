/**
 * Created by desaroger on 7/09/16.
 */

let {expect, G, ModelMock} = require('../utils');

module.exports = () => {

	let Model, instance;
	before(G(function* () {
		Model = ModelMock('TestModel', {name: String, age: Number}, {strict: true});
		Model.prototype.getMyName = function() {
			return this.name;
		};
		Model.applyMixin();
		instance = yield Model.create({name: 'juan', age: 23});
	}));

	afterEach(() => {
	    Model.cleanAclsResolvers();
	});

	it('has a function to add resolvers', () => {
	    expect(Model.addAclsResolver).to.be.a('function');
	    expect(instance.addAclsResolver).to.be.a('function');
	});

	it('basic supports for resolvers', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {'instancesCount': {value: {gt: 23}}}}];
		yield expect(check(request, list)).to.eventually.be.rejectedWith('Unknown resolver');
		Model.addAclsResolver('instancesCount', function(options) {
			return 23;
		});
		let allowed = yield expect(check(request, list)).to.eventually.be.fulfilled;
		expect(allowed).to.equal(true);
	}));

	it('the last resolver has priority', G(function* () {
		let list = [{want: 'DENY', when: {'test': {value: {gt: 23}}}}];
		Model.addAclsResolver('test', () => 23);
		Model.addAclsResolver('test', () => 24);
		expect(yield check({}, list)).to.equal(false);
	}));

	it('accepts parameters', G(function* () {
		let list = [{want: 'DENY', when: {'test': {value: true, with: {hello: true}}}}];
		Model.addAclsResolver('test', options => {
			return options.hello;
		});
		expect(yield check({}, list)).to.equal(false);
	}));

	it('finds the resolver in the instance methods', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {'getMyName': 'juan'}}];
		let allow = yield expect(check(request, list)).to.not.be.rejected;
		expect(allow).to.equal(false);
	}));

	it('finds the resolver in the instance properties', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {age: 23}}];
		let allow = yield expect(check(request, list)).to.not.be.rejected;
		expect(allow).to.equal(false);
	}));
	
	it('allow compose boolean logic with OR', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {or: [{age: 24}, {name: 'nope-juan'}]}}];
		expect(yield check(request, list)).to.equal(true);
		list = [{want: 'DENY', when: {or: [{age: 24}, {name: 'juan'}]}}];
		expect(yield check(request, list)).to.equal(false);
		list = [{want: 'DENY', when: {or: [{age: 23}, {name: 'juan'}]}}];
		expect(yield check(request, list)).to.equal(false);
		list = [{want: 'DENY', when: {or: [{age: 23}, {name: 'nope-juan'}]}}];
		expect(yield check(request, list)).to.equal(false);

		// Or with AND-like inside
		list = [{want: 'DENY', when: {or: [{age: 23, name: 'juan-nope'}, {name: 'nope-juan'}]}}];
		expect(yield check(request, list)).to.equal(true);
	}));

	it('allow compose boolean logic with AND', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {and: [{age: 23}, {name: 'juan'}]}}];
		expect(yield check(request, list)).to.equal(false);
		list = [{want: 'DENY', when: {and: [{age: 24}, {name: 'juan'}]}}];
		expect(yield check(request, list)).to.equal(true);
		list = [{want: 'DENY', when: {and: [{age: 24}, {name: 'nope-juan'}]}}];
		expect(yield check(request, list)).to.equal(true);
	}));

	it('the keys in a object is always an AND', G(function* () {
		let request = {which: 'instantiate'};
		let list = [{want: 'DENY', when: {age: 23, name: 'juan'}}];
		expect(yield check(request, list)).to.equal(false);
		list = [{want: 'DENY', when: {age: 23, name: 'nope-juan'}}];
		expect(yield check(request, list)).to.equal(true);
		list = [{want: 'DENY', when: {age: 30, name: 'juan'}}];
		expect(yield check(request, list)).to.equal(true);
	}));


	
	
	
	

	function check(request, acls) {
		let ignore = ['Unknown resolver for when id'];
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
