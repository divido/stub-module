/*jshint unused:false, loopfunc:true*/
define([
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/Deferred'

], function (
    array,
    lang,
    Deferred
    ) {

    var uniqueCounter = 0;

    return function (modulePath, stubs) {
        var key;
        var stubname;
        var returnModule;
        var def = new Deferred();
        var processedDependencies = [];
        var baseClasses = [];

        var undefDependencies = function (mod) {
            if (array.indexOf(processedDependencies, mod) !== -1 ||
                mod.indexOf('!') !== -1) {
                return;
            }
            processedDependencies.push(mod);

            array.forEach(require.modules[mod].deps, function (dep) {
                undefDependencies(dep.mid);
            });

            // undef all base classes if this is a class that was created using dojo/declare
            // a bit worried about using `._meta.bases` but not sure what else to do at the moment
            // always undef original module
            var returnObj = require(modulePath);
            if (mod === modulePath ||
                (returnObj._meta &&
                    array.indexOf(require(modulePath)._meta.bases, require(mod)) !== -1)
                ) {
                require.undef(mod);
                baseClasses.push(mod);
            }
        };
        
        // require stubbed module just in case it hasn't been required
        // so that we can get it's dependencies
        require([modulePath], function (returnObject) {
            undefDependencies(modulePath);

            var defineStub = function (stubname, stub) {
                define(stubname, [], function () {
                    return stub;
                });
            };

            // build maps
            var stubMap = {};
            stubMap['*'] = {};
            var resetMap = {};
            resetMap['*'] = {};
            for (var key in stubs) {
                if (stubs.hasOwnProperty(key)) {
                    // Unique Counter is to avoid a multiple define error when stubbing the same
                    // module twice. See 'can stub the same module more than once test'
                    stubname = 'STUB_' + key + (++uniqueCounter);
                    stubMap['*'][key] = stubname;
                    resetMap['*'][key] = key;

                    defineStub(stubname, stubs[key]);
                }
            }

            // get module with stubs
            require({
                map: stubMap
            }, [modulePath], function (StubbedModule) {
                // clear cache again
                array.forEach(baseClasses, lang.hitch(require, 'undef'));

                // reset map
                require({map: resetMap});

                // require original module again just to make sure
                // that all dependencies are cached again
                require([modulePath], function () {
                    // but return subbed module
                    def.resolve(StubbedModule);
                });
            });
        });

        return def.promise;
    };
});