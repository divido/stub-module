
module.exports = function(config) {
	config.set({
		frameworks: ['jasmine', 'dojo'],

		// list of files / patterns to load in the browser
		files: [
			'tests/karmaBootstrap.js',
			{ pattern: 'bower_components/**/*.js', included: false },
			{ pattern: 'src/**/*.js', included: false },
			{ pattern: 'tests/**/*.js', included: false },
			{ pattern: 'tests/**/*.html', included: false }
		],

		reporters: ['progress'],
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,

		autoWatch: true,
		singleRun: false,

		browsers: ['Firefox'],
		concurrency: 2,

		browserDisconnectTimeout: 60000,
		browserNoActivityTimeout: 60000,

		browserConsoleLogOptions: {
			terminal: true
		}
	});
}
