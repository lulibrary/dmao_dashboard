app.controller('rcukAccessComplianceTableCtrl', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.rcukAccessCompliance(params).then(function(data){
            //console.log('Datasets ' + uri);
            RcukAccessComplianceTable.init(data);  
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
});