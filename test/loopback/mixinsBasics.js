/**
 * Created by desaroger on 6/09/16.
 */

let {expect, G, ModelMock} = require('../utils');

module.exports = () => {

	let Model;
	before(G(function* () {
		Model = ModelMock('TestModel', {}, {strict: true});
	}));

	describe('when used', () => {

		it('initially instances has no method "can"', G(function* () {
			let instance = yield Model.create();
			expect(instance.can).to.not.be.a('function');
		}));

		it('don\'t throw even with 0 config', () => {
			expect(() => Model.applyMixin()).to.not.throw();
		});

	});

	describe('when applied', () => {

		let instance;
		before(G(function* () {
			instance = yield Model.create();
		}));

		it('creates the instance', () => {
			expect(instance).to.be.ok;
		});

		it('adds the method "can"', () => {
			expect(instance.can).to.be.a('function');
		});

		it('our model has strict enabled (test check)', G(function* () {
			expect(instance.qwe).to.equal(undefined);
			yield instance.updateAttributes({qwe: 23});
			expect(instance.qwe).to.equal(undefined);
		}));

		it('adds the property "acls"', G(function* () {
			expect(instance.acls).to.equal(undefined);
			yield instance.updateAttributes({acls: []});
			expect(instance.acls).to.deep.equal([]);
		}));

	});

	describe('basics', () => {

		let instance;
		before(G(function* () {
			instance = yield Model.create();
		}));

		it('creates the instance', () => {
			expect(instance).to.be.ok;
		});

		it('if no acls, always is true', G(function* () {
			let allowed = yield check({who: 'juan'}, []);
			expect(allowed).to.equal(true);
		}));

		describe('(examples)', () => {

			it('1 - Valid who', G(function* () {
				let list = [{what: 'DENY'}, {what: 'ALLOW', who: 'Pepe'}];
				let juanAllowed = yield check({who: 'juan'}, list);
				let pepeAllowed = yield check({who: 'Pepe'}, list);
				expect(juanAllowed).to.equal(false);
				expect(pepeAllowed).to.equal(true);
			}));

			it('2 - Valid who with type', G(function* () {
				let list = [{what: 'DENY', who: {type: 'Dev'}}, {what: 'ALLOW', who: {type: 'Dev', id: 'juan'}}];
				let noDevAllowed = yield check({who: {type: 'Admin', id: 'pepe'}}, list);
				let juanAllowed = yield check({who: {type: 'Dev', id: 'juan'}}, list);
				let pepeAllowed = yield check({who: {type: 'Dev', id: 'pepe'}}, list);
				expect(noDevAllowed).to.equal(true);
				expect(juanAllowed).to.equal(true);
				expect(pepeAllowed).to.equal(false);
			}));

			it('3 - On who, id has more priority than type', G(function* () {
				let list = [{what: 'DENY', who: {type: 'Customer'}}, {what: 'ALLOW', who: {id: 'Pepe'}}];
				let adminAllowed = yield check({who: {type: 'Admin', id: 'someAdmin'}}, list);
				let pepeAllowed = yield check({who: {type: 'Customer', id: 'Pepe'}}, list);
				let juanAllowed = yield check({who: {type: 'Customer', id: 'Juan'}}, list);
				expect(adminAllowed).to.equal(true);
				expect(pepeAllowed).to.equal(true);
				expect(juanAllowed).to.equal(false);
			}));

			it('4 - On which, id has more priority than type', G(function* () {
				let list = [{what: 'DENY', which: {type: 'WRITE'}}, {what: 'ALLOW', which: {id: 'instantiate'}}];
				let readAllowed = yield check({which: {type: 'READ', id: 'read'}}, list);
				let instantiateAllowed = yield check({which: {type: 'WRITE', id: 'instantiate'}}, list);
				let createAllowed = yield check({which: {type: 'WRITE', id: 'create'}}, list);
				expect(readAllowed).to.equal(true);
				expect(instantiateAllowed).to.equal(true);
				expect(createAllowed).to.equal(false);
			}));

		});
		
		function check(request, acls) {
			return instance.updateAttributes({acls})
				.then(() => {
					return instance.can(request);
				})
				.catch(e => {
					console.log('ERROR', e);
				});
		}

	});

};
