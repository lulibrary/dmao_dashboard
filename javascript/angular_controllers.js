// var institutionId = 'lancaster';

// var ApiService = {
//     prefix: function() {
//         var uri = URI({
//             protocol:   'http',
//             hostname:   'lib-ldiv.lancs.ac.uk',
//             port:       '8080',
//             path:       'dmaonline', 
//         });
//         return uri.toString();
//     },
//     template: {
//         dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
//     },
// };


var app = angular.module('dmaoApp', []);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
app.factory('api', function() { 
    return ApiService;
    // return { 
    //     prefix: function() {
    //         var uri = URI({
    //             protocol:   'http',
    //             hostname:   'lib-ldiv.lancs.ac.uk',
    //             port:       '8080',
    //             path:       'dmaonline', 
    //         });
    //         return uri.toString();
    //     },
    //     template: {
    //         dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    //     },
    // };
});

app.controller('rcukFundedDatasetsCtrl', function($scope, $rootScope, $http, api) {
    console.log('Dot notation string ' + api.template.dr);
    // console.table(api);
    // console.log('prefix ' + api.prefix());
    $scope.value = 0;

    var template = URITemplate(api.prefix() + "/use_case_1/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });     
    $http.get(url)
    .success(function(response) {
        $scope.value = response.length;
    });

    $rootScope.$on("DatePickerEvent", function (event, message) {
        // $scope.message = message.msg;
        // console.log('In RCUK message.msg ' + $scope.message);
        // $scope.startDate = message.startDate;
        // console.log('In RCUK message.startDate ' + $scope.startDate);        
        // $scope.endDate = message.endDate;
        // console.log('In RCUK message.endDate ' + $scope.endDate);   
        $scope.value = 0;        
        // Build url for date range
        // var url =   prefix +
        //             'use_case_1' + '/' +
        //             'dr' + '/' +
        //             institutionId + '/' + 
        //             message.startDate + '/' +
        //             message.endDate + '/' +
        //             'project_start';
        // console.log('Date range url ' + url);

        var template = URITemplate(api.prefix() + '/use_case_1' + api.template.dr);
        var url = template.expand(
                    {
                        institutionId:  institutionId, 
                        startDate:      message.startDate, 
                        endDate:        message.endDate,
                        dateFilter:     'project_start'
                    });
        // console.log('Expanded template ' + result);
        $http.get(url)
        .success(function(response) {
            $scope.value = response.length;
        });
    });        
});

app.controller('dmpsCreatedCtrl', function($scope, $rootScope, $http, api) {
	$scope.value = 0;
    
    // var url = api.prefix() + 'use_case_2a' + '/' + institutionId + '/' + 'count';

    var template = URITemplate(api.prefix() + "/use_case_2a/{institutionId}/count");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });      
    $http.get(url)
    .success(function(response) {
		$scope.value = response[0].num_projects_with_a_dmp;
    });    

    $rootScope.$on("DatePickerEvent", function (event, message) {
        console.log('dmpsCreatedCtrl message received');
        $scope.value = 0;        
        var template = URITemplate(api.prefix() + '/use_case_2a' + api.template.dr);
        var url = template.expand(
                    {
                        institutionId:  institutionId, 
                        startDate:      message.startDate, 
                        endDate:        message.endDate,
                        dateFilter:     'project_start'
                    });
        console.log('dmpsCreatedCtrl date range url ' + url);
        $http.get(url)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].has_dmp === true) ++count;
            }
            $scope.value = count;
            console.log('dmpsCreated date range count ' + count);
        });
    });
});

app.controller('noDmpProjectsCtrl', function($scope, $rootScope, $http, api) {
	$scope.value = 0;

    // var url = api.prefix() + 'use_case_2b' + '/' + institutionId + '/' + 'count';

    var template = URITemplate(api.prefix() + "/use_case_2b/{institutionId}/count");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });    
    $http.get(url)
    .success(function(response) {
		$scope.value = response[0].num_funded_proj_with_no_dmp;
    });

    $rootScope.$on("DatePickerEvent", function (event, message) {
        $scope.value = 0;        
        var template = URITemplate(api.prefix() + '/use_case_2b' + api.template.dr);
        var url = template.expand(
                    {
                        institutionId:  institutionId, 
                        startDate:      message.startDate, 
                        endDate:        message.endDate,
                        dateFilter:     'project_start'
                    });
        $http.get(url)
        .success(function(response) {
            var count = 0;
            for(i=0;i<response.length;++i) {
                if (response[i].has_dmp === false) ++count;
            }
            $scope.value = count;
            console.log('noDmpProjects date range count ' + count);
        });
    });
});

