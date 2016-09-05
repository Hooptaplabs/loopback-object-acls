/**
 * Created by desaroger on 4/09/16.
 */

const Stampit = require('stampit');
const _ = require('lodash');
const {} = require('../utils');
const {basics} = require('./partials');

const Which = module.exports = Stampit()
	.compose(basics)
	.init(function WhatInit() {})
	.methods({

		check(target) {

			target = Which.prepareInput(target);

			if (this.type != null && target.type != this.type) {
				return false;
			}
			if (this.property != null && target.property != this.property) {
				return false;
			}
			return true;
		},

		getScore() {
			let score = 0;
			if (this.type) {
				score += 10;
			}
			if (this.property) {
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
		property: null
	})
	.props({});
