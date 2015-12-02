app.controller("loginCtrl", function($scope, $location, $rootScope, api, config) {
    // optionally prefill for testing
    $scope.institution = '';
    $scope.username = '';
    $scope.password = '';
    api.clearKey();

    api.uri.o.institutions().then(function(response){

        $scope.$apply(function(){
            //console.log('response ', response);
            $scope.institutions = response;
            //console.log('Institutions ', $scope.institutions);
        });
    });

    $scope.login = function() {

        //console.log($scope.username + ' attempting to log in ' + ' with password ' +
        //$scope.password);
        //console.log('api.authenticated apiKey ', api.apiKey);
        if (!api.authenticated()){
            //console.log('!api.authenticated apiKey ', api.apiKey);
            api.authenticate($scope.institution, $scope.username, $scope.password).then(function(response){
                //console.log('api.authenticated apiKey ', api.apiKey);

                config.institutionId = $scope.institution;

                angular.forEach($scope.institutions, function(data){
                    if (data.inst_id == $scope.institution) {
                        //console.log('name ', data.name);
                        config.institutionName = data.name;
                    }
                });

                $scope.$apply(function() {
                    $rootScope.loggedInUser = $scope.username;
                    $location.path("/stats");
                });
            });
            //} else {
            //    console.log('apiKey ', api.apiKey);
            //    $location.path("/all");
            //}
        }
    };

    $scope.logout = function() {
        api.clearKey();
        config.institutionId = '';
        config.institutionName = '';
        $rootScope.loggedInUser = '';
        $scope.institution = '';
        $scope.username = '';
        $scope.password = '';
        $location.path('/landing');
    };

});
