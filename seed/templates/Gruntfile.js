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

  grunt.initConfig({
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
          '{,*/}*.html',
          '{,*/}*.css',
          '{,*/}*.js',
          '{,*/}*.{png,jpg,jpeg,gif,webp}'
        ]
      },
      js: {
        files: [
          '{,*/}*.js'
        ],
        tasks: ['jshint']
      },
      styles: {
        files: [
          '{,*/}*.css',
        ],
        tasks: ['autoprefixer:server']
      }<% if (includeSass) { %>,
      sass: {
        files: [
          '{,*/}*.{scss,sass}',
        ],
        tasks: ['sass:server', 'autoprefixer:server']
      }<% } %><% if (includeJade) { %>,
      jade: {
        files: [
          '{,*/}*.jade',
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
        loadPath: 'bower_components'
      <% } %>},
      server: {
        files: [{
          expand: true,
          cwd: '',
          src: ['{,*/}*.{scss,sass}'],
          dest: '',
          ext: '.css'
        }]
      }
    },<% } %><% if (includeJade) { %>
    jade: {
      options: {
        pretty: true
      },
      server: {
        files: [{
          expand: true,
          cwd: '',
          src: [ '{,*/}*.jade'],
          dest: '',
          ext: '.html'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: '',
          src: [ 'test/{,*/}*.jade'],
          dest: '',
          ext: '.html'
        }]
      }
    },<% } %>
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
              mountFolder(connect, '..')
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
              mountFolder(connect, '..')
            ];
          },
          keepalive: true
        }
      },
    },
    open: {
      server: {
        path: 'http://localhost:<%%= connect.options.port %>/<%= elementName %>.html'
      }
    },
    clean: {
      server: [<% if (includeJade) { %>
        '{,*/}*.html',<% } %><% if (includeSass) { %>
        '{,*/}*.css'<% } %>
      ]
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '{,*/}*.js',
        '!scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
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
