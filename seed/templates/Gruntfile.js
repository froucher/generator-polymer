'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // configurable paths
  var yeomanConfig = {
    app: '',
    dist: '',
    tmp: ''
  };

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      options: {
        nospawn: true,
        livereload: { liveCSS: false }
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          '<%%= yeoman.app %>/*.html',
          '{<%%= yeoman.tmp %>,<%%= yeoman.app %>}/styles/{,*/}*.css',
          '{<%%= yeoman.tmp %>,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      },
      js: {
        files: ['<%%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '<%%= yeoman.app %>/styles/{,*/}*.css',
        ],
        tasks: ['autoprefixer:server']
      }<% if (includeSass) { %>,
      sass: {
        files: [
          '<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
        ],
        tasks: ['sass:server', 'autoprefixer:server']
      }<% } %><% if (includeJade) { %>,
      jade: {
        files: [
          '<%%= yeoman.app %>/{,*/}*.jade',
        ],
        tasks: ['jade:server']
      }<% } %>
    },<% if (includeSass) { %>
    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {<% if (includeLibSass) { %>
        sourceMap: true,
        includePaths: ['bower_components']
        <% } else { %>
        sourcemap: true,
        loadPath: 'bower_components'
      <% } %>},
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}'],
          dest: '<%%= yeoman.dist %>',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['styles/{,*/}*.{scss,sass}'],
          dest: '<%%= yeoman.tmp %>',
          ext: '.css'
        }]
      }
    },<% } %><% if (includeJade) { %>
    jade: {
      options: {
        pretty: true
      },
      dist: {
        options: {
          style: 'compressed'
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['views/{,*/}*.jade'],
          dest: '<%%= yeoman.dist %>',
          ext: '.html'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: [ '{,*/}*.jade', 'views/{,*/}*.jade'],
          dest: '<%%= yeoman.tmp %>',
          ext: '.html'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: [ 'test/{,*/}*.jade'],
          dest: '<%%= yeoman.tmp %>',
          ext: '.html'
        }]
      }
    },<% } %>
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.tmp %>',
          src: '**/*.css',
          dest: '<%%= yeoman.tmp %>'
        }]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>',
          src: ['**/*.css', '!bower_components/**/*.css'],
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    connect: {
      options: {
        port: 9000,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '<%%= yeoman.tmp %>'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: {
            target: 'http://localhost:<%%= connect.options.port %>/test'
          },
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.app)
            ];
          },
          keepalive: true
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, yeomanConfig.dist)
            ];
          }
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>'
      }
    },
    clean: {
      server: [<% if (includeJade) { %>
        '<%%= yeoman.tmp %>/{,*/}*.html',<% } %><% if (includeSass) { %>
        '<%%= yeoman.tmp %>/{,*/}*.css'<% } %>
      ]
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%%= yeoman.app %>/scripts/{,*/}*.js',
        '!<%%= yeoman.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },
    // See this tutorial if you'd like to run PageSpeed
    // against localhost: http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/
    pagespeed: {
      options: {
        // By default, we use the PageSpeed Insights
        // free (no API key) tier. You can use a Google
        // Developer API key if you have one. See
        // http://goo.gl/RkN0vE for info
        nokey: true
      },
      // Update `url` below to the public URL for your site
      mobile: {
        options: {
          url: "https://developers.google.com/web/fundamentals/",
          locale: "en_GB",
          strategy: "mobile",
          threshold: 80
        }
      }
    }
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'clean:server',<% if (includeSass) { %>
      'sass:server',<% } %><% if (includeJade) { %>
      'jade:server',<% } %>
      'autoprefixer:server',
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',<% if (includeJade) { %>
    'jade:test',<% } %>
    'connect:test'
  ]);

  grunt.registerTask('default', [
    'jshint'
  ]);
};
