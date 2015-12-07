app.controller("loginCtrl", function($scope, $location, $rootScope, $cookies, api, config) {
    // optionally prefill for testing
    $scope.institution = 'luve_u';
    $scope.username = 'dladmin';
    $scope.password = 'dladmin';

    var username = $cookies.get('username');
    if (username)
            $rootScope.loggedInUser = username;
    else
        $rootScope.loggedInUser = '';

    var apiKey = $cookies.get('apiKey');
    if (apiKey)
        api.apiKey = apiKey;
    else
        api.apiKey = '';

    config.institutionId = $cookies.get('institutionId');

    api.uri.o.institutions().then(function(response){
        //get all the institutions
        //$scope.$apply(function(){
            //console.log('response ', response);
            $scope.institutions = response;
            //console.log('Institutions ', $scope.institutions);
        //});

        //get name of institution for user
        angular.forEach($scope.institutions, function(data){
            if (data.inst_id == $scope.institution) {
                //console.log('name ', data.name);
                config.institutionName = data.name;
            }
        });
    });

    //api.clearKey();



    $scope.login = function() {

        //console.log($scope.username + ' attempting to log in ' + ' with password ' +
        //$scope.password);
        //console.log('api.authenticated apiKey ', api.apiKey);
        if (!$cookies.get('username')){
        //if (!api.authenticated()){
            //console.log('!api.authenticated apiKey ', api.apiKey);
            api.authenticate($scope.institution, $scope.username, $scope.password).then(function(response){
                //console.log('api.authenticated apiKey ', api.apiKey);
                //expects a populated array
                if (response.length){
                    config.institutionId = $scope.institution;

                    $cookies.put('username', $scope.username);
                    $cookies.put('institutionId', $scope.institution);

                    api.apiKey = response[0].api_key;
                    $cookies.put('apiKey', response[0].api_key);

                    $scope.$apply(function() {
                        $rootScope.loggedInUser = $scope.username;
                        $location.path("/stats");
                    });
                }
                else{
                    //temporary!
                    alert('Aw snap! Something went wrong.');
                }
            });
        }
    };

    $scope.logout = function() {
        api.clearKey();
        config.institutionId = '';
        config.institutionName = '';
        $rootScope.loggedInUser = '';

        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
               //console.log('cookie ', k, '', v);
                $cookies.remove(k);
           });
        
        $scope.institution = '';
        $scope.username = '';
        $scope.password = '';

        $location.path("/");
    };

});
