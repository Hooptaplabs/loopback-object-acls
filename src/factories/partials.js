/**
 * Created by desaroger on 4/09/16.
 */

let Stampit = require('stampit');

const toObject = module.exports.toObject = Stampit()
	.methods({
		toObject() {
			return JSON.parse(JSON.stringify(this));
		}
	});

const getStamp = module.exports.isInstanceOf = Stampit()
	.init(function getStampInit({stamp}){
		this.getStamp = function getStamp() {
			return stamp;
		}
	});

const isInstanceOf = module.exports.isInstanceOf = Stampit()
	.static({
		isInstanceOf(obj) {
			return this.fixed.methods === obj.__proto__;
		}
	});

const create = module.exports = Stampit()
	.static({

		prepareInput(input) {
			return input;
		},

		create(input) {
			input = this.prepareInput(input);
			return this(input);
		}
	});



module.exports.basics = Stampit()
	.compose(toObject)
	.compose(getStamp)
	.compose(isInstanceOf)
	.compose(create);
