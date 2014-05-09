exports.config = {
 	cucumberOpts: {
 		require: "test/cucumber/stepDefinitions.js"
 	},
 	specs: ['features/*.feature']
}