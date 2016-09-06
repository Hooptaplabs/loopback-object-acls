/**
 * Created by desaroger on 5/09/16.
 */

const _ = require('lodash');

module.exports = function(name) {

	let Model = function Constructor() {


	};

	Model.definition = {
		name,
		rawProperties: {},
		properties: {}
	};

	Model.defineProperty = function defineProperty(name, options) {
		Model.definition.rawProperties[name] = options;
		Model.definition.properties[name] = options;
	}

	
};