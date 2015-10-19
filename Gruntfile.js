/* global module, require */

module.exports = function(grunt) {
	"use strict";

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		clean: {
			publicDir: [
				"source/public/js/**/*",
				"source/public/index.html",
				"source/public/css/**/*"
			]
		},

		exec: {
			start: {
				command: 'electron ' + __dirname,
				stdout: false,
				stderr: false
			},
			jspm: {
				command: 'jspm install',
				stdout: true,
				stderr: true
			}
		},

		jade: {
			app: {
				files: {
					'source/public/index.html': ['source/resources/jade/index.jade']
				},
				options: {
					debug: false
				}
			}
		},

		sass: {
			options: {
				sourceMap: false
			},
			app: {
				files: {
					'source/public/css/style.css': 'source/resources/css/style.scss'
				}
			}
		},

		mkdir: {
			publicDir: {
				options: {
					mode: '0755',
					create: [
						'source/public/css',
						'source/public/js'
					]
				}
			}
		},

		sync: {
			scripts: {
				files: [{
					cwd: 'source/resources/js',
					src: [
						'**' /* Include everything */
					],
					dest: 'source/public/js'
				}],
				verbose: true
			}
		},

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

		watch: {
			options: {
				spawn: false
			},
			scripts: {
				files: ['source/resources/js/**/*.*'],
				tasks: ['sync']
			},
			styles: {
				files: ['source/resources/css/**/*.scss'],
				tasks: ['sass:app']
			},
			jade: {
				files: ['source/resources/jade/**/*.jade'],
				tasks: ['jade:app']
			}
		}
	});

	grunt.registerTask("default", ["build", "start"]);

	grunt.registerTask("build", [
		"clean:publicDir",
		"jade:app",
		"sync:scripts"
	]);

	grunt.registerTask("setup", [
		"build",
		"exec:jspm",
		"start"
	]);

	grunt.registerTask("start", [
		"exec:start"
	]);

	//grunt.registerTask("test", ["jshint", "build", "jasmine:main"]);

};
