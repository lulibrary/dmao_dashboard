app.controller('datasetsCtrl', function($scope, $rootScope, $http, api, config) {

    //console.log('hard coding $rootScope.loggedInUser credentials in datasetsCtrl to bypass auth');
    //$rootScope.loggedInUser = 'luve_u';

    // init
    $scope.value = 0;
    
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        // if(config.inView.datasetsCtrl){
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            count:      true 
                        };
            //console.log('before datasetsCtrl request');
            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){
                    var oldValue = $scope.value;
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value.toLocaleString();
                    //console.log('after datasetsCtrl update ', 'old ', oldValue, 'new ', $scope.value);
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });       
});  
