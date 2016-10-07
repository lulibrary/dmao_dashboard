angular.module('dmaoApp').controller('aggregateStatisticCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.count_institutions = 0;
    $scope.count_faculties = 0;
    $scope.count_departments = 0;
    $scope.count_dmps = 0;
    $scope.count_publications = 0;
    $scope.count_datasets = 0;
    $scope.count_dataset_accesses = 0;
    $scope.irus_requests = 0;

    //$scope.data = {};
    //$scope.data.institutions = false;

    update({
                //startDate:      config.startDate,
                //endDate:        config.endDate,
    });

    function update(message){
        $scope.count_institutions = config.loadingText;
        $scope.count_faculties = config.loadingText;
        $scope.count_departments = config.loadingText;
        $scope.count_dmps = config.loadingText;
        $scope.count_publications = config.loadingText;
        $scope.count_datasets = config.loadingText;
        $scope.dataset_accesses = {};
        $scope.dataset_accesses.data = config.loadingText;
        $scope.dataset_accesses.metadata = config.loadingText;
        $scope.irus_requests = config.loadingText;

        /************************ IRUS-UK BEGIN **********************************/
        //fudge for now (there is no repo data for datasets for our demo institutions)

        var params = {
            Report:               'RR1',
            Release:              '4',
            RequestorID:          'MyOrg',
            BeginDate:            '2000-01-01', // Datepicker default start
            EndDate:              '2035-01-01', // Datepicker default end
            Granularity:          'Totals'
        };

        params.RepositoryIdentifier = 'irusuk:24'; // not dataset repo but http://eprints.lancs.ac.uk/ (Eprints)
        var irusuk_24 = api.irus.report(params);

        params.RepositoryIdentifier = 'irusuk:44'; // not dataset repo but http://epapers.bham.ac.uk/ (Eprints)
        var irusuk_44 = api.irus.report(params);

        // add all institutional IRUS data together, quick and dirty for now
        $.when(irusuk_24, irusuk_44).then(function(irusuk_24_response, irusuk_44_response) {

            var value = 0;
            var reportItems = [];

            // 24
            reportItems = [];
            reportItems = irusuk_24_response[0].ReportResponse.Report.Report.Customer.ReportItems;
            if (reportItems.length) {
                value += parseInt(irusuk_24_response[0].ReportResponse.Report.Report.Customer.ReportItems[0].ItemPerformance[0].Instance.Count);
            }

            // 44
            reportItems = [];
            reportItems = irusuk_44_response[0].ReportResponse.Report.Report.Customer.ReportItems;
            if (reportItems.length) {
                value += parseInt(irusuk_44_response[0].ReportResponse.Report.Report.Customer.ReportItems[0].ItemPerformance[0].Instance.Count);
            }

            $scope.$apply(function(){
                $scope.irus_requests = numeral(value).format('0,0');
            });
        });
        /************************ IRUS-UK END **********************************/


        api.uri.public('o_count_institutions').then(function(response) {
            //$scope.$apply(function(){
                //$scope.data.institutions = true;
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_institutions)
                    $scope.count_institutions = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_faculties').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_faculties)
                    $scope.count_faculties = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_departments').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_departments)
                    $scope.count_departments = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_dmps').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_dmps)
                    $scope.count_dmps = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_publications').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_publications)
                    $scope.count_publications = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_datasets').then(function(response) {
            //$scope.$apply(function(){
                var value = response[0].count;
                // only update if dirty
                if (value !== $scope.count_datasets)
                    $scope.count_datasets = numeral(value).format('0,0');
            //});
        });
        api.uri.public('o_count_dataset_accesses').then(function(response) {
            $scope.$apply(function(){ //not sure why this is needed for values to stick in this controller
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
        //console.log("update firing");
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });        
}]);