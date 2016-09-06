/**
 * Created by desaroger on 6/09/16.
 */

const _ = require('lodash');
const DataSource = require('loopback-datasource-juggler').DataSource;
const Mixin = require('../../src/index');

module.exports = function AppMock(name = 'TestModel', props, settings) {

	var ds = new DataSource('memory');

	// Defaults
	if (!props) {
		props = {
			name: String
		}
	}
	if (!settings) {
		settings = {}
	}

	let Model = ds.define(name, props, settings);


	Model.applyMixin = function mixinApply() {
		Mixin(Model);
	}


	return Model;
};



