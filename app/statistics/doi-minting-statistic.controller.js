app.controller('doiMintingCtrl', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        //var params = {  date:       'project_start',
        //                sd:         message.startDate,
        //                ed:         message.endDate,
        //                faculty:    message.faculty,
        //            };
        var isoStartDate =  message.startDate.substr(0,4) + '-' +
                            message.startDate.substr(4,2) + '-' +
                            message.startDate.substr(6,2);
        var isoEndDate =    message.endDate.substr(0,4) + '-' +
                            message.endDate.substr(4,2) + '-' +
                            message.endDate.substr(6,2);
        var uri = 'http://search.datacite.org/api?q=*&wt=json&fq=datacentre_symbol:' +
                    config.institutionDataCiteSymbol +
                    '&rows=0' +
                    '&fq=minted:' +
                    '[' + isoStartDate + 'T00:00:00Z/DAY' + '%20TO%20' +
                    isoEndDate + 'T23:59:59Z/DAY]';
        $http.get(uri).then(function(response) {
                var value = response.data.response.numFound;
                // only update if dirty
                if (value !== $scope.value) $scope.value = value;
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