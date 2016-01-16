/* global module, require */

module.exports = function(grunt) {
    "use strict";

    require('load-grunt-tasks')(grunt);

    var globalConfig = {
        dist: {
            electron_pkgr: "./node_modules/electron-packager/cli.js",
            electron_ver: "0.36.1",
            name: "Buttercup"
        },
        package: false
    };

    grunt.initConfig({
        clean: {
            dist: [
                "dist/**/*",
                "!dist/.gitignore"
            ],
            publicDir: [
                "source/public/js/**/*",
                "source/public/index.html",
                "source/public/css/**/*",
                "source/public/img/**/*",
                "source/public/fonts/**/*"
            ]
        },

        exec: {
            clean_dist: {
                command: 'grunt clean:dist --force',
                stdout: false,
                stderr: false
            },
            dist_mac: {
                command: '<%= globalConfig.dist.electron_pkgr %> . "<%= globalConfig.dist.name %>" --platform=darwin --arch=x64 --version=<%= globalConfig.dist.electron_ver %> --out=dist/ --ignore="^grunt" --icon=source/resources/img/icon.icns',
                stdout: true,
                stderr: true
            },
            dist_win: {
                command: '<%= globalConfig.dist.electron_pkgr %> . "<%= globalConfig.dist.name %>" --platform=win32 --arch=x64 --version=<%= globalConfig.dist.electron_ver %> --out=dist/ --ignore="^grunt"',
                stdout: true,
                stderr: true
            },
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

        globalConfig: globalConfig,

        jade: {
            app: {
                files: {
                    'source/public/index.html': ['source/resources/jade/index.jade'],
                    'source/public/intro.html': ['source/resources/jade/intro.jade']
                },
                options: {
                    data: {
                        package: '<%= globalConfig.package %>'
                    },
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
            assets: {
                files: [
                    {
                        cwd: 'source/resources/js',
                        src: ['**'],
                        dest: 'source/public/js'
                    },
                    {
                        cwd: 'source/resources/img',
                        src: ['**', '!icons/*'],
                        dest: 'source/public/img'
                    },
                    {
                        cwd: 'source/resources/fonts',
                        src: ['**'],
                        dest: 'source/public/fonts'
                    }
                ],
                verbose: true
            }
        },

        watch: {
            options: {
                spawn: false
            },
            assets: {
                files: ['source/resources/js/**/*.*', 'source/resources/img/**/*.*'],
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
        },

        svg_sprite: {
            complex: {
                // Target basics
                expand: true,
                src: ['source/resources/img/icons/*.svg'],
                dest: 'source/public/img/icons',

                // Target options
                options: {
                    shape: {
                        id: {
                            generator: function(file) {
                                return file.replace(/^.*[\\\/]/, '').replace('.svg', '');
                            }
                        }
                    },
                    mode: {
                        symbol: {
                            dest: './'
                        }
                    }
                }
            }
        },
        systemjs: {
            options: {
                sfx: true,
                baseURL: "./source/public/js",
                configFile: "./source/public/js/config.js",
                minify: true,
                build: {
                    mangle: false
                }
            },
            dist: {
                files: [{
                    "src":  "./source/public/js/main.js",
                    "dest": "./source/public/js/dist/all.js"
                }]
            }
        }
    });

    grunt.registerTask("default", ["build", "watch"]);

    grunt.registerTask("build", [
        "clean:publicDir",
        "jade:app",
        "sass:app",
        "sync",
        "svg_sprite"
    ]);

    grunt.registerTask("dist", [
        "exec:clean_dist",
        "package",
        "exec:dist_mac",
        "exec:dist_win"
    ]);

    grunt.registerTask("package", function() {
        globalConfig.package = true;
        grunt.task.run([
            "build",
            "systemjs"
        ]);
    });

    // grunt.registerTask("setup", [
    //     "build",
    //     "exec:jspm",
    //     "start"
    // ]);
    //
    // grunt.registerTask("start", [
    //     "exec:start"
    // ]);

    //grunt.registerTask("test", ["jshint", "build", "jasmine:main"]);

};
