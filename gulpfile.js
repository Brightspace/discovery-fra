/* eslint-env node, es6 */

'use strict';
const death = require('death');
const del = require('del');
const exec = require('child_process').exec;
const fs = require('fs');
const gulp = require('gulp');
const path = require('path');


const ifrautoasterConfigFile = './ifrautoaster-config.json';
const ifrautoasterCustomFile = './ifrautoaster-custom.json';
const buildDirectory = './build';

const config = {
	dest: buildDirectory,
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
		gulp.watch(['src/**/*.js'], gulp.series(buildPolymerDev))
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

const buildPolymerDev = gulp.series(
	createBuildDir,
	cleanBuildDir,
	buildPolymer,
);

const buildDev = gulp.parallel(
	gulp.series(
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
	cleanBuildDir
);

exports['cleanBuild'] = clean;
exports['buildDev'] = buildDev;
exports['buildDevCustom'] = buildDevCustomConfig;
