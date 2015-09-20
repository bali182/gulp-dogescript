var dogescript = require('dogescript'),
	gulp = require('gulp'),
	through2 = require('through2'),
	gutil = require('gulp-util'),
	PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-dogescript';

function gulpDjsCompile(config) {
	var beautify = config.hasOwnProperty('beautify') ? !!(config.beautify) : false;
	var trueDoge = config.hasOwnProperty('trueDoge') ? !!(config.trueDoge) : false; // TODO warning
  
	return through2.obj(function (file, enc, cb) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
			var output = file.clone();
			output.contents = new Buffer(dogescript(file.contents.toString(), beautify, trueDoge));
			output.path = file.path.replace('.djs', '.js'); // TODO more sophisticated way to replace djs with js

			this.push(output);
    }
    return cb();
  });
};

module.exports = gulpDjsCompile;
