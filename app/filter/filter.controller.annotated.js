app.controller('filterCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$cookies', 'breadcrumbs', 'api', 'config', function($scope, $rootScope, $interval, $timeout, $cookies, breadcrumbs, api, config) {
    $scope.startDate = config.startDateDefault;
    $scope.endDate = config.endDateDefault;
    $scope.faculty = config.facultyDefault;
    $scope.facultyName = config.facultyMap[config.facultyDefault];
    $scope.dummy = false;

    getInstitutionFaculties();

    $scope.breadcrumbs = breadcrumbs;

    function broadcastFilterChange(msg){
        // console.log('msg ', msg);
        // console.log('$scope.startDate: ', $scope.startDate, '$scope.endDate: ', $scope.endDate, '$scope.faculty: ' , $scope.faculty);
        $rootScope.$broadcast("FilterEvent", {  
                                                    msg: msg,
                                                    startDate: $scope.startDate,
                                                    endDate: $scope.endDate,
                                                    faculty: $scope.faculty
                                                    }
            );   
    }

    function update() {
        broadcastFilterChange("Timed update");
        // console.log("TIMED UPDATE at " + Date());
        // //console.table(config);
    }
    // var timeout = config.updateDelay;
    // $interval(update, timeout);

    /****************
        startDate
    *****************/
    $scope.$watch(
        function() {
            return $scope.startDate;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.startDate');
            // if(angular.equals(newValue, oldValue)){
            //     return; 
            // }
            //console.log('old startDate', oldValue, 'new ', newValue);
            $scope.startDate = newValue;  
            // config.startDate = newValue;              
            // broadcastDate("New date range");
        }); 

    /****************
        endDate
    *****************/
    $scope.$watch(
        function() {
            return $scope.endDate;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.endDate');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            //console.log('old endDate', oldValue, 'new ', newValue);
            $scope.endDate = newValue;
            // config.endDate = newValue;
        });  

    /****************
        faculty
    *****************/
    $scope.$watch(
        function() {
            return $scope.faculty;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.endDate');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            //console.log('old faculty', oldValue, 'new ', newValue);
            $scope.faculty = newValue;
            $scope.facultyName = config.facultyMap[newValue]; 
            config.faculty =  newValue;  // important for route changes, which create new controllers!
        });     

    /****************
        DETERMINE WHETHER TO BROADCAST
        startDate,
        endDate,
        faculty
    *****************/
    $scope.$watch(
        function() {
            return {startDate: $scope.startDate,
                    endDate: $scope.endDate,
                    faculty: $scope.faculty
                    }
        },
        function(newRange, oldRange) {
            // //console.log('Watched config.startEndDate in dateRangeCtrl');
            // //console.log('old ', oldValue, 'new ', newValue);
            var shouldBroadcast = false;
            if (newRange.startDate !== oldRange.startDate){
                shouldBroadcast = true;
            }
            if (newRange.endDate !== oldRange.endDate){
                shouldBroadcast = true;
            }
            if (newRange.faculty !== oldRange.faculty){
                shouldBroadcast = true;
            }
            if (shouldBroadcast){
                broadcastFilterChange("Filter change");
            } 
        },
        true
        );

    function getInstitutionFaculties() {
        //fetch data using api
        //facultyMap = api....
        var facultyMap = {};
        api.uri.divisions().then(function(response) {
            //console.log('Divisions ', response);
            facultyMap[''] = 'All divisions';
            for (var i=0; i<response.length; ++i){
                facultyMap[response[i].faculty_id] = response[i].name;
            }
            //console.log('MY Divisions ', facultyMap);
            $scope.facultyMap = facultyMap;
            $scope.$apply();
        });

        //hardcode for now, until it makes its way into the api
        //var facultyMap = {
        //    '': 'All divisions',
        //    1: 'Faculty of Arts and Social Sciences',
        //    2: 'Faculty of Science and Technology',
        //    3: 'Faculty of Health and Medicine',
        //    4: 'Lancaster University Management School'
        //};

        //not strictly needed but leave for now to keep legacy config synched
        config.facultyMap = facultyMap;


        //console.log('$scope.facultyMap ', $scope.facultyMap);

    }

    function getDataCitePrefix(){
        api.uri.public('o_datacite_id').then(function(response) {
            //console.log('Datacite prefix response', response);
            for (var i=0; i<response.length; ++i){
                if (response[i].inst_id === config.institutionId){
                    config.institutionDataCiteSymbol = response[i].datacite_id;
                    break;
                }
            }
        });
    }

    $scope.institutionName = $cookies.get('institutionName');

}]);
