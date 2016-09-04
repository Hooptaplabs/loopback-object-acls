/**
 * Created by desaroger on 4/09/16.
 */

const Stampit = require('stampit');
const _ = require('lodash');
const {} = require('../utils');
const {basics} = require('./partials');

const When = module.exports = Stampit()
	.compose(basics)
	.init(function WhenInit() {})
	.methods({

	})
	.refs({
		property: null,
		type: null
	})
	.props({});
