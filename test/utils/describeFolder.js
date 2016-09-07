/**
 * Created by desaroger on 3/09/16.
 */

const path = require('path');
const requireDir = require('require-dir');
const _ = require('lodash');
const expect = require('./expect');
const describeFile = require('./describeFile');

module.exports = function describeFolder(originalPath, moduleName = pathToModuleName(originalPath), fileFilter = false) {

	let pathFolder = pathToAbsolute(originalPath);
	let fileNames = getFilesOnPath(pathFolder);

	if (fileFilter) {
		fileNames = fileNames.filter(fileName => ~fileFilter.indexOf(fileName));
	}

	let filePaths = fileNames.map(fileName => path.resolve(pathFolder, fileName));

	describe(moduleName, () => {
		if (_.isArray(filePaths)) {
			filePaths.forEach(filePath => describeFile(filePath));
		} else {
			describeFile(filePaths, false);
		}
	});

};

function getFilesOnPath(absPathFolder) {
	const possibleIndex = path.resolve(absPathFolder, './index.js');
	try {
		require(possibleIndex);
		return possibleIndex;
	} catch (e) {}
	const filesObj = requireDir(absPathFolder);
	return Object.keys(filesObj);
}

function getRootPath() {
	return path.resolve(__dirname, '../');
}

function pathToAbsolute(pathFile) {
	const rootPath = getRootPath();
	return path.resolve(rootPath, pathFile);
}

function pathToModuleName(pathFile) {
	const fileName = path.basename(pathFile);
	if (fileName.startsWith('_')) {
		return fileName.substr(1);
	}
	return fileName;
}
