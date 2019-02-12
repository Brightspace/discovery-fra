/* eslint-env node, es6 */

'use strict';

const del = require('del');
const gulp = require('gulp');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const mergeStream = require('merge-stream');
const requireDir = require('require-dir');

const buildDirectory = './src/build';
const localeResources = requireDir('lang');

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

function build() {
	const options = {
		client: true,
		strict: true,
		root: './src/build/lang',
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

gulp.task('clean', () => del([buildDirectory]));
gulp.task('build', gulp.series('clean', build));
