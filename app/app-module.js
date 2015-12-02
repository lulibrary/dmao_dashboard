var app = angular.module('dmaoApp', ['ngRoute',
                            'ngTouch',
                            'ui.grid',
                            'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.rowEdit',
                            'ui.grid.selection', 'ui.grid.exporter',
                            'ui.grid.resizeColumns'
]);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
app.factory('api', function() { 
    return ApiService;
});

app.factory('config', function() { 
    return App;
});

app.factory('ui', function() {
    return UiService;
});