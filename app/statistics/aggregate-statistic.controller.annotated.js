app.controller('aggregateStatisticCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.count_institutions = 0;
    $scope.count_faculties = 0;
    $scope.count_departments = 0;
    $scope.count_dmps = 0;
    $scope.count_publications = 0;
    $scope.count_datasets = 0;
    $scope.count_dataset_accesses = 0;

    $scope.data = {};
    $scope.data.institutions = false;


    update({
                //startDate:      config.startDate,
                //endDate:        config.endDate,
            });

    function update(message){
        // if(config.inView.datasetsRCUKCtrl){        
            var params = {
                            //sd:         message.startDate,
                            //ed:         message.endDate,
                            //count:      true
                        };

            //api.uri.datasets(params).then(function(response) {
            //    $scope.$apply(function(){
            //        var value = response[0].num_datasets;
            //        // only update if dirty
            //        if (value !== $scope.value) $scope.value = value;
            //    });
            //});

        api.uri.public('o_count_institutions').then(function(response) {
            //$scope.$apply(function(){
                $scope.data.institutions = true;
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_institutions) $scope.count_institutions = value;
            //});
        });
        api.uri.public('o_count_faculties').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_faculties) $scope.count_faculties = value;
            //});
        });
        api.uri.public('o_count_departments').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_departments) $scope.count_departments = value;
            //});
        });
        api.uri.public('o_count_dmps').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_dmps) $scope.count_dmps = value;
            //});
        });
        api.uri.public('o_count_publications').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_publications) $scope.count_publications = value;
            //});
        });
        api.uri.public('o_count_datasets').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count.toLocaleString();
                // only update if dirty
                if (value !== $scope.count_datasets) $scope.count_datasets = value;
            //});
        });
        api.uri.public('o_count_dataset_accesses').then(function(response) {
            $scope.$apply(function(){ //not sure why this is needed for values to stick in this controller
                $scope.dataset_accesses = {};
                for (var i=0; i < response.length; ++i){
                    if (response[i].access_type === 'data_download'){
                        $scope.dataset_accesses.data = response[i].count.toLocaleString();
                    }
                    if (response[i].access_type === 'metadata'){
                        $scope.dataset_accesses.metadata = response[i].count.toLocaleString();
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