app.controller('dmpStatusCtrl', function($scope, $rootScope, $http, api) {    
    // var url = api.prefix() + 'use_case_3' + '/' + institutionId;

    function successHandler(response) {
        var count = 0;
        for(i=0;i<response.length;++i) {
            if (response[i].dmp_status === 'completed') ++count;
        }
        var fraction = (count / response.length) * 100;
        return Math.ceil(fraction);
    }

    var template = URITemplate(api.prefix() + "/use_case_3/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });

    $http.get(url)
    .success(function(response) {
        $scope.value = successHandler(response);
    });

    $rootScope.$on("DatePickerEvent", function (event, message) {
        $scope.value = 0;        
        var template = URITemplate(api.prefix() + '/use_case_3' + api.template.dr);
        var url = template.expand(
                    {
                        institutionId:  institutionId, 
                        startDate:      message.startDate, 
                        endDate:        message.endDate,
                        dateFilter:     'project_start'
                    });
        $http.get(url)
        .success(function(response) {
            $scope.value = successHandler(response);
        });
    });    

});

app.controller('expectedStorageCtrl', function($scope, $http, api) {

    var previous_project_id = -1;

    // var url = api.prefix() + 'use_case_4' + '/' + institutionId;

    var template = URITemplate(api.prefix() + "/use_case_4/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });

    $http.get(url)
    .success(function(response) {
    	var total = 0;
    	for(i=0;i<response.length;++i) {            
    		if (response[i].project_id != previous_project_id) {
                total += response[i].expected_storage;
            }
            previous_project_id = response[i].project_id;
    	}
		$scope.value = Math.ceil(total);
    });
});

app.controller('rcukAccessComplianceCtrl', function($scope, $rootScope, $http, api) {
    // var url = api.prefix() + 'use_case_5' + '/' + institutionId;

    var template = URITemplate(api.prefix() + "/use_case_5/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });

    $http.get(url)
    .success(function(response) {
    	var count = 0;
    	for(i=0;i<response.length;++i) {
    		if (response[i].data_access_statement === 'exists with persistent link') ++count;
    	}
        var fraction = (count / response.length) * 100;
        $scope.value = Math.ceil(fraction); 

        if ($scope.value === 0)
            $rootScope.$broadcast("NonComplianceEvent", {
            msg: "Compliance FAIL"
        });
    });
});

app.controller('accessDataCtrl', function($scope, $http, api) {
    // var url = api.prefix() + 
    var template = URITemplate(api.prefix() + "/dataset_accesses/inst/count/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });
    $http.get(url)
    .success(function(response) {
        var count = 0;
        for(i=0;i<response.length;++i) {
            if (response[i].access_type === 'data_download') count = response[i].counter;
        }
        $scope.value = count; 
    });
});

app.controller('accessMetadataCtrl', function($scope, $rootScope, $http, api) {
    var template = URITemplate(api.prefix() + "/dataset_accesses/inst/count/{institutionId}");
    var url = template.expand(
                {
                    institutionId:  institutionId, 
                });
    $http.get(url)
    .success(function(response) {
        var count = 0;
        for(i=0;i<response.length;++i) {
            if (response[i].access_type === 'metadata') count = response[i].counter;
        }
        $scope.value = count; 
    });

        $rootScope.$on("NonComplianceEvent", function (event, message) {
            $scope.message = message.msg;
            console.log($scope.message);
        });
        $rootScope.$on("YearEvent", function (event, message) {
            $scope.message = message.msg;
            console.log($scope.message);
        });
        $rootScope.$on("DatePickerEvent", function (event, message) {
            $scope.message = message.msg;
            console.log('message.msg ' + $scope.message);
            $scope.endDate = message.endDate;
            console.log('message.endDate ' + $scope.endDate);
        });        
});

app.controller('dateCtrl', function($scope, $rootScope) {
    $scope.year = '1970';

    $scope.changeHandler = function() {
        $rootScope.$broadcast("YearEvent", {msg: "The year is " + $scope.year});
    };
});

app.controller('dateRangeCtrl', function($scope, $rootScope) {
    $scope.startDate = '20000101';
    $scope.endDate = '99991231';
    // $scope.stateChangeHandler = function() {
    //     console.log('Start date change');
    //     // alert('bla');
    //     // $rootScope.$broadcast("DatePickerEvent", {msg: "The year is " + $scope.dateRange});
    // };
    $scope.dateRangeChangeHandler = function() {
        console.log('Date range change');
        // alert('bla');
        $rootScope.$broadcast("DatePickerEvent", {  
                                                    msg: "New date range ",
                                                    startDate: $scope.startDate,
                                                    endDate: $scope.endDate
                                                    }
            );
    };    
});