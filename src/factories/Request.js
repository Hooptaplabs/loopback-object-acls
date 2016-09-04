/**
 * Created by desaroger on 3/09/16.
 */

let Stampit = require('stampit');
const {basics} = require('./partials');

const Request = module.exports = Stampit()
	.compose(basics)
	.init(function RequestInit() {})
	.methods({})
	.refs({
		who: null,
		which: null
	})
	.props({});
