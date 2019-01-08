/* jshint unused:false */
var dojoConfig = {
    async: true,
    baseUrl: '/base',
    packages: ['tests', 'src', {
        name: 'dojo',
        location: 'bower_components/dojo'
    }, {
        name: 'dijit',
        location: 'bower_components/dijit'
    }],
    has: {
        'dojo-undef-api': true
    }
};

window.__karma__.dojoStart = function(){
	let TEST_REGEXP = /Spec.*\.js$/;
	return Object.keys(window.__karma__.files).filter((file) => TEST_REGEXP.test(file));
}
