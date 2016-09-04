/**
 * Created by desaroger on 3/09/16.
 */

let Stampit = require('stampit');
const {What, Who, Which, When} = require('./index.js');
const {basics} = require('./partials');

const Oac = module.exports = Stampit()
	.compose(basics)
	.init(function OacInit({instance}) {
		instance.what = What.create(instance.what);
		instance.who = Who.create(instance.who);
		instance.which = Which(instance.which);
		instance.when = When(instance.when);
	})
	.static({

		allows(list, request) {

			list = list.filter(oac => oac.check(request));

			let allowList = list.filter(oac => oac.isAllow());
			let denyList = list.filter(oac => oac.isDeny());

			let denyScore = this.listToScore(denyList);
			if (!~denyScore) {
				return true;
			}

			let allowScore = this.listToScore(allowList);

			return allowScore > denyScore;
		},

		listToScore(list) {
			if (!list || !list.length) {
				return -1;
			}
			let oac = this.getMostScoreItem(list);
			let score = 0;
			if (oac && oac.getScore) {
				score = oac.getScore();
			}
			return score;
		},

		getMostScoreItem(list) {
			list = this.sortListByScore(list);
			return list[0];
		},

		sortListByScore(list) {
			// Equivalent to list.sort().reverse(), but decided this method
			// because .sort() orders alphabetically and seemed buggy on some cases.
			return list.sort((a, b) => a < b);
		}



	})
	.methods({

		isAllow() {
			return this.what.isAllow();
		},

		isDeny() {
			return !this.isAllow();
		},

		check(request) {

			if (!request) {
				return false;
			}

			if (!this.which.check(request.which)) {
				return false;
			}

			if (!this.who.check(request.who)) {
				return false;
			}

			return true;
		},

		getScoreObject() {
			let weights = {
				which: 1e2,
				who: 1e0
			};
			let scores = {};
			scores.who = this.who.getScore();
			scores.which = this.which.getScore();

			let weightedScores = ['who', 'which']
				.reduce((result, key) => {
					let weight = weights[key];
					let score = scores[key];
					result[key] = weight*score;
					return result;
				}, {});

			let score = ['who', 'which']
				.reduce((result, key) => {
					return result + weightedScores[key];
				}, 0);

			return {weights, scores, weightedScores, score};
		},

		getScore() {
			return this.getScoreObject().score;
		},

		valueOf() {
			return this.getScore();
		}

	})
	.refs({})
	.props({

	});

// Examples:

// No permitir instanciar más de 100 instancias en total (100 de stock)
let example1 = {
	what: 'DENY',
	which: 'instantiate',
	when: {
		'instances.count': {
			gt: 100,
			with: {
				filter: {status: 'completed'}
			}
		}
	}
};

// Solo permitir jugar 3 veces al día por usuario
let example2 = {
	default: 'DENY',
	what: 'DENY',
	which: 'play',
	when: {
		'instances.count': {
			gte: 3,
			with: {
				liveTime: 'week',
				groupBy: 'customer'
			}
		}
	}
};
