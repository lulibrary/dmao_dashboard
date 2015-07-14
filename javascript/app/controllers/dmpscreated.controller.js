app.controller('dmpsCreatedCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    request({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });
    
    function request(message){
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        has_dmp:    true,
                        count:      true
                    };
        
        api.uri.dmps(params).then(function(response) {
            $scope.$apply(function(){ 
                var value = response[0].num_project_dmps;
                // only update if dirty
                if (value !== $scope.value) $scope.value = value;
            });
        });
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        request(message);
    });    
});