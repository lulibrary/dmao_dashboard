angular.module('dmaoApp').controller('noDmpProjectsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });
    
    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.noDmpProjectsCtrl){ 
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
                    if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    }); 
}]);