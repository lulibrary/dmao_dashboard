angular.module('dmaoApp').controller('publicationsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });
    
    function update(message){
        $scope.value = config.loadingText;
        var params = {  date:       'publication_date',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        count:      true
                    };
        
        api.uri.publications(params).then(function(response) {
            $scope.$apply(function(){
                var value = response[0].num_publications;
                // only update if dirty
                if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
            });
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