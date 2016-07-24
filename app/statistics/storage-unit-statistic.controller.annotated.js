angular.module('dmaoApp').controller('storageUnitCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.storageUnitCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                var total = 0;
                for(var i=0;i<response.length;++i) {            
                    total += response[i].expected_storage;
                }
                var value = Math.round(total * 0.001024);
                $scope.$apply(function(){
                    // only update if dirty
                    if (value !== $scope.value)
                        $scope.value = numeral(value).format('0,0');
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
