// var app = angular.module('dmaoApp', []);

// // This is a compromise. Factory is used to create an Angular service with dependency injection 
// // into the controllers to make it explicit that api is an external dependency. 
// // Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// // the config definition.
// app.factory('api', function() { 
//     return ApiService;
// });

// app.controller('datasetsCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,  
//             });

//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                         count:      true 
//                     };
//         // uri.addSearch("count", 'true');
//         //console.log('UC datasets ' + uri);

//         api.uri.datasets(params).then(function(response) {
//             $scope.$apply(function(){
//                 var value = response[0].num_datasets;
//                 // only update if dirty
//                 if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });        
// });   

// app.controller('rcukFundedDatasetsCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });

//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                         filter:     'rcuk',
//                         count:      true
//                     };
//         // var promise = api.uri.datasets(params);
//         // uri.addSearch("filter", 'rcuk');
//         // uri.addSearch("count", 'true');
//         //console.log('UC 1 ' + uri);

//         api.uri.datasets(params).then(function(response) {
//             $scope.$apply(function(){            
//                 var value = response[0].num_datasets;
//                 // only update if dirty
//                 if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });        
// });

// app.controller('dmpsCreatedCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });
    
//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                         has_dmp:    true,
//                         count:      true
//                     };
        
//         api.uri.dmps(params).then(function(response) {
//             $scope.$apply(function(){ 
//                 var value = response[0].num_project_dmps;
//                 // only update if dirty
//                 if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });    
// });

// app.controller('noDmpProjectsCtrl', function($scope, $rootScope, $http, api) {
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });
    
//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                         has_dmp:    false,
//                         count:      true
//                     };
        
//         api.uri.dmps(params).then(function(response) {
//             $scope.$apply(function(){
//                 var value = response[0].num_project_dmps;
//                 // only update if dirty
//                 if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });
// });

// app.controller('dmpStatusCtrl', function($scope, $rootScope, $http, api) {  
//     // init
//     $scope.value = 0;
//     // $scope.fraction = {numerator: 0, denominator: 0}
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });

//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                         count:      true
//                     };
        
//         api.uri.dmpStatus(params).then(function(response) {
//         //     var count = 0;
//         //     for(i=0;i<response.length;++i) {
//         //         if (response[i].dmp_status === 'completed' || response[i].dmp_status === 'verified') ++count;
//         //     }

//         //     // only update if dirty
//         //     if (count !== $scope.fraction.numerator)
//         //         $scope.fraction.numerator = count;
//         //     // only update if dirty
//         //     if (response.length !== $scope.fraction.denominator)
//         //         $scope.fraction.denominator = response.length;
//         // });
//         $scope.$apply(function(){
//             var value = response[0].num_dmp_status;
//             if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });  
// });

// app.controller('expectedStorageCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });

//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty:    message.faculty,
//                     };
        
//         api.uri.storage(params).then(function(response) {
//             $scope.$apply(function(){
//                 var total = 0;
//                 var previous_project_id = -1;
//                 for(i=0;i<response.length;++i) {            
//                     if (response[i].project_id != previous_project_id) {
//                         total += response[i].expected_storage;
//                     }
//                     previous_project_id = response[i].project_id;
//                 }
//                 var value = Math.round(total * 0.001);

//                 // only update if dirty
//                 if (value !== $scope.value) $scope.value = value;
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });   
// });

// app.controller('rcukAccessComplianceCtrl', function($scope, $rootScope, $http, api) {
//     // init
//     $scope.value = 0;
//     request({
//                 startDate:      App.startDateDefault, 
//                 endDate:        App.endDateDefault,
//                 faculty:        App.facultyDefault,
//             });

//     function request(message){
//         var params = {  date:       'project_start',
//                         sd:         message.startDate, 
//                         ed:         message.endDate,
//                         faculty: message.faculty
//                     };
//         api.uri.rcukAccessCompliance(params).then(function(response) {
//             $scope.$apply(function(){
//                 var count = 0;
//                 for(i=0;i<response.length;++i) {
//                     if (response[i].data_access_statement === 'exists with persistent link') ++count;
//                 }

//                 // only update if dirty
//                 var value = 0;
//                 if (count && count !== $scope.value) {
//                     value = (count / response.length) * 100;
//                     $scope.value = Math.round(value);
//                 }
//             });
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });    
// });

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

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     }); 
    
// });

// app.controller('metadataAccessCtrl', function($scope, $rootScope, $http, api) {
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
//         //console.log('metadata access ' + uri);
//         $http.get(uri)
//         .success(function(response) {

//             var count = 0;
//             for(i=0;i<response.length;++i) {
//                 if (response[i].access_type === 'metadata') count += response[i].counter;
//             }
//             // only update if dirty
//             if (count !== $scope.value)
//                 $scope.value = count;
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });    
// });

// app.controller('dataAccessChartCtrl', function($scope, $rootScope, $http, api) {  
//     var params = {
//                 startDate:          App.startDateDefault, 
//                 endDate:            App.endDateDefault,
//                 faculty:            App.facultyDefault,
//                 summary_by_date:  true
//             };
    
