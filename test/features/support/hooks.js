'use strict';

var myHooks = function () {
    this.Before(function(callback) {
        // console.log(scenario.getName(), "(" + scenario.getUri() + ":" + scenario.getLine() + ")");

        // Just like inside step definitions, "this" is set to a World instance.
        // It's actually the same instance the current scenario step definitions
        // will receive.

        // Let's say we have a bunch of "maintenance" methods available on our World
        // instance, we can fire some to prepare the application for the next
        // scenario:

        // this.bootFullTextSearchServer();
        // this.createSomeUsers();

        // Don't forget to tell Cucumber when you're done:
        callback();
    });
};

module.exports = myHooks;