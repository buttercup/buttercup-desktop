/* global module, require */

module.exports = function(grunt) {
    "use strict";

    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);

    var globalConfig = {
        dist: {
            electron_pkgr: "./node_modules/electron-packager/cli.js",
            electron_ver: "0.36.1",
            ignoreRexp: "(node_modules/(grunt|jspm|foundation|electron|load)|" +
                "source/resources|jspm_packages|dist/Buttercup)",
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
            create_dmg: {
                command: './node_modules/electron-builder/cli.js dist/Buttercup-darwin-x64/Buttercup.app --platform=osx --out=dist/ --config=installers.config.json',
                stdout: true,
                stderr: true
            },
            create_installer_win32: {
                command: './node_modules/electron-builder/cli.js dist/Buttercup-win32-ia32 --platform=win --out=dist/ButtercupInstaller32/ --config=installers.config.json',
                stdout: true,
                stderr: true
            },
            create_installer_win64: {
                command: './node_modules/electron-builder/cli.js dist/Buttercup-win32-x64 --platform=win --out=dist/ButtercupInstaller64/ --config=installers.config.json',
                stdout: true,
                stderr: true
            },
            dist_linux: {
                command: '<%= globalConfig.dist.electron_pkgr %> . "<%= globalConfig.dist.name %>" --platform=linux --arch=all --version=<%= globalConfig.dist.electron_ver %> --out=dist/ --ignore="<%= globalConfig.dist.ignoreRexp %>"',
                stdout: true,
                stderr: true
            },
            dist_mac: {
                command: '<%= globalConfig.dist.electron_pkgr %> . "<%= globalConfig.dist.name %>" --platform=darwin --arch=all --version=<%= globalConfig.dist.electron_ver %> --out=dist/ --ignore="<%= globalConfig.dist.ignoreRexp %>" --icon=source/resources/img/icon.icns',
                stdout: true,
                stderr: true
            },
            dist_win: {
                command: '<%= globalConfig.dist.electron_pkgr %> . "<%= globalConfig.dist.name %>" --platform=win32 --arch=all --version=<%= globalConfig.dist.electron_ver %> --out=dist/ --ignore="<%= globalConfig.dist.ignoreRexp %>" --icon=source/resources/img/icon.ico',
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
        "exec:create_dmg",
        "exec:dist_win",
        "exec:create_installer_win32",
        "exec:create_installer_win64",
        "exec:dist_linux"
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
