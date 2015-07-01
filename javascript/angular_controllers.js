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
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.datasetsByDateRange(params);
        console.log('UC datasets ' + uri);

        $http.get(uri)
        .success(function(response) {
            var value = response.length;
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
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.datasetsByDateRange(params);
        uri.addSearch("filter", 'rcuk');
        console.log('UC 1 ' + uri);

        $http.get(uri)
        .success(function(response) {
            var value = response.length;
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
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });
    
    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.dmpsByDateRange(params);
        console.log('UC 2a ' + uri);
        $http.get(uri)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].has_dmp === true) ++count;
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

app.controller('noDmpProjectsCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.noDmpsByDateRange(params);
        console.log('UC 2b ' + uri);
        $http.get(uri)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].has_dmp === false) ++count;
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

app.controller('dmpStatusCtrl', function($scope, $rootScope, $http, api) {  
    // init
    $scope.fraction = {numerator: 0, denominator: 0}
    request({
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.dmpStatusByDateRange(params);
        console.log('UC 3 ' + uri);
        $http.get(uri)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].dmp_status === 'completed') ++count;
            }

            // only update if dirty
            if (count !== $scope.fraction.numerator)
                $scope.fraction.numerator = count;
            // only update if dirty
            if (response.length !== $scope.fraction.denominator)
                $scope.fraction.denominator = response.length;
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
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.expectedStorageByDateRange(params);
        console.log('UC 4 ' + uri);
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
            var value = Math.ceil(total);

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
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.rcukAccessComplianceByDateRange(params);
        console.log('UC 5 ' + uri);
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

app.controller('dataAccessCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.datasetAccessByDateRange(params);
        console.log('data access ' + uri);
        $http.get(uri)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].access_type === 'data_download') count += response[i].counter;
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

app.controller('metadataAccessCtrl', function($scope, $rootScope, $http, api) {
    // init
    $scope.value = 0;
    request({
                startDate:      api.defaults.startDate, 
                endDate:        api.defaults.endDate 
            });

    function request(message){
        var params = {  dateFilter: 'project_start',
                        startDate: message.startDate, 
                        endDate: message.endDate,
                    };
        var uri = api.uri.datasetAccessByDateRange(params);
        console.log('metadata access ' + uri);
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
//             console.log($scope.message);
//         });
//         $rootScope.$on("YearEvent", function (event, message) {
//             $scope.message = message.msg;
//             console.log($scope.message);
//         });
//         $rootScope.$on("DatePickerEvent", function (event, message) {
//             $scope.message = message.msg;
//             console.log('message.msg ' + $scope.message);
//             $scope.endDate = message.endDate;
//             console.log('message.endDate ' + $scope.endDate);
//         });        
// });

// app.controller('dateCtrl', function($scope, $rootScope) {
//     $scope.year = '1970';

//     $scope.changeHandler = function() {
//         $rootScope.$broadcast("YearEvent", {msg: "The year is " + $scope.year});
//     };
// });

app.controller('dateRangeCtrl', function($scope, $rootScope, $interval, api) {
    $scope.startDate = api.defaults.startDate;
    $scope.endDate = api.defaults.endDate;

    function broadcastDate(msg){
        console.log(msg);
        $rootScope.$broadcast("DatePickerEvent", {  
                                                    msg: msg,
                                                    startDate: $scope.startDate,
                                                    endDate: $scope.endDate
                                                    }
            );       
    }

    $scope.dateRangeChangeHandler = function() {
        broadcastDate("New date range");
    };   


    function update() {
        broadcastDate("Timed update");
    }
    var timeout = 600000;
    $interval(update, timeout); 
});



// app.controller('updateCtrl', function($scope, $rootScope, $interval) {
//     // console.log('updateCtrl initialised');
//   // var timeout = 10000;

//   // function update() {

//   // }

//   // $interval(update, timeout);
// });

