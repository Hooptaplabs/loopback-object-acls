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

	folders = folders.filter(folder => !~ignore.indexOf(folder));


	folders.forEach(folder => describeFolder(folder));

};

function getRootPath() {
	return path.resolve(__dirname, '../');
}

function pathToAbsolute(pathFile) {
	const rootPath = getRootPath();
	return path.resolve(rootPath, pathFile);
}