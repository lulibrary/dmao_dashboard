var app = angular.module('dmaoApp', ['ngRoute',
                            'ngTouch',
                            'ui.grid',
                            'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.rowEdit',
                            'ui.grid.selection', 'ui.grid.exporter',
                            'ui.grid.resizeColumns',
                            'ngCookies'
]);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
//

app.factory('api', function() {
    return ApiService;
});

app.factory('config', function() { 
    return App;
});

app.factory('ui', function() {
    return UiService;
});

app.run(['$cookies', '$location', '$rootScope', 'api', 'config', function($cookies, $location, $rootScope, api, config) {
    var apiKey = $cookies.get('apiKey');
    //console.log('app.run apiKey ', apiKey);
    if (apiKey)
        api.apiKey = apiKey;
    else
        api.apiKey = '';

    config.institutionId = $cookies.get('institutionId');
    //console.log('app.run institutionId ', config.institutionId);

    // console.log('on startup setting path to ', $cookies.get('savedRoute'));
    // $location.path($cookies.get('savedRoute'));
    var username = $cookies.get('username');
    if (username) {
        // console.log('trying to change route ');
        // $location.path($cookies.get('newRoute'));
        $rootScope.loggedInUser = username;
    }    
}]);