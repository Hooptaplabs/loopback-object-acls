/**
 * Created by desaroger on 3/09/16.
 */
	
const _ = require('lodash');
const path = require('path');
const {allFolders} = require('../../src/utils');
const expect = require('./expect');
const describeFolder = require('./describeFolder');

module.exports = function describeAuto(testPath, ignore = []) {

	testPath = pathToAbsolute(testPath);
	let folders = allFolders(testPath);

	// Ignore list
	folders = folders.filter(folder => !~ignore.indexOf(folder));

	let desiredModules = false;
	if (process.env.module) {
		desiredModules = process.env.module.split(',')
			.reduce((result, item) => {
				item = item.split(':');
			    result[item[0]] = item[1] || true;
				return result;
			}, {});
	}


	folders.forEach(folder => {
		let filter = false;
		if (desiredModules) {
			let value = desiredModules[folder];
			if (value) {
				if (value !== true) {
					filter = [value];
				}
			} else {
				return;
			}
		}

		describeFolder(folder, undefined, filter);
	});
};

function getRootPath() {
	return path.resolve(__dirname, '../');
}

function pathToAbsolute(pathFile) {
	const rootPath = getRootPath();
	return path.resolve(rootPath, pathFile);
}