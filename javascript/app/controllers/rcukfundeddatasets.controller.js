app.controller('rcukFundedDatasetsCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        filter:     'rcuk',
                        count:      true
                    };

        api.uri.datasets(params).then(function(response) {
            $scope.$apply(function(){            
                var value = response[0].num_datasets;
                // only update if dirty
                if (value !== $scope.value) $scope.value = value;
            });
        });
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });        
});