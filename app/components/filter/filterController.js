app.controller('filterCtrl', function($scope, $rootScope, $interval, config) {
    $scope.startDate = config.startDateDefault;
    $scope.endDate = config.endDateDefault;
    $scope.faculty = config.facultyDefault;   
    $scope.facultyName = config.facultyMap[config.facultyDefault];

    function broadcastFilterChange(msg){
        // //console.log(msg);
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
    var timeout = config.updateDelay;
    $interval(update, timeout); 

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
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.startDate = newValue;                
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
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.endDate = newValue;
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
            // console.log('old ', oldValue, 'new ', newValue);
            $scope.faculty = newValue;
            $scope.facultyName = config.facultyMap[newValue];       
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
  

});
