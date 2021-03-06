angular.module('dmaoApp').controller('dataCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.dataset_accesses = {};
        $scope.dataset_accesses.data = config.loadingText;
        $scope.dataset_accesses.metadata = config.loadingText;
        var params = {
                        sd:         message.startDate,
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        summary_totals:    true
                    };
        api.uri.datasetAccess(params).then(function(response) {
            $scope.$apply(function(){
            //    console.log('api.uri.datasetAccess ', response);

            $scope.dataset_accesses.data = 0;
            $scope.dataset_accesses.metadata = 0;
            for (var i=0; i < response.length; ++i){
                if (response[i].access_type === 'data_download'){
                    $scope.dataset_accesses.data = numeral(response[i].count).format('0,0');
                }
                if (response[i].access_type === 'metadata'){
                    $scope.dataset_accesses.metadata = numeral(response[i].count).format('0,0');
                }
            }
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