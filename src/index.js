/**
 * Created by desaroger on 3/09/16.
 */

const debug = require('debug')('loopback:mixins:ObjectAcls');
const _ = require('lodash');

const {prettyError, createProperty} = require('./utils');
const {Request, Oac} = require('./factories');

// prettyError.attach();

module.exports = function ObjectAclsMixin(Model, options) {
	try {

		const debugN = (...args) => debug(`[${Model.definition.name}]`, ...args);

		// Check if it was applied previously
		if (Model.prototype.can) {
			throw new Error(`loopback-object-acls mixin was applied twice on model ${Model.definition.name}.`);
		}
		debugN('running');

		// Defaults
		_.defaults(options, {
			propertyName: 'acls'
		});

		// Create property
		createProperty(Model, options.propertyName, 'any');

		Model.prototype.can = function Can(requestData = {}) {

			let request = Request(requestData);
			let oacList = this[options.propertyName] || [];

			let allowed = Oac.allow(oacList, request);

			debugN('.can, result:', allowed, 'request:', request, 'list:', oacList);

			return allowed;
		};






	} catch (e) {
		prettyError(e);
	}
};
