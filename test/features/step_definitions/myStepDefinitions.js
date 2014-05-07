'use strict';

var myStepDefinitionsWrapper = function () {
  this.World = require('../support/world.js').World; // overwrite default World constructor

  this.Given(/^I am on the Cucumber.js GitHub repository$/, function(callback) {
    // Express the regexp above with the code you wish you had.
    // `this` is set to a new this.World instance.
    // i.e. you may use this.browser to execute the step:

    this.visit('http://localhost:3000', callback);

    // The callback is passed to visit() so that when the job's finished, the next step can
    // be executed by Cucumber.
  });

  this.When(/^I click on "(.*)"$/, function(link, callback) {
    // Express the regexp above with the code you wish you had. Call callback() at the end
    // of the step, or callback.pending() if the step is not yet implemented:

    this.browser.clickLink(link, function() {
        callback();
    });

  });

  this.Then(/^I should see a button or link named "(.*)"$/, function(text, callback) {
    // matching groups are passed as parameters to the step definition

    var matches = this.browser.text('button, a');
    if (matches.indexOf(text) !== -1) {
        callback();
    } else {
        callback.fail(new Error('Expected to find a button or link named ' + text));
    }
    // var pageTitle = this.browser.text('title');
    // if (title === pageTitle) {
    //   callback();
    // } else {
    //   callback.fail(new Error('Expected to be on page with title ' + title));
    // }
  });
};

module.exports = myStepDefinitionsWrapper;