module.exports = function (grunt) {
    //#region Saucelabs Browsers
    // https://saucelabs.com/docs/platforms
    var browsers = [
                    // sauce says ff25 is availiable, but times out systematically...
                    {
                        browserName: "firefox",
                        platform   : "Windows 8",
                        version    : "22"
                    },
                    {
                        browserName         : "iphone",
                        platform            : "OS X 10.8",
                        version             : "6.1",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName         : "ipad",
                        platform            : "OS X 10.8",
                        version             : "6.1",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName         : "android",
                        platform            : "Linux",
                        version             : "4.0",
                        "device-orientation": "portrait"
                    },
                    {
                        browserName: "safari",
                        platform: "OS X 10.6",
                        version: "5"
                    },
                    {
                        browserName: "safari",
                        platform   : "OS X 10.8",
                        version    : "6"
                    },
                    {
                        browserName: "chrome",
                        platform   : "Windows 7",
                        version    : "31"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows XP",
                        version    : "7"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows XP",
                        version    : "8"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 7",
                        version    : "9"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8",
                        version    : "10"
                    },
                    {
                        browserName: "internet explorer",
                        platform   : "Windows 8.1",
                        version    : "11"
                    }
                ];
    //#endregion

    // Project configuration
    grunt.initConfig({
        //#region Saucelabs
        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999
                }
            }
        },
        "saucelabs-qunit": {
            all: {
                options: {
                    urls         : ["http://127.0.0.1:9999/test/unit/1.0.0/index.html"],
                    tunnelTimeout: 10,
                    build        : process.env.TRAVIS_JOB_ID,
                    concurrency  : 3,
                    browsers     : browsers,
                    testname     : "qunit tests",
                    tags         : ["master"]
                }
            }
        },
        watch: {},
        //#endregion

        // load package information ..use later for building via grunt...
        //pkg: grunt.file.readJSON("package.json"),

        // task: local unit tests
        qunit: {
            files: ['test/unit/1.0.0/index.html']
        },

		concat: {
			options: {
				stripBanners: true
			},
			headjs: {
				files: {
					'dist/1.0.0/head.js': ['src/1.0.0/core.js', 'src/1.0.0/css3.js', 'src/1.0.0/load.js']
				}
			},
			headjs_core: {
				files: {
					'dist/1.0.0/head.core.js': ['src/1.0.0/core.js']
				}
			},
			headjs_css3: {
				files: {
					'dist/1.0.0/head.css3.js': ['src/1.0.0/core.js', 'src/1.0.0/css3.js']
				}
			},
			headjs_loader: {
				files: {
					'dist/1.0.0/head.load.js': ['src/1.0.0/load.js']
				}
			}
		},

		uglify: {
			options: {
				compress: true
			},
			headjs: {
				options: {
					sourceMap: true,
					sourceMapName: 'dist/1.0.0/head.min.js.map'
				},
				files: {
					'dist/1.0.0/head.min.js': ['dist/1.0.0/head.js']
				}
			},
			headjs_core: {
				options: {
					sourceMap: true,
					sourceMapName: 'dist/1.0.0/head.core.min.js.map'
				},
				files: {
					'dist/1.0.0/head.core.min.js': ['dist/1.0.0/head.core.js']
				}
			},
			headjs_css3: {
				options: {
					sourceMap: true,
					sourceMapName: 'dist/1.0.0/head.css3.min.js.map'
				},
				files: {
					'dist/1.0.0/head.css3.min.js': ['dist/1.0.0/head.css3.js']
				}
			},
			headjs_loader: {
				options: {
					sourceMap: true,
					sourceMapName: 'dist/1.0.0/head.load.min.js.map'
				},
				files: {
					'dist/1.0.0/head.load.min.js': ['dist/1.0.0/head.load.js']
				}
			}
		}

    });

    // Loading dependencies
    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) {
            grunt.loadNpmTasks(key);
        }
    }

    // register: local unit tests
    grunt.registerTask("qtest", "qunit");

    // register sauce tasks
    grunt.registerTask("dev" , ["connect", "watch"]);
    grunt.registerTask("test", ["connect", "saucelabs-qunit"]);

	// register build tasts
	grunt.registerTask("build", ['concat', 'uglify']);

};
