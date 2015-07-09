var app = angular.module('dmaoApp', []);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
app.factory('api', function() { 
    return ApiService;
});

app.controller('datasetsCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.datasets(params);
        uri.addSearch("count", 'true');
        //console.log('UC datasets ' + uri);

        $http.get(uri)
        .success(function(response) {
            var value = response[0].num_datasets;
            // only update if dirty
            if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });        
});   

app.controller('rcukFundedDatasetsCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.datasets(params);
        uri.addSearch("filter", 'rcuk');
        uri.addSearch("count", 'true');
        //console.log('UC 1 ' + uri);

        $http.get(uri)
        .success(function(response) {
            var value = response[0].num_datasets;
            // only update if dirty
            if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });        
});

app.controller('dmpsCreatedCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });
    
    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty,
                    };
        var uri = api.uri.dmps(params);
        uri.addSearch("has_dmp", 'true');
        uri.addSearch("count", 'true');
        //console.log('UC 2a ' + uri);
        $http.get(uri)
        .success(function(response) {
            var value = response[0].num_project_dmps;
            // only update if dirty
            if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });    
});

app.controller('noDmpProjectsCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.noDmps(params);
        uri.addSearch("has_dmp", 'false');
        uri.addSearch('is_awarded', 'true');
        uri.addSearch("count", 'true');
        //console.log('UC 2b ' + uri);
        $http.get(uri)
        .success(function(response) {
            var value = response[0].num_project_dmps;
            // only update if dirty
            if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });
});

app.controller('dmpStatusCtrl', function($scope, $rootScope, $http, api) {  
    // init
    $scope.value = 0;
    // $scope.fraction = {numerator: 0, denominator: 0}
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.dmpStatus(params);
        uri.addSearch("count", 'true');
        //console.log('UC 3 ' + uri);
        $http.get(uri)
        .success(function(response) {
        //     var count = 0;
        //     for(i=0;i<response.length;++i) {
        //         if (response[i].dmp_status === 'completed' || response[i].dmp_status === 'verified') ++count;
        //     }

        //     // only update if dirty
        //     if (count !== $scope.fraction.numerator)
        //         $scope.fraction.numerator = count;
        //     // only update if dirty
        //     if (response.length !== $scope.fraction.denominator)
        //         $scope.fraction.denominator = response.length;
        // });
        var value = response[0].num_dmp_status;
        if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });  
});

app.controller('expectedStorageCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.expectedStorage(params);
        //console.log('UC 4 ' + uri);
        $http.get(uri)
        .success(function(response) {
            var total = 0;
            var previous_project_id = -1;
            for(i=0;i<response.length;++i) {            
                if (response[i].project_id != previous_project_id) {
                    total += response[i].expected_storage;
                }
                previous_project_id = response[i].project_id;
            }
            var value = Math.ceil(total * 0.001);

            // only update if dirty
            if (value !== $scope.value)
                $scope.value = value;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });   
});

app.controller('rcukAccessComplianceCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                        faculty: message.faculty
                    };
        var uri = api.uri.rcukAccessCompliance(params);
        //console.log('UC 5 ' + uri);
        $http.get(uri)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].data_access_statement === 'exists with persistent link') ++count;
            }

            // only update if dirty
            var value = 0;
            if (count && count !== $scope.value)
                value = (count / response.length) * 100;
                $scope.value = Math.ceil(value);
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });    
});

// app.controller('dataAccessCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDate, 
//                 endDate:        App.endDate 
//             });

//     function request(message){
//         var params = {  dateFilter: 'project_start',
//                         startDate: message.startDate, 
//                         endDate: message.endDate,
//                     };
//         var uri = api.uri.datasetAccessByDateRange(params);
//         //console.log('data access ' + uri);
//         $http.get(uri)
//         .success(function(response) {
//             var count = 0;
//             for(i=0;i<response.length;++i) {
//                 if (response[i].access_type === 'data_download') count += response[i].counter;
//             }
//             // only update if dirty
//             if (count !== $scope.value)
//                 $scope.value = count;
//         });
//     }

//     $rootScope.$on("DatePickerEvent", function (event, message) {
//         request(message);
//     }); 
    
// });

app.controller('metadataAccessCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      App.startDate, 
                endDate:        App.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.datasetAccessByDateRange(params);
        //console.log('metadata access ' + uri);
        $http.get(uri)
        .success(function(response) {

            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].access_type === 'metadata') count += response[i].counter;
            }
            // only update if dirty
            if (count !== $scope.value)
                $scope.value = count;
        });
    }

    $rootScope.$on("DatePickerEvent", function (event, message) {
        request(message);
    });    
});

