app.controller('noDmpProjectsCtrl', function($scope, $rootScope, $http, api, config) {
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });
    
    function update(message){
        if(config.controllersInView.noDmpProjectsCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            has_dmp:    false,
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
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });
});