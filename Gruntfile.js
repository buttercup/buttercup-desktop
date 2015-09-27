/* global module, require */

module.exports = function(grunt) {

	"use strict";

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		clean: {
			publicDir: ["source/public/**/*"]
		},

		// copy: {
		// 	development: {
		// 		expand: true,
		// 		src: 'development/pages/*.html',
		// 		dest: 'build/',
		// 		flatten: true,
		// 		filter: 'isFile',
		// 	}
		// },

		mkdir: {
			publicDir: {
				options: {
					mode: '0755',
					create: [
						'source/public/css',
						'source/public/js'
					]
				},
			},
		}

		// jasmine: {
		// 	main: {
		// 		src: 'build/sdk.js',
		// 		options: {
		// 			specs: ['tests/unit/**/*.js', 'tests/integration/**/*.js'],
		// 			helpers: 'tests/helpers/*.js',
		// 			junit: {
		// 				path: "build/",
		// 				consolidate: true
		// 			}
		// 		}
		// 	}
		// },

		// jshint: {
		// 	files: ['Gruntfile.js', 'source/**/*.js'],
		// 	options: {
		// 		jshintrc: ".jshintrc"
		// 	}
		// },
		
		// scantreeConcat: {
		// 	main: {
		// 		baseDir: "source/",
		// 		scanDir: "source/",
		// 		output: "build/sdk.js",
		// 		options: {
		// 			header: "partial/header.js",
		// 			footer: "partial/footer.js"
		// 		}
		// 	}
		// },

		// watch: {
		// 	scripts: {
		// 		files: ['source/**/*.js', "development/**/*.html"],
		// 		tasks: ['build', 'copy:development'],
		// 		options: {
		// 			spawn: false,
		// 		}
		// 	}
		// }

	});

	grunt.registerTask("default", ["build", "start"]);

	grunt.registerTask("build", [
		"clean:publicDir",
		"mkdir:publicDir"
		//"scantreeConcat:main"
	]);

	//grunt.registerTask("test", ["jshint", "build", "jasmine:main"]);

};
