/**
 * Created by desaroger on 5/09/16.
 */

const _ = require('lodash');

module.exports = function createProperty(model, name, type, defaultValue) {

	let options = {type};
	if (defaultValue != undefined && !_.isFunction(defaultValue)) {
		options.default = defaultValue;
	}

	model.defineProperty(name, options);
	if (defaultValue != undefined) {
		model.definition.rawProperties[name].default = defaultValue;
		model.definition.properties[name].default = defaultValue;
	}
};
