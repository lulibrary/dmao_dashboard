app.controller('dataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };        
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'data_download');
            DataAccessLineChart(data, {width:700, height:300});    
            // console.log('DataAccessLineChart(');        
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