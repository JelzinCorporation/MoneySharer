'use strict';

var myAroundHooks = function() {
    this.Around(function(runScenario) {
        // "this" is - as always - an instance of World promised to the scenario.

        // First do the "before scenario" tasks:

        // this.bootFullTextSearchServer();
        // this.createSomeUsers();
      
        // When the "before" duty is finished, tell Cucumber to execute the scenario
        // and pass a function to be called when the scenario is finished:

        runScenario(function(callback) {
            // Now, we can do our "after scenario" stuff:

            // this.emptyDatabase();
            // this.shutdownFullTextSearchServer();

            // Tell Cucumber we're done:
            callback();
        });
    });
};

module.exports = myAroundHooks;