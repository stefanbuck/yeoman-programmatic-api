'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var chalk = require('chalk');
var yo = require('yeoman-environment');
var inquirer = require('inquirer');
var _ = require('lodash');

rimraf.sync('output');
mkdirp.sync('output');
process.chdir('output');

var env = yo.createEnv();

env.getNpmPaths = function() {
  return process.env.PATH.split(':').map(function(item) {
    return path.join(item, '..', 'lib', 'node_modules');
  });
};

env.lookup(function () {

  var list = _.uniq(env.store.namespaces().map(function(name) {
    return name.split(':')[0];
  }));

  inquirer.prompt([{
    type: 'list',
    name: 'generator',
    message: 'Select a generator',
    choices: list
  }], function( answers ) {

    var gen = env.run(answers.generator, function() {
      console.log(chalk.bgMagenta('generator done'));
    });

    gen.on('npmInstall', function(data) {
      console.log(chalk.bgMagenta('npmInstall', data));
    });

    gen.on('npmInstall:end', function(data) {
      console.log(chalk.bgMagenta('npmInstall:end', data));
    });

    gen.on('bowerInstall', function(data) {
      console.log(chalk.bgMagenta('bowerInstall', data));
    });

    gen.on('bowerInstall:end', function(data) {
      console.log(chalk.bgMagenta('bowerInstall:end', data));
    });

  });
});
