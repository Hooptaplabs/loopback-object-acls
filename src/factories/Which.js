/**
 * Created by desaroger on 4/09/16.
 */

const Stampit = require('stampit');
const _ = require('lodash');
const {} = require('../utils');
const {basics} = require('./partials');

const Which = module.exports = Stampit()
	.compose(basics)
	.init(function WhichInit() {})
	.static({

		prepareInput(input) {
			if (!input) {
				return {};
			}
			if (_.isString(input)) {
				return {id: input};
			}
			return input;
		}

	})
	.methods({

		check(target) {

			target = Which.prepareInput(target);

			if (this.type != null && target && target.type != this.type) {
				return false;
			}
			if (this.id != null && target && target.id != this.id) {
				return false;
			}
			return true;
		},

		getScore() {
			let score = 0;
			if (this.type) {
				score += 10;
			}
			if (this.id) {
				score += 20;
			}
			return score;
		},

		valueOf() {
			return this.getScore();
		}

	})
	.refs({
		type: null,
		id: null
	})
	.props({});
