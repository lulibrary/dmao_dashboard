app.controller('datasetsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.datasets(params).then(function(data){
            DatasetsTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);