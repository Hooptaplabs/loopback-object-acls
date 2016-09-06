/**
 * Created by desaroger on 18/06/16.
 */

let Q = require('q');

module.exports = function GUtil(func, next) {

	func = funcToPromisedFunc(func);

	let result = func;
	if (next) {
		result = function() {
			return func.apply(this, arguments)
				.then(x => next(null, x))
				.catch(next);
		};
	}

	return result;
};

function funcToPromisedFunc(fn) {
	if (isGenerator(fn)) {
		return Q.async(fn);
	} else {
		return function() {
			return Q().then(() => fn.apply(this, arguments));
		};
	}
}

function isGenerator(fn) {
	return fn.constructor.name === 'GeneratorFunction';
}