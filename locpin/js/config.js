requirejs.config({
    baseUrl: '/lib',
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
        app: '../app',

        // RequireJS Plugins
        async: 'requirejs-plugins/src/async',
        font: 'requirejs-plugins/src/font',
        goog: 'requirejs-plugins/src/goog',
        image: 'requirejs-plugins/src/image',
        json: 'requirejs-plugins/src/json',
        noext: 'requirejs-plugins/src/noext',
        mdown: 'requirejs-plugins/src/mdown',
        propertyParser: 'requirejs-plugins/src/propertyParser',
        jquery: 'jquery/dist/jquery',
        bootstrap: 'bootstrap/dist/js/bootstrap',
        'jquery.validate': 'jquery-validation/dist/jquery.validate',
        'jquery.validate.unobtrusive': 'jquery-validation-unobtrusive/jquery.validate.unobtrusive'
    },
    shim: {
        bootstrap: { deps: ['jquery'] },
        'jquery.validate': ['jquery'],
        'jquery.validate.unobtrusive': ['jquery', 'jquery.validate']
    }
});
