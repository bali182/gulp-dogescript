var dogescript = require('dogescript'),
	through2 = require('through2'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-dogescript';

function gulpDjsCompile(config) {
	var getOrDefault = function getOrDefault(object, property, defaultValue) {
		return object.hasOwnProperty(property) ? object[property] : defaultValue;
	};

	var djs = getOrDefault(config, 'dogescript', dogescript);
	var beautify = !!getOrDefault(config, 'beautify', false);
	var trueDoge = !!getOrDefault(config, 'trueDoge', false); // TODO warning

	return through2.obj(function (file, enc, cb) {
		if (file.isStream()) {
			this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
			return cb();
		}

		if (file.isBuffer()) {
			var output = file.clone();
			output.contents = new Buffer(djs(file.contents.toString(), beautify, trueDoge));
			output.path = gutil.replaceExtension(file.path.toString(), '.js');
			this.push(output);
		}
		return cb();
	});
};

module.exports = gulpDjsCompile;
