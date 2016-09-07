/**
 * Created by desaroger on 4/09/16.
 */

const Stampit = require('stampit');
const _ = require('lodash');
const Filter = require('loopback-filters');
const {G} = require('../utils');
const {basics} = require('./partials');

const When = module.exports = Stampit()
	.compose(basics)
	.init(function WhenInit() {})
	.methods({

		resolve(resolvers = [], instance = {}) {
			// console.log('');
			// console.log('RESOLVING', resolvers.length, Object.keys(instance.toJSON()));

			// To get first the last
			resolvers = resolvers.reverse();

			let exampleResolver = {
				id: 'instanceCount'
			};

			return G(function* () {
				
				let obj = this.toObject();
				let keys = Object.keys(obj);

				for (let i=0; i < keys.length; i++) {
					let key = keys[i];
					let value = obj[key];

					let result = false;
					if (key == 'or') {
						let data = value.map(convertArrayItem);
						result = yield this.resolveArray(data, resolvers, instance, false);
					} else if (key == 'and') {
						let data = value.map(convertArrayItem);
						result = yield this.resolveArray(data, resolvers, instance, true);
					} else {
						result = yield this.resolveItem(key, value, resolvers, instance);
					}

					if (result) {
						continue;
					} else {
						return false;
					}

				}


				function convertArrayItem(item) {
					let keys = Object.keys(item);
					let result = keys.map(key => ({key, value: item[key]}));
					if (result.length == 1) {
						result = result[0];
					}
					return result;
				}

				return true;
			}.bind(this))();
		},

		resolveArray(array, resolvers, instance, isAnd = true) {
			// console.log('Resolve Array', array, '//', resolvers.length, Object.keys(instance.toJSON()));

			return G(function* () {

				for (let i=0; i < array.length; i++) {
					let item = array[i];

					let result = false;
					if (_.isArray(item)) {
						result = yield this.resolveArray(item, resolvers, instance, true);
					} else {
						result = yield this.resolveItem(item.key, item.value, resolvers, instance);
					}

					if (result) {
						if (isAnd) {
							continue;
						} else {
							return true;
						}
					} else {
						if (isAnd) {
							return false;
						} else {
							continue;
						}
					}
				}

				return isAnd ? true : false;
				
			}.bind(this))();
		},

		resolveItem(id, lucene, resolvers, instance) {
			// console.log('Resolve item', id, lucene, '//', resolvers.length, Object.keys(instance.toJSON()));

			return G(function* () {
				// Finds on resolvers
				let resolver = resolvers.find(resolver => resolver.id == id);

				// Finds on instance methods
				if (!resolver) {
					if (typeof instance[id] == 'function') {
						resolver = {resolver: (opts) => {
						    return instance[id](opts);
						}}
					}
				}

				// Find on instance properties
				if (!resolver) {
					if (instance[id] != undefined) {
						resolver = {resolver: () => instance[id]}
					}
				}

				if (!resolver) {
					throw new Error(`Unknown resolver for when id "${id}."`);
				}

				let result = yield resolver.resolver(lucene.with || {});

				// Prepare lucene filter
				if (!lucene.value) {
					lucene = {value: lucene};
				}
				delete lucene.with;
				lucene = {where: lucene};
				let data = [{value: result}];
				let match = Filter(data, lucene).length > 0;
				// console.log('resolving', lucene, {value:result}, 'result:', match);



				return match;
			}.bind(this))();
		}


	})
	.refs({})
	.props({});
