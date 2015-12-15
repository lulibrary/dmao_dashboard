app.controller('dataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', function($scope, $rootScope, $http, api, ui, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        $scope.dataAvailable = false;
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {  //date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'data_download');
            if (data.length) {
                $scope.dataAvailable = true;
                //console.log('data length ', data.length);
            }
            $scope.dataFetched = true;
            $scope.$apply();
            DataAccessLineChart(data, {width: 700, height: 300});
            spinner.stop();
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