//     request(params);

//     function request(message){
//         var params = {  date:               'project_start',
//                         sd:                 message.startDate,
//                         ed:                 message.endDate,
//                         faculty:            message.faculty,
//                         summary_by_date:    true
//                     };        
//         api.uri.datasetAccess(params).then(function(data){
//             //console.log('data access ' + uri);
//             data = ApiService.filter.datasetAccess(data, 'data_download');
//             DataAccessLineChart(data, {width:700, height:300});    
//             // console.log('DataAccessLineChart(');        
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     });  
// });

// app.controller('metadataAccessChartCtrl', function($scope, $rootScope, $http, api) {  
//     var params = {
//                 startDate:          App.startDateDefault, 
//                 endDate:            App.endDateDefault,
//                 faculty:            App.facultyDefault,
//                 summary_by_date:  true
//             };
    
//     request(params);

//     function request(message){
//         var params = {  date:               'project_start',
//                         sd:                 message.startDate,
//                         ed:                 message.endDate,
//                         faculty:            message.faculty,
//                         summary_by_date:    true
//                     };        
//         api.uri.datasetAccess(params).then(function(data){
//             //console.log('data access ' + uri);
//             data = ApiService.filter.datasetAccess(data, 'metadata');
//             MetadataAccessLineChart(data, {width:700, height:300});    
//             // console.log('MetadataAccessLineChart(');        
//         });
//     }

//     $rootScope.$on("FilterEvent", function (event, message) {
//         request(message);
//     }); 
// });

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
//         $rootScope.$on("FilterEvent", function (event, message) {
//             $scope.message = message.msg;
//             //console.log('message.msg ' + $scope.message);
//             $scope.endDate = message.endDate;
//             //console.log('message.endDate ' + $scope.endDate);
//         });        
// });


// app.controller('filterController', function($scope, $rootScope, $interval) {
//     $scope.startDate = App.startDateDefault;
//     $scope.endDate = App.endDateDefault;
//     $scope.faculty = App.facultyDefault;   
//     $scope.facultyName = App.facultyMap[App.facultyDefault];

//     function broadcastFilterChange(msg){
//         // //console.log(msg);
//         $rootScope.$broadcast("FilterEvent", {  
//                                                     msg: msg,
//                                                     startDate: $scope.startDate,
//                                                     endDate: $scope.endDate,
//                                                     faculty: $scope.faculty
//                                                     }
//             );       
//     }

//     function update() {
//         broadcastFilterChange("Timed update");
//         // //console.table(App);
//     }
//     var timeout = App.updateDelay;
//     $interval(update, timeout); 

//     /****************
//         startDate
//     *****************/
//     $scope.$watch(
//         function() {
//             return $scope.startDate;
//         },
//         function(newValue, oldValue) {
//             //console.log('Watched App.startDate');
//             // if(angular.equals(newValue, oldValue)){
//             //     return; 
//             // }
//             //console.log('old ', oldValue, 'new ', newValue);
//             $scope.startDate = newValue;                
//             // broadcastDate("New date range");
//         }); 

//     /****************
//         endDate
//     *****************/
//     $scope.$watch(
//         function() {
//             return $scope.endDate;
//         },
//         function(newValue, oldValue) {
//             //console.log('Watched App.endDate');
//             // if(angular.equals(newValue, oldValue)){
//             //     return;
//             // }    
//             //console.log('old ', oldValue, 'new ', newValue);
//             $scope.endDate = newValue;
//         });  

//     /****************
//         faculty
//     *****************/
//     $scope.$watch(
//         function() {
//             return $scope.faculty;
//         },
//         function(newValue, oldValue) {
//             //console.log('Watched App.endDate');
//             // if(angular.equals(newValue, oldValue)){
//             //     return;
//             // }    
//             // console.log('old ', oldValue, 'new ', newValue);
//             $scope.faculty = newValue;
//             $scope.facultyName = App.facultyMap[newValue];       
//         });     

//     /****************
//         DETERMINE WHETHER TO BROADCAST
//         startDate,
//         endDate,
//         faculty
//     *****************/
//     $scope.$watch(
//         function() {
//             return {startDate: $scope.startDate, 
//                     endDate: $scope.endDate,
//                     faculty: $scope.faculty
//                     }
//         },
//         function(newRange, oldRange) {
//             // //console.log('Watched App.startEndDate in dateRangeCtrl');
//             // //console.log('old ', oldValue, 'new ', newValue);
//             var shouldBroadcast = false;
//             if (newRange.startDate !== oldRange.startDate){
//                 shouldBroadcast = true;
//             }
//             if (newRange.endDate !== oldRange.endDate){
//                 shouldBroadcast = true;
//             }
//             if (newRange.faculty !== oldRange.faculty){
//                 shouldBroadcast = true;
//             }
//             if (shouldBroadcast){
//                 broadcastFilterChange("Filter change");
//             } 
//         },
//         true
//         );   
  

// });
