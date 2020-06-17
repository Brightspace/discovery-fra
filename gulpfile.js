/* eslint-env node, es6 */

'use strict';
const death = require('death');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');
const path = require('path');
const requireDir = require('require-dir');
const exec = require('child_process').exec;

const langDirectory = './src/build';
const localeResources = requireDir('lang');

const polymerBuild = require('polymer-build');
const polymerJson = require('./polymer.json');
const polymerProject = new polymerBuild.PolymerProject(polymerJson);
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
}

function cleanLang() {
	return del([langDirectory]);
}






/******************************************************************************************/

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
		 	console.log("Polymer build completed");
		 	done();
		});
	});
}

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


let frauHost;
const buildFrauConfig = (done) => {
	if(frauHost) {
		frauHost.kill('SIGINT');
	}
	frauHost = exec('npm run frau:build-config && npm run frau:resolve', function(err, stdout, stderr) {
 		console.log(stdout);
 		console.log(stderr);
 		console.log("Build Frau Config completed");
 		done();
 	});
}

const startToaster = (done) => {
	exec('npm run ifrautoaster', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		console.log("Ifrautoaster Started");
		done();
	});
}

/******************************************************************************************/

const buildPolymerLang = gulp.series(
	cleanLang,
	buildLang,
);

const buildPolymerDev = gulp.series(
	createBuildDir,
	cleanBuildDir,
	buildPolymer,
	buildFrauConfig
)

const buildDev = gulp.parallel(
	gulp.series(
		buildPolymerLang,
		buildPolymerDev,
	),
	startToaster,
	watching
);




exports['clean'] = cleanLang;
exports['buildLang'] = buildPolymerLang;
exports['buildDev'] = buildDev;
exports['buildTest'] = buildPolymer;
