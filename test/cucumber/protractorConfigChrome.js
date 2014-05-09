exports.config = {
    framework: 'cucumber',
    cucumberOpts: {
        require: 'test/cucumber/stepDefinitions.js'
    },
    specs: ['features/*.feature']
};