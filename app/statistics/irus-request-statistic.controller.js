angular.module('dmaoApp').controller('irusRequestCtrl', function($scope, $rootScope, api, config) {
    // init
    $scope.value = 0;
    $scope.dois = {};

    update({
                startDate:      config.startDate,
                endDate:        config.endDate
            });

    function update(message){
        $scope.value = config.loadingText;

        var isoStartDate =  message.startDate.substr(0,4) + '-' +
                            message.startDate.substr(4,2) + '-' +
                            message.startDate.substr(6,2);
        var isoEndDate =    message.endDate.substr(0,4) + '-' +
                            message.endDate.substr(4,2) + '-' +
                            message.endDate.substr(6,2);


        //fudge for now (there is no repo data for datasets for our demo institutions)
        var repo_id = 'irusuk:24'; // not dataset repo but http://eprints.lancs.ac.uk/ (Eprints)
        if (config.institutionId === 'birmingham'){
            repo_id = 'irusuk:44';  // not dataset repo but http://epapers.bham.ac.uk/ (Eprints)
        }
        if (config.institutionId === 'york'){
            repo_id = 'irusuk:1000'; // no repos at all at IRUS
        }

        var params = {
            Report:               'RR1',
            Release:              '4',
            RequestorID:          'MyOrg',
            BeginDate:            isoStartDate,
            EndDate:              isoEndDate,
            RepositoryIdentifier: repo_id,
            Granularity:          'Totals'
        };

        api.irus.report(params).then(function(response) {
            $scope.$apply(function(){ // why needed?
                var reportItems = response.ReportResponse.Report.Report.Customer.ReportItems;
                var value = 0;
                if (reportItems.length) {
                    value = response.ReportResponse.Report.Report.Customer.ReportItems[0].ItemPerformance[0].Instance.Count;
                }
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


});



