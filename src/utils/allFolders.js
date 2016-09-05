/**
 * Created by desaroger on 3/09/16.
 */

var fs = require('fs'),
	path = require('path');

module.exports = function allFolders(srcpath) {
	return fs.readdirSync(srcpath).filter(function(file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
};