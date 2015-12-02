app.controller('metadataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    $scope.dataAvailable = false;

    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        var params = {  //date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };        
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            $scope.dataAvailable = false;
            data = api.filter.datasetAccess(data, 'metadata');
            if (data.length) {
                $scope.dataAvailable = true;
                //console.log('data length ', data.length);
            }
            $scope.$apply();
            MetadataAccessLineChart(data, {width:700, height:300});    
            // console.log('MetadataAccessLineChart(');        
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