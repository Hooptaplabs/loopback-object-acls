/**
 * Created by desaroger on 3/09/16.
 */

const path = require('path');
const PrettyError = require('pretty-error');

module.exports = function prettyError(err) {

	err = build(err);

	show(err);

	return err;
};

module.exports.build = build;
module.exports.attach = attach;

function constructor() {

	let pe = new PrettyError();

	// skip node.js, path.js, event.js, etc.
	pe.skipNodeFiles();

	// skip packages
	pe.skipPackage();

	let projectDirectory = getProjectDirectory();
	pe.alias(projectDirectory, '(root)');



	return pe;
}

function attach() {

	if (process._prettyErrorAttached) {
		return;
	}

	let pe = constructor();

	process._prettyErrorAttached = true;

	process.on('uncaughtException', function(error){
		console.log(build(error, pe));
	});

// To render unhandled rejections created in BlueBird:
	process.on('unhandledRejection', function(reason){
		console.log("Unhandled rejection");
		console.log(build(reason, pe));
	});
}

function build(err, pe = constructor()) {

	err = pe.render(err);

	return err;
}

function show(err) {
	console.log(err);
}

function getProjectDirectory() {
	return path.resolve(__dirname, '../../');
}