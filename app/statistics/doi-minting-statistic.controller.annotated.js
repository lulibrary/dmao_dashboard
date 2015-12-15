app.controller('doiMintingCtrl', ['$scope', '$rootScope', 'api', 'config', function($scope, $rootScope, api, config) {
    // init
    $scope.value = 0;
    $scope.dois = {};

    update({
                startDate:      config.startDate,
                endDate:        config.endDate
            });

    function update(message){
        $scope.value = config.loadingText;
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

        //symbol
        //var uri = 'http://search.datacite.org/api?q=*&wt=json&fq=datacentre_symbol:' +
        //            config.institutionDataCiteSymbol +
        //            '&rows=0' +
        //            '&fq=minted:' +
        //            '[' + isoStartDate + 'T00:00:00Z/DAY' + '%20TO%20' +
        //            isoEndDate + 'T23:59:59Z/DAY]';

        //console.log('App ', App);
        //console.log('Making a querystring with ', config.institutionDataCiteSymbol);


        var prefix = '10.17635';
        //fudge for now (should use config.institutionDataCiteSymbol)
        if (config.institutionId === 'birmingham'){
            prefix = '10.13140';
        }
        if (config.institutionId === 'york'){
            prefix = '10.15124';
        }
       

        //prefix
        var uri = 'http://search.datacite.org/api?q=*&wt=json&fq=prefix:' +
            prefix +
            '&rows=0' +
            '&fq=minted:' +
            '[' + isoStartDate + 'T00:00:00Z/DAY' + '%20TO%20' +
            isoEndDate + 'T23:59:59Z/DAY]';

        //$http.get(uri).then(function(response) {
        //    var value = response.data.response.numFound;
        //    // only update if dirty
        //    if (value !== $scope.value) $scope.value = value;
        //})
        //    .catch(function(response) {
        //    var value = 'Error';
        //    // only update if dirty
        //    if (value !== $scope.value) $scope.value = value;
        //});
        api.datacite.minted(uri).then(function(response) {
            $scope.$apply(function(){ // why needed?
                var value = response.response.numFound;
                //console.log('minted ', value);
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



