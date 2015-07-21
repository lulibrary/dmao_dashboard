app.controller('storageUnitCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        if(config.controllersInView.storageUnitCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                $scope.$apply(function(){
                    var total = 0;
                    var previous_project_id = -1;
                    for(i=0;i<response.length;++i) {            
                        if (response[i].project_id != previous_project_id) {
                            total += response[i].expected_storage;
                        }
                        previous_project_id = response[i].project_id;
                    }
                    var value = Math.round(total * 0.001024);

                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        }
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });   
});