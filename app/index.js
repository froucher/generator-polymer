'use strict';
var yeoman = require('yeoman-generator');
var path = require('path');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc:     'Whether dependencies should be installed',
      defaults: false,
    });

    this.option('skip-install-message', {
      desc:     'Whether commands run should be shown',
      defaults: false,
    });
  },
  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Out of the box I include HTML5 Boilerplate and Polymer'));

    var defaultName = path.basename(process.cwd());
    var prompts = [{
        name: 'includeCore',
        message: 'Would you like to include core-elements?',
        type: 'confirm'
      }, {
        name: 'includePaper',
        message: 'Would you like to include paper-elements?',
        type: 'confirm'
      }, {
        name: 'includeJade',
        message: 'Would you like to use Jade for html element?',
        type: 'confirm'
      }, {
        name: 'includeSass',
        message: 'Would you like to use SASS/SCSS for element styles?',
        type: 'confirm'
      }, {
        when: function (answers) {
          return answers.includeSass;
        },
        type: 'confirm',
        name: 'includeLibSass',
        message: 'Would you like to use libsass? Read up more at \n' +
          chalk.green('https://github.com/andrew/node-sass#node-sass'),
        default: false
      }];

    this.prompt(prompts, function (answers) {
      this.includeCore = answers.includeCore;
      this.includePaper = answers.includePaper;
      this.includeSass = answers.includeSass;
      this.includeLibSass = answers.includeLibSass;
      this.includeRubySass = !answers.includeLibSass;
      this.includeJade = answers.includeJade;

      // Save user configuration options to .yo-rc.json file
      this.config.set({
        includeSass: this.includeSass,
        includeJade: this.includeJade
      });
      this.config.save();

      done();
    }.bind(this));
  },
  app: function () {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('bowerrc', '.bowerrc');
    this.copy('_bower.json', 'bower.json');
    this.copy('jshintrc', '.jshintrc');
    this.copy('editorconfig', '.editorconfig');
    this.template('Gruntfile.js');
    this.template('_package.json', 'package.json');
    this.mkdir('app');
    this.mkdir('app/styles');
    this.mkdir('app/images');
    this.mkdir('app/scripts');
    this.mkdir('app/elements');
    this.template('app/favicon.ico');
    this.template('app/robots.txt');
    this.copy('app/main.css',
      this.includeSass ? 'app/styles/main.scss':
                         'app/styles/main.css');
    this.copy('app/app.js', 'app/scripts/app.js');
    this.copy('app/htaccess', 'app/.htaccess');
    this.copy('app/yo-list.css',
      this.includeSass ? 'app/elements/yo-list/yo-list.scss':
                         'app/elements/yo-list/yo-list.css');
    this.copy('app/yo-greeting.css',
      this.includeSass ? 'app/elements/yo-greeting/yo-greeting.scss':
                         'app/elements/yo-greeting/yo-greeting.css');
    if(!this.includeJade) {
      this.template('app/404.html', 'app/404.html');
      this.copy('app/elements.html', 'app/elements/elements.html');
      this.copy('app/yo-list.html', 'app/elements/yo-list/yo-list.html');
      this.copy('app/yo-greeting.html', 'app/elements/yo-greeting/yo-greeting.html');
      this.copy('app/index.html', 'app/index.html');
      this.copy('test/index.html', 'test/index.html');
      this.copy('test/tests.html', 'test/tests.html');
      this.copy('test/yo-greeting-basic.html', 'test/yo-greeting-basic.html');
      this.copy('test/yo-list-basic.html', 'test/yo-list-basic.html');
    } else {
      this.template('app/404.jade', 'app/404.jade');
      this.copy('app/elements.jade', 'app/elements/elements.jade');
      this.copy('app/yo-list.jade', 'app/elements/yo-list/yo-list.jade');
      this.copy('app/yo-greeting.jade', 'app/elements/yo-greeting/yo-greeting.jade');
      this.copy('app/index.jade', 'app/index.jade');
      this.copy('test/index.jade', 'test/index.jade');
      this.copy('test/tests.jade', 'test/tests.jade');
      this.copy('test/yo-greeting-basic.jade', 'test/yo-greeting-basic.jade');
      this.copy('test/yo-list-basic.jade', 'test/yo-list-basic.jade');
    }

    //this.directory('test', 'app/test');
  },
  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      skipMessage: this.options['skip-install-message'],
    });
  }
});
