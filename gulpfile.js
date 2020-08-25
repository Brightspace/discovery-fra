/* eslint-env node, es6 */

'use strict';
const death = require('death');
const del = require('del');
const ejs = require('gulp-ejs');
const exec = require('child_process').exec;
const fs = require('fs');
const gulp = require('gulp');
const mergeStream = require('merge-stream');
const path = require('path');
const rename = require('gulp-rename');
const requireDir = require('require-dir');

const langDirectory = './src/build';
const localeResources = requireDir('lang');

const ifrautoasterConfigFile = './ifrautoaster-config.json';
const ifrautoasterCustomFile = './ifrautoaster-custom.json';
const buildDirectory = './build';

const config = {
	dest: buildDirectory,
	localeFiles: Object.keys(localeResources).map((lang) => ({
		filename: lang,
		data: {
			lang: lang,
			properLang: lang.charAt(0).toUpperCase() + lang.slice(1).replace('-', ''),
			resources: JSON.stringify(localeResources[lang], null, '\t'),
			comment: 'This file is auto-generated. Do not modify.'
		}
	}))
};

//Creates the Polymer3 lang .js files in src/build
function buildLang() {
	const options = {
		client: true,
		strict: true,
		root: langDirectory +'/lang',
		localsName: 'data'
	};

	return mergeStream(config.localeFiles.map(({ filename, data }) =>
		gulp.src('./templates/lang.ejs')
			.pipe(ejs(data, options))
			.pipe(rename({
				basename: filename,
				extname: '.js'
			}))
			.pipe(gulp.dest(options.root)))
	);
};

function cleanLang() {
	return del([langDirectory]);
};

const createBuildDir = (done) => {
	if (!fs.exists(config.dest, (exists) => {
		if (!exists) {
			fs.mkdir(config.dest, done);
		} else {
			done();
		}
	}));
};

const cleanBuildDir = (done) => {
	const buildDirContentsPath = path.posix.join(config.dest, '**', '*');
	del([buildDirContentsPath]);
	done();
};

const buildPolymer = (done) => {
	exec('polymer build --name=\"es6-unbundled\" --add-service-worker --add-push-manifest --insert-prefetch-links', function (err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done();
		exec('mv ./build/es6-unbundled/* ./build && rmdir \"./build/es6-unbundled\"', function(err, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			console.log("Polymer build completed");
		});
	});
};

//Tracks changes to lang and source files, rebuilds on change.
const watching = (cb) => {
	const watchers = [
		gulp.watch(['lang/*.json'], gulp.series(buildPolymerLang, buildPolymerDev)),
		gulp.watch(['src/**/*.js', '!src/build/**/*'], gulp.series(buildPolymerDev))
	];

	const done = death(() => {
		watchers.forEach(watcher => watcher.close());
		done();
	});
	cb();
};

const buildFrauConfig = (done) => {
	exec('npm run frau:build-config', function(err, stdout, stderr) {
 		console.log(stdout);
 		console.log(stderr);
 		done();
 	});
};

const startFrauHost = (done) => {
	exec('npm run frau:resolve', function(err, stdout, stderr) {
 		console.log(stdout);
 		console.log(stderr);
 		done();
 	});
};

const startToaster = (done) => {
	exec('ifrautoaster --config ' + ifrautoasterConfigFile, function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done();
	});
};

const startToasterCustom = (done) => {
	if (!fs.existsSync(ifrautoasterCustomFile)) {
		console.log("'" + ifrautoasterCustomFile + "' does not exist. You must create this file to host with a custom frau configuration.")
		process.exit();
	}

	exec('ifrautoaster --config ' + ifrautoasterCustomFile, function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		done();
	});
};

const buildPolymerLang = gulp.series(
	cleanLang,
	buildLang,
);

const buildPolymerDev = gulp.series(
	createBuildDir,
	cleanBuildDir,
	buildPolymer,
);

const buildDev = gulp.parallel(
	gulp.series(
		buildPolymerLang,
		buildPolymerDev,
	),
	gulp.series(
		buildFrauConfig,
		startFrauHost
	),
	startToaster,
	watching
);

const buildDevCustomConfig = gulp.parallel(
	gulp.series(
		buildPolymerLang,
		buildPolymerDev,
	),
	gulp.series(
		buildFrauConfig,
		startFrauHost
	),
	startToasterCustom,
	watching
);

const clean = gulp.parallel(
	cleanLang,
	cleanBuildDir
);

exports['cleanBuild'] = clean;
exports['buildLang'] = buildPolymerLang;
exports['buildDev'] = buildDev;
exports['buildDevCustom'] = buildDevCustomConfig;
