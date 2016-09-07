/**
 * Created by desaroger on 3/09/16.
 */

const Stampit = require('stampit');
const {G} = require('../utils');

// Factories
const Want = require('./Want');
const Who = require('./Who');
const Which = require('./Which');
const When = require('./When');
const Request = require('./Request');
const {basics} = require('./partials');

const Oac = module.exports = Stampit()
	.compose(basics)
	.init(function OacInit({instance}) {
		instance.want = Want.create(instance.want);
		instance.who = Who.create(instance.who);
		instance.which = Which.create(instance.which);
		instance.when = When(instance.when);
	})
	.static({
		
		allows(list, request, resolvers, instance) {
			// console.log('ALLOWS', list, request);
			return G(function* () {
				if (!Request.isInstanceOf(request)) {
					request = Request(request);
				}

				list = list.map(oac => {
					if (!Oac.isInstanceOf(oac)) {
						oac = Oac(oac);
					}
					return oac;
				});

				list = list.filter(oac => oac.check(request));

				let allowList = list.filter(oac => oac.isAllow());
				let denyList = list.filter(oac => oac.isDeny());

				// console.log('allow', allowList.map(i => i.toObject()));
				// console.log('deny', denyList.map(i => i.toObject()));

				let denyScore = -1;
				for (let i=0; i < denyList.length; i++) {
					let oac = denyList[i];
					let result = yield oac.resolveWhen(resolvers, instance);
					
					if (result) {
						denyScore = oac.getScore();
						break;
					}
				}
				if (!~denyScore) {
					return true;
				}

				let allowScore = -1;
				for (let i=0; i < allowList.length; i++) {
					let oac = allowList[i];
					let result = yield oac.resolveWhen(resolvers, instance);

					if (result) {
						allowScore = oac.getScore();
						break;
					}
				}
				
				// console.log('scores', allowScore, denyScore);

				return allowScore > denyScore;
			}.bind(this))();
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

		resolveWhen(resolvers, instance) {
			return this.when.resolve(resolvers, instance);
		},

		isAllow() {
			return this.want.isAllow();
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
		sugarId: null
	});

// Examples:

// No permitir instanciar más de 100 instancias en total (100 de stock)
let example1 = {
	want: 'DENY',
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
	want: 'DENY',
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
