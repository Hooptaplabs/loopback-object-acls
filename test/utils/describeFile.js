/**
 * Created by roger on 3/09/16.
 */

const _ = require('lodash');
const path = require('path');
const expect = require('./expect');

module.exports = function describeFile(originalPath, moduleName = pathToModuleName(originalPath)) {

	const pathFile = pathToAbsolute(originalPath);

	try {
		const func = require(pathFile);

		if (typeof func == 'function') {
			let options = functionToOptions(func);
			_.defaults(options, {skip: false, moduleName});
			if (options.moduleName) {
				if (options.skip) {
					describe.skip(options.moduleName, func);
				} else {
					describe(options.moduleName, func);
				}
			} else {
				func();
			}
		} else {
			describe.skip(`[describeFile "${moduleName}" didn't exported a function"]`, () => {
				it('Please ensure the file exports a function');
			});
		}

	} catch (e) {
		const relativePath = pathToRelative(originalPath);
		describe.skip(`[describeFile "${moduleName}" was not found on "${relativePath}"]`, () => {
			it('Please create the file');
		});
	}

};

function functionToOptions(func) {
	let string = func.toString();
	let lines = string.split("\n");
	lines.shift();

	// Get only first lines until void line
	let finished = false;
	lines = lines
		.map(line => {
			if (finished)
				return false;

			line = line.split("\t").join('').trim();
			if (line.length < 3 || !line.startsWith('//')) {
				finished = true;
				return false;
			}
			return line;
		})
		.filter(line => !!line);

	// Remove comment
	lines = lines.map(line => line.split('//').join('').trim());

	// Convert to key:value
	lines = lines.map(line => {
		let [key, value = true] = line.split(':');
		key = key.trim();
		if (_.isString(value)) {
			value = value.trim();
		}
		return {key, value};
	});

	// Convert to object
	return lines.reduce((result, item) => {
		result[item.key] = item.value;
		return result;
	}, {});
}

function getRootPath() {
	return path.resolve(__dirname, '../');
}

function pathToRelative(absPathFile) {
	const rootPath = getRootPath();
	let relativePath = absPathFile.replace(rootPath, '');

	// Add ./ at the beginning
	if (relativePath.startsWith('/'))
		relativePath = relativePath.substring(1);
	relativePath = './' + relativePath;

	return relativePath;
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
