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
	
	let desiredFolders = false;
	if (process.env.module) {
		desiredFolders = process.env.module.split(',');
	}

	// Ignore list
	folders = folders.filter(folder => !~ignore.indexOf(folder));

	if (desiredFolders != false) {
		folders = folders.filter(folder => ~desiredFolders.indexOf(folder));
		let desiredFoldersNotInList = desiredFolders.filter(desiredFolder => !~folders.indexOf(desiredFolder));
		folders = folders.concat(desiredFoldersNotInList);
	}


	folders.forEach(folder => describeFolder(folder));

};

function getRootPath() {
	return path.resolve(__dirname, '../');
}

function pathToAbsolute(pathFile) {
	const rootPath = getRootPath();
	return path.resolve(rootPath, pathFile);
}