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
			propertyName: 'acls'
		});

		// Create property
		createProperty(Model, options.propertyName, 'any');

		Model.prototype.can = G(function* Can(requestData = {}) {

			let request = requestData;
			let oacList = this[options.propertyName] || [];

			
			let allowed = yield Oac.allows(oacList, request);

			if (debug.enabled) {
				debugN('.can, result:', allowed, 'request:', Request(request).toObject(), 'list:', oacList);
			}

			return allowed;
		});






	} catch (e) {
		prettyError(e);
	}
};
