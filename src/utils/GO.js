/**
 * Created by desaroger on 7/09/16.
 */

let G = require('./G');

module.exports = function GOUtil(func) {

	return function(...args) {
		let last = args[args.length - 1];
		if (typeof last == 'function') {
			args.pop();
		} else {
			last = false;
		}
		G(func, last).call(this, ...args);
	};

};
