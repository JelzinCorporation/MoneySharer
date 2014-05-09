exports.config = {
    capabilities: {
        'browserName': 'phantomjs'
    },
    framework: 'cucumber',
    cucumberOpts: {
        require: 'test/cucumber/stepDefinitions.js'
    },
    specs: ['features/*.feature']
}