/**
 * Created by desaroger on 3/09/16.
 */

const _ = require('lodash');
const Stampit = require('stampit');
const {basics} = require('./partials');

const Request = module.exports = Stampit()
	.compose(basics)
	.init(function RequestInit() {})
	.methods({})
	.static({

		prepareInput(input) {
			if (!input) {
				return {};
			}
			if (_.isString(input)) {
				return {which: {id: input}};
			}
			return input;
		}

	})
	.refs({
		who: null,
		which: null
	})
	.props({});
