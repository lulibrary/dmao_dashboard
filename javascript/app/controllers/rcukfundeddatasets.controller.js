app.controller('rcukFundedDatasetsCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDateDefault, 
                endDate:        App.endDateDefault,
                faculty:        App.facultyDefault,
            });

    function request(message){
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        filter:     'rcuk',
                        count:      true
                    };
        // var promise = api.uri.datasets(params);
        // uri.addSearch("filter", 'rcuk');
        // uri.addSearch("count", 'true');
        //console.log('UC 1 ' + uri);

        api.uri.datasets(params).then(function(response) {
            $scope.$apply(function(){            
                var value = response[0].num_datasets;
                // only update if dirty
                if (value !== $scope.value) $scope.value = value;
            });
        });
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        request(message);
    });        
});