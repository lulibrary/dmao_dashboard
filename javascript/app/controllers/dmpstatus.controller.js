app.controller('dmpStatusCtrl', function($scope, $rootScope, $http, api, config) {  
    // init
    $scope.value = 0;
    // $scope.fraction = {numerator: 0, denominator: 0}
    request({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function request(message){
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        count:      true
                    };
        
        api.uri.dmpStatus(params).then(function(response) {
        //     var count = 0;
        //     for(i=0;i<response.length;++i) {
        //         if (response[i].dmp_status === 'completed' || response[i].dmp_status === 'verified') ++count;
        //     }

        //     // only update if dirty
        //     if (count !== $scope.fraction.numerator)
        //         $scope.fraction.numerator = count;
        //     // only update if dirty
        //     if (response.length !== $scope.fraction.denominator)
        //         $scope.fraction.denominator = response.length;
        // });
        $scope.$apply(function(){
            var value = response[0].num_dmp_status;
            if (value !== $scope.value) $scope.value = value;
            });
        });
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        request(message);
    });  
});