app.controller('dataAccessChartCtrl', function($scope, $rootScope, $http, api) {  
    var params = {  dateFilter: 'project_start',
        startDate: App.startDate, 
        endDate: App.endDate,
        faculty: App.faculty,
    };

    DataAccessLineChart({width:700, height:300});

    $rootScope.$on("DatePickerEvent", function (event, message) {
        // //console.log('dataAccessChartCtrl received message');
        // DataAccessChart.init(message);
        DataAccessLineChart({width:700, height:300});
    });  
});

app.controller('metadataAccessChartCtrl', function($scope, $rootScope, $http, api) {  
    var params = {  dateFilter: 'project_start',
        startDate: App.startDate, 
        endDate: App.endDate,
        faculty: App.faculty,
    };
    MetadataAccessLineChart({width:700, height:300});

    $rootScope.$on("DatePickerEvent", function (event, message) {
        // //console.log('metadataAccessChartCtrl received message');
        // DataAccessChart.init(message);
        MetadataAccessLineChart({width:700, height:300});
    });  
});

// app.controller('accessMetadataCtrl', function($scope, $rootScope, $http, api) {
//     var template = URITemplate(api.prefix() + "/dataset_accesses/inst/count/{institutionId}");
//     var url = template.expand(
//                 {
//                     institutionId:  institutionId, 
//                 });
//     $http.get(url)
//     .success(function(response) {
//         var count = 0;
//         for(i=0;i<response.length;++i) {
//             if (response[i].access_type === 'metadata') count = response[i].counter;
//         }
//         $scope.value = count; 
//     });

//         $rootScope.$on("NonComplianceEvent", function (event, message) {
//             $scope.message = message.msg;
//             //console.log($scope.message);
//         });
//         $rootScope.$on("YearEvent", function (event, message) {
//             $scope.message = message.msg;
//             //console.log($scope.message);
//         });
//         $rootScope.$on("DatePickerEvent", function (event, message) {
//             $scope.message = message.msg;
//             //console.log('message.msg ' + $scope.message);
//             $scope.endDate = message.endDate;
//             //console.log('message.endDate ' + $scope.endDate);
//         });        
// });


app.controller('dateRangeCtrl', function($scope, $rootScope, $interval) {
    $scope.startDate = App.startDate;
    $scope.endDate = App.endDate;
    $scope.faculty = App.faculty;

    function broadcastDate(msg){
        // //console.log(msg);
        $rootScope.$broadcast("DatePickerEvent", {  
                                                    msg: msg,
                                                    startDate: $scope.startDate,
                                                    endDate: $scope.endDate,
                                                    faculty: $scope.faculty
                                                    }
            );       
    }

    function update() {
        broadcastDate("Timed update");
        // //console.table(App);
    }
    var timeout = App.updateDelay;
    $interval(update, timeout); 

    /****************
        startDate
    *****************/
    $scope.$watch(
        function() {
            return $scope.startDate;
        },
        function(newValue, oldValue) {
            //console.log('Watched App.startDate');
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
            //console.log('Watched App.endDate');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.endDate = newValue;
        });  

    /****************
        startDate, 
        endDate
    *****************/
    $scope.$watch(
        function() {
            return {startDate: $scope.startDate, endDate: $scope.endDate}
        },
        function(newRange, oldRange) {
            // //console.log('Watched App.startEndDate in dateRangeCtrl');
            // //console.log('old ', oldValue, 'new ', newValue);
            var shouldBroadcast = false;
            if (newRange.startDate !== oldRange.startDate){
                shouldBroadcast = true;
            }
            if (newRange.endDate !== oldRange.endDate){
                shouldBroadcast = true;
            }
            if (shouldBroadcast){
                broadcastDate("New date range");
            }
        },
        true
        );   

    /****************
        faculty
    *****************/
    $scope.$watch(
        function() {
            return $scope.faculty;
        },
        function(newValue, oldValue) {
            //console.log('Watched App.faculty');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.faculty = newValue;
            var facultyMap = {
                0: 'All faculties',
                1: 'FASS',
                2: 'FST',
                3: 'FHM',
                4: 'LUMS'
            };
            $scope.facultyName = facultyMap[$scope.faculty];            
            broadcastDate("New date range");            
        });  

});
