/**
 * Created by desaroger on 7/09/16.
 */

module.exports = function TimeMock() {

	let offset = 0;
	
	return {

		tick(ms) {
			offset += ms;
			return offset;
		},

		get() {
			return Math.round(this.getFloat());
		},

		getFloat() {
			let value = Date.now() / 1000;
			value += offset;
			return value;
		}

	}

};
