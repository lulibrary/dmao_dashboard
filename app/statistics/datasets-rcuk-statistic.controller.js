app.controller('datasetsRCUKCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;

    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        // if(config.inView.datasetsRCUKCtrl){        
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            filter:     'rcuk',
                            count:      true
                        };
            //console.log('before datasetsRCUKCtrl request');
            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
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
});