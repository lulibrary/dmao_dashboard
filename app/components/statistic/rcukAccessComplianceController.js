app.controller('rcukAccessComplianceCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        if(config.controllersInView.rcukAccessComplianceCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty: message.faculty
                        };
            api.uri.rcukAccessCompliance(params).then(function(response) {
                $scope.$apply(function(){
                    var count = 0;
                    for(i=0;i<response.length;++i) {
                        if (response[i].data_access_statement === 'exists with persistent link') ++count;
                    }

                    // only update if dirty
                    var value = 0;
                    if (count && count !== $scope.value) {
                        value = (count / response.length) * 100;
                        $scope.value = Math.round(value);
                    }
                });
            });
        }
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });    
});