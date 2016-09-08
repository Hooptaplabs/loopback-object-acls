/**
 * Created by desaroger on 3/09/16.
 */

const debug = require('debug')('loopback:mixins:ObjectAcls');
const _ = require('lodash');

const {prettyError, createProperty, G, GO} = require('./utils');
const {Request, Oac} = require('./factories');

// prettyError.attach();

module.exports = function ObjectAclsMixin(Model, options = {}) {
	try {

		const debugN = (...args) => debug(`[${Model.definition.name}]`, ...args);

		// Check if it was applied previously
		if (Model.prototype.can) {
			throw new Error(`loopback-object-acls mixin was applied twice on model ${Model.definition.name}.`);
		}
		
		// Defaults
		_.defaults(options, {
			propertyName: 'acls',
			alias: [],
			resolvers: [],
			sugars: []
		});

		// Create property
		createProperty(Model, options.propertyName, 'any');

		Model.prototype.can = G(function* Can(requestData = {}) {

			let request = requestData;
			request = requestAliasParse(request, options.alias);
			let oacList = this[options.propertyName] || [];

			let allowed = yield Oac.allows(oacList, request, options.resolvers, this);

			if (debug.enabled) {
				debugN('.can, result:', allowed, 'request:', Request(request).toObject(), 'list:', oacList);
			}

			return allowed;
		});

		Model.prototype.requireCan = G(function* (requestData = {}) {

			if (_.isString(requestData)) {
				requestData = {which: requestData};
			}

			let allowed = yield this.can(requestData);

			if (!allowed) {
				throw new Error('Not allowed.');
			}

		});
		
		Model.addAclsAlias = Model.prototype.addAclsAlias = function addAclsAlias(type, id, replacement) {
			options.alias.push({type, id, replacement});
		};

		Model.addAclsResolver = Model.prototype.addAclsResolver = function addAclsResolver(id, resolver) {
			options.resolvers.push({id, resolver});
		};

		Model.cleanAclsResolvers = Model.prototype.cleanAclsResolvers = function cleanAclsResolvers(id, resolver) {
			options.resolvers = [];
		};

		Model.addAclsSugar = function addAclsSugar(sugarId, transformFunction) {

			if (options.sugars.length == 0) {

				Model.observe('before save', GO(function* (ctx) {

					if (!ctx.isNewInstance && ctx.data && Object.keys(ctx.data).length == 1 && ctx.data[options.propertyName] !== undefined) {
						return;
					}


					let updated = false;
					let acls = this[options.propertyName] || [];
					let sugars = options.sugars;
					for (let i = 0; i < sugars.length; i++) {
						let sugar = sugars[i];

						let value;
						if (ctx.data) {
							if (ctx.data[sugar.id] !== undefined) {
								value = ctx.data[sugar.id];
							}
						} else if (ctx.instance && ctx.instance[sugar.id] !== undefined) {
							value = ctx.instance[sugar.id];
						}

						if (value === undefined) {
							continue;
						}

						let newAcls = transformFunction(value);


						if (!_.isArray(newAcls))
							newAcls = [newAcls];



						// Remove old values
						acls = acls.filter(oac => oac.sugarId != sugarId);

						// Add sugarId to the newAcls
						newAcls = newAcls.map(newAcl => {
							newAcl.sugarId = sugarId;
							return newAcl;
						});

						// Add the news
						acls = acls.concat(newAcls);

						updated = true;
					}


					if (updated) {
						ctx.hookState.acls = acls;
					}

				}));




				Model.observe('after save', GO(function* (ctx) {

					if (ctx.instance && ctx.hookState.acls) {
						yield ctx.instance.updateAttribute(options.propertyName, ctx.hookState.acls);
					}

				}));
				
				

			}

			options.sugars.push({id: sugarId, transformFunction});
		};






	} catch (e) {
		prettyError(e);
	}
};


function requestAliasParse(requestData, alias = []) {

	alias = alias.map(al => {
		al.type = al.type.toLowerCase();
		return al;
	});

	alias.forEach(al => {

		if (requestData[al.type] == al.id) {
			requestData[al.type] = al.replacement;
			if (requestData[al.type].type == '$') {
				requestData[al.type].type = al.id;
			}
			if (requestData[al.type].id == '$') {
				requestData[al.type].id = al.id;
			}
		}

	});

	return requestData;
}


