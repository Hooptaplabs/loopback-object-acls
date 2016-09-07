/**
 * Created by desaroger on 3/09/16.
 */

const Stampit = require('stampit');
const _ = require('lodash');
const {} = require('../utils');
const {basics} = require('./partials');

const Want = module.exports = Stampit()
	.compose(basics)
	.init(function WantInit() {})
	.static({

		prepareInput(input) {
			if (!input) {
				return {};
			}
			if (_.isString(input)) {
				return {permission: input};
			}
			return input;
		}

	})
	.methods({

		isAllow() {
			return this.permission == 'ALLOW';
		},

		isDeny() {
			return !this.isAllow();
		},

		getScore() {
			let scoreMap = {
				DENY: 20,
				ALLOW: 10
			};
			return scoreMap[this.permission] || 0;
		},

		valueOf() {
			return this.getScore();
		}

	})
	.refs({
		permission: 'DENY'
	})
	.props({});
