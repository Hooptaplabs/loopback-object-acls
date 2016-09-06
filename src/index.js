/**
 * Created by desaroger on 3/09/16.
 */

const debug = require('debug')('loopback:mixins:ObjectAcls');
const _ = require('lodash');

const {prettyError, createProperty, G} = require('./utils');
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
			alias: []
		});

		// Create property
		createProperty(Model, options.propertyName, 'any');

		Model.prototype.can = G(function* Can(requestData = {}) {

			let request = requestData;
			request = requestAliasParse(request, options.alias);
			let oacList = this[options.propertyName] || [];

			
			let allowed = yield Oac.allows(oacList, request);

			if (debug.enabled) {
				debugN('.can, result:', allowed, 'request:', Request(request).toObject(), 'list:', oacList);
			}

			return allowed;
		});
		
		Model.addAclsAlias = Model.prototype.addAclsAlias = function addAclsAlias(newAlias) {

			newAlias = {
				type: 'Which',
				id: 'instantiate',
				replacement: {
					type: 'EXEC',
					id: 'instantiate'
				}
			};
			
			options.alias.push(newAlias);
			
		}






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


