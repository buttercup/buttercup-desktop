/* global module, require */

module.exports = function(grunt) {
    "use strict";

    require("load-grunt-tasks")(grunt);
    require("time-grunt")(grunt);

    var makedeb = require("makedeb"),
        path = require("path"),
        fs = require("fs");

    function createDebFiles() {
        return [
            {
                arch: "ia32"
            },
            {
                arch: "x64"
            }
        ].reduce(function(prom, build) {
            return prom.then(function() {
                console.log("Creating deb for architecture: " + build.arch);
                return makedeb({
                    packageName: globalConfig.dist.name,
                    version: globalConfig.package.version,
                    buildDir: "./dist/Buttercup-linux-" + build.arch,
                    outDir: "./dist/",
                    installPath: "/usr/share/applications/buttercup",
                    overwrite: true,
                    // --
                    maintainer: "perry@perrymitchell.net",
                    section: "main", // taken from: https://www.debian.org/doc/debian-policy/ch-archive.html#s-subsections
                    priority: "optional",
                    architecture: "all",
                    essential: "no",
                    packageDescription: "Buttercup password and credentials archive manager."
                }).then(function(filePath) {
                    var dir = path.dirname(filePath);
                    fs.renameSync(
                        filePath,
                        path.join(dir, "buttercup-" + globalConfig.package.version + "-" + build.arch + ".deb")
                    );
                    console.log("Finished deb for: " + build.arch);
                });
            });
        }, Promise.resolve());
    }

    var globalConfig = {
        dist: {
            electron_pkgr: "./node_modules/electron-packager/cli.js",
            electron_ver: "0.36.1",
            ignoreRexp: "(node_modules/(grunt|jspm|foundation|electron|load)|" +
                "source/resources|jspm_packages|dist/Buttercup)",
            name: "Buttercup"
        },
        isPackage: false,
        package: require("./package.json")
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
            jspm_install: {
                command: 'cd "' + __dirname + '" && jspm install',
                stdout: true,
                stderr: true
            },
            rename_deb32: {
                command: 'cd dist && mv buttercup_*.deb buttercup-linux32.deb',
                stderr: true,
                stdout: true
            },
            rename_deb64: {
                command: 'cd dist && mv buttercup_*.deb buttercup-linux64.deb',
                stderr: true,
                stdout: true
            },
            start: {
                command: 'electron ' + __dirname,
                stdout: false,
                stderr: false
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
                        package: '<%= globalConfig.isPackage %>'
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

        nodeunit: {
            all: ['tests/app/**/*.spec.js'],
            options: {}
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
                    },
                    {
                        cwd: 'source/resources',
                        src: ['buttercup.desktop'],
                        dest: 'source/public'
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
        "svg_sprite",
        "exec:jspm_install"
    ]);

    grunt.registerTask("dist", [
        "make-applications",
        "make-installers"
    ]);

    grunt.registerTask("make-applications", [
        "exec:clean_dist",
        "package",
        "exec:dist_mac",
        "exec:dist_win",
        "exec:dist_linux"
    ]);

    grunt.registerTask("make-deb", function() {
        var done = this.async();
        createDebFiles()
            .then(done)
            .catch(function(err) {
                console.error("Make-deb failed");
                console.log(err.message);
            });
    });

    grunt.registerTask("make-installers", function() {
        grunt.task.run([
            "make-deb",
            "exec:create_dmg",
            "exec:create_installer_win32",
            "exec:create_installer_win64"
        ]);
    });

    grunt.registerTask("package", function() {
        globalConfig.isPackage = true;
        grunt.task.run([
            "build",
            "systemjs"
        ]);
    });

    grunt.registerTask("start", [
        "build",
        "exec:start"
    ]);

    grunt.registerTask("test", [
        "nodeunit"
    ]);

};
