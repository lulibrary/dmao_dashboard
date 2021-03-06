
// var app = angular.module('dmaoApp', []);

angular.module('dmaoApp', ['ngRoute',
                            'ngTouch',
                            'ui.grid',
                            'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.rowEdit',
                            'ui.grid.selection', 'ui.grid.exporter',
                            'ui.grid.resizeColumns',
                            'ngCookies', 'ng-breadcrumbs',
                            'schemaForm',
                            'angularUtils.directives.dirPagination',
                            'ui.bootstrap'
]);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
//

angular.module('dmaoApp').factory('api', function() {
    return ApiService;
});

angular.module('dmaoApp').factory('config', function() {
    return App;
});

angular.module('dmaoApp').factory('ui', function() {
    return UiService;
});

angular.module('dmaoApp').run(['$cookies', '$location', '$rootScope', 'api', 'config', function($cookies, $location, $rootScope, api, config) {
    var apiKey = $cookies.get('apiKey');
    //console.log('app.run apiKey ', apiKey);
    if (apiKey)
        api.apiKey = apiKey;
    else
        api.apiKey = '';

    config.institutionId = $cookies.get('institutionId');
    //console.log('app.run institutionId ', config.institutionId);

    // console.log('on startup setting path to ', $cookies.get('savedRoute'));
    // $location.path($cookies.get('savedRoute'));
    var username = $cookies.get('username');
    if (username) {
        // console.log('trying to change route ');
        // $location.path($cookies.get('newRoute'));
        $rootScope.loggedInUser = username;
    }    

}]);
angular.module('dmaoApp').controller("advocacyEventCtrl", ['$scope', '$http', '$location', '$route', '$routeParams', 'api', 'config', 'ui', function($scope, $http, $location, $route, $routeParams, api, config, ui){

    $scope.things = [];
    $scope.participants = [];

    $scope.schema = {
        type: "object",
        required: [
            'session_type',
            'session_content',
            'session_date'
        ],
        properties: {
            session_type: {
                type: "integer",
                title: "Type"
            },
            num_participants: {
                type: 'integer',
                title: 'Participants',
                minimum: 0
            },
            session_content: {
                type: 'string',
                minLength: 2,
                title: 'Content'
            },
            session_date: {
                title: 'Date',
                type: 'string',
                format: 'date'
            },
            notes: {
                type: 'string',
                minLength: 2,
                title: 'Notes'
            }
        }
    };

    $scope.form = [
        {
            key: 'session_date',
            type: 'datepicker',
            format: 'yyyy-mm-dd'
        },
        {
            key: 'session_content',
            fieldHtmlClass: 'advocacyContent'
        },
        {
            key: 'session_type',
            type: 'select',
            titleMap: []
        },
        {
            key: 'notes',
            type: 'textarea',
            fieldHtmlClass: 'advocacyNotes'
        },
        {
            key: 'num_participants',
            fieldHtmlClass: 'advocacyParticipants'
        },
        {
            type: 'submit',
            title: 'Save'
        }
    ];

    $scope.model = {};

    var path = $location.path();

    $scope.index = function(){
        var spinner = ui.spinner('loader');
        var promise = api.uri.advocacyEvents();
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);
            var last_event_id = null;
            angular.forEach(data, function(x) {
                if (x.event_id != last_event_id){
                    $scope.things.push(x);
                    last_event_id = x.event_id;
                }
            });
            $scope.$apply();
            spinner.stop();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.show = function(){
        // console.log('show called');
        var spinner = ui.spinner('loader');
        var params = { 'event_id': $routeParams.id }
        var promise = api.uri.advocacyEvents(params);
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);
            var last_event_id = null;
            angular.forEach(data, function(x) {
                // console.log(x);
                $scope.participants.push(x);
                if (x.event_id != last_event_id){
                    $scope.things.push(x);
                    last_event_id = x.event_id;
                }
            });
            $scope.$apply();
            spinner.stop();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.new = function(){
        $location.path('/advocacy/new');
    };

    function create(){
        post().then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $location.path('/advocacy');
                $scope.$apply();
            }
        });
    }

    function post(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.num_participants = thing.num_participants;
        o.notes = thing.notes;
        o.session_type = thing.session_type;
        o.session_date = thing.session_date;
        o.session_content = thing.session_content;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        return api.uri.post.advocacyEvents(params);
    }

    $scope.onSubmitNew = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            create();
        }
    };

    $scope.edit = function(){
        var spinner = ui.spinner('loader');
        var params = { 'event_id': $routeParams.id };
        var promise = api.uri.advocacyEvents(params);
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);

            // get actual header info from first record in array
            var x = data[0];
            // console.log(x);

            var o = {};
            o['event_id'] = x['event_id'];
            o['inst_id'] = x['inst_id'];
            o['notes'] = x['notes'];
            o['num_participants'] = x['num_participants'];
            o['session_content'] = x['session_content'];
            o['session_date'] = x['session_date'];
            o['session_type'] = x['session_type'];
            $scope.model = o;
            // console.log($scope.model);

            $scope.$apply();
            spinner.stop();
            // console.log('tings ', $scope.things);
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    function put(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o['pkey:event_id'] = thing.event_id;
        o.inst_id = config.institutionId;
        // if (thing.num_participants)
        o.num_participants = thing.num_participants;
        o.notes = thing.notes;
        o.session_type = thing.session_type;
        o.session_date = thing.session_date;
        o.session_content = thing.session_content;
        arr.push(o);
        var data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        api.uri.put.advocacyEvents(params).then(function(data, textStatus, jqXHR){
            if(jqXHR['status'] == 204) {
                $location.path('/advocacy');
                $scope.$apply();
            }
        });
    }

    $scope.onSubmitEdit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            put();
            // $scope.$apply();
        }
    };

    $scope.deleteAdvocacyEvent = function(eventId){
        var params = { 'event_id': eventId }
        api.uri.delete.advocacyEvents(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $location.path('/advocacy');
                $scope.$apply();
            }
        });
    };

    $scope.getPerson = function(val) {
        var params = {last_name_like: val};
        return api.uri.persons(params).then(function(response){
            return response.map(function(item){
                return item;
            });
        });
    };

    $scope.addPersonToEvent = function(searchPerson){
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.event_id = $scope.participants[0].event_id;
        o.person_id = searchPerson.person_id;
        arr.push(o);
        var data = arr;
        var params = {};
        params.data = data;

        api.uri.post.advocacyPersons(params).then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $route.reload();
            }
        });
    };

    $scope.removePersonFromEvent = function(searchPerson){
        var params = {};
        params.event_id = $scope.participants[0].event_id;
        params.person_id = searchPerson.person_id;
        api.uri.delete.advocacyPerson(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $location.path(path);
                // $route.reload();
            }
        });
    };

    function getSessionTypes(){
        var promise = api.uri.advocacySessionTypes();
        // console.log(promise);
        promise.success(function(data){
            // console.log('promise SUCCESS');
            var download = [];
            angular.forEach(data, function(x) {
                // console.log(x);
                var o = {};
                o['ast_id'] = x['ast_id'];
                o['ast_name'] = x['ast_name'];
                o['inst_id'] = x["inst_id"];
                download.push(o);
            });
            populateSessionTypesSelect(download);
            $scope.$apply();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
        });
    }

    function populateSessionTypesSelect(data) {
        // console.log('download ', data);
        var sessionTitleMap = [];
        for(var i=0; i < data.length; ++i){
            var o = {};
            o.value = data[i].ast_id;
            o.name = data[i].ast_name;
            sessionTitleMap.push(o);
        }
        // console.log('sessionTitleMap ', sessionTitleMap);
        for(var i=0; i < $scope.form.length; ++i){
            if ($scope.form[i].key == 'session_type'){
                $scope.form[i].titleMap = sessionTitleMap;
            }
        }
    }

    getSessionTypes();
}]);

angular.module('dmaoApp').controller("advocacySessionTypeCtrl", ['$scope', '$http', '$location', '$route', '$routeParams', 'api', 'config', 'ui', function($scope, $http, $location, $route, $routeParams, api, config, ui){

    $scope.model = {};
    $scope.things = [];

    $scope.schema = {
        type: "object",
        required: [
            'ast_name'
        ],
        properties: {
            ast_name: {
                type: 'string',
                minLength: 2,
                title: 'Name'
            }
        }
    };

    $scope.form = [
        'ast_name',
        {
            type: 'submit',
            title: 'Save'
        }
    ];

    $scope.index = function(){
        // console.log('get called');
        // load data
        var spinner = ui.spinner('loader');
        var promise = api.uri.advocacySessionTypes();
        // console.log(promise);
        promise.success(function(data){
            // console.log('promise SUCCESS');
            var download = [];
            angular.forEach(data, function(x) {
                // console.log(x);
                var o = {};
                o['ast_id'] = x['ast_id'];
                o['ast_name'] = x['ast_name'];
                o['inst_id'] = x["inst_id"];
                download.push(o);
            });
            $scope.things = download;
            $scope.$apply();
            spinner.stop();
            // console.log('tings ', $scope.things);
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.new = function(){
        $location.path('/advocacySessionTypes/new');
    };

    function create(){
        post().then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $location.path('/advocacySessionTypes');
                $scope.$apply();
            }
        });
    }

    $scope.onSubmitNew = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            create();
            // reset();
        }
    };

    function post(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.ast_name = thing.ast_name;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        return api.uri.post.advocacySessionTypes(params);
    }

    $scope.edit = function(){
        var spinner = ui.spinner('loader');
        // var params = { 'ast_id': $routeParams.id };
        var promise = api.uri.advocacySessionTypes();
        promise.success(function(data){
            // console.log(data);

            angular.forEach(data, function(x) {// console.log(x);
                // console.log(x);
                if (x.ast_id == $routeParams.id) {
                    // console.log('yay');
                    $scope.model = x;
                    $scope.$apply();
                    spinner.stop();
                }
            });
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    function put(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o['pkey:ast_id'] = thing.ast_id;
        o.inst_id = config.institutionId;
        o.ast_name = thing.ast_name;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        api.uri.put.advocacySessionTypes(params).then(function(data){
            $location.path('/advocacySessionTypes');
            $scope.$apply();
        });
    }

    $scope.onSubmitEdit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            put();
        }
    };

    $scope.destroy = function(thing){
        var params = {};
        params.ast_id = thing.ast_id;
        api.uri.delete.advocacySessionTypes(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $route.reload();
            }
        });
    };

    // function reset(){
    //     $scope.model = {};
    //     $scope.form.$pristine = true;
    //     $scope.$broadcast('schemaFormRedraw');
    // }
}]);

angular.module('dmaoApp').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/landing', { templateUrl: 'app/public/landing.html' })
		//.when('/landing', { templateUrl: 'app/tables/storage-table.html' })
		//.when('/landing', { templateUrl: 'app/tables/dmp-table.html' })
		//.when('/landing', { templateUrl: 'app/statistics/statistic-compilation.html' })
		.when('/', { 
			templateUrl: 'app/public/landing.html',
			label: 'Home'
		})
		.when('/all', { 
			templateUrl: 'app/public/landing.html',
		})
		.when('/stats', { 	
			templateUrl: 'app/statistics/statistic-compilation.html',
		})
		.when('/login', { templateUrl: 'app/auth/login.html' })
		.when('/datasets', { 
			templateUrl: 'app/tables/datasets-table.html',
			label: 'All datasets'
		})
		.when('/datasetsRCUK', { 
			templateUrl: 'app/tables/datasets-rcuk-table.html',
			label: 'RCUK datasets'
		})
		.when('/dmp', { 
			templateUrl: 'app/tables/dmp-table.html',
			label: 'Data management plans produced'
		})
		.when('/nodmp', { 
			templateUrl: 'app/tables/no-dmp-table.html',
			label: 'Projects without data management plans'
		})
		.when('/dmps', { 
			templateUrl: 'app/tables/dmp-status-table.html',
			label: 'All data management plans'
			 })
		.when('/storage', { 
			templateUrl: 'app/tables/storage-table.html',
			label: 'Storage'
		})
		.when('/compliance', { 
			templateUrl: 'app/tables/rcuk-access-compliance-table.html',
			label: 'RCUK access compliance'
		})
		.when('/publications', {
			templateUrl: 'app/tables/publications-table.html',
			label: 'Publications'
		})
		.when('/data', { 
			templateUrl: 'app/charts/data-access-chart.html',
			label: 'Data downloads'
		})
		.when('/metadata', { 
			templateUrl: 'app/charts/metadata-access-chart.html',
			label: 'Metadata accesses'
		})
		.when('/advocacySessionTypes', {
			templateUrl: 'app/advocacy/advocacy-session-type-index.html',
			label: 'Advocacy session types'
		})
		.when('/advocacySessionTypes/new', {
			templateUrl: 'app/advocacy/advocacy-session-type-new.html',
			label: 'New'
		})
		.when('/advocacySessionTypes/:id/edit', {
			templateUrl: 'app/advocacy/advocacy-session-type-edit.html',
			label: 'Edit'
		})
		.when('/advocacy', {
			templateUrl: 'app/advocacy/advocacy-event-index.html',
			label: 'Advocacy events'
		})
		.when('/advocacy/new', {
			templateUrl: 'app/advocacy/advocacy-event-new.html',
			label: 'New'
		})
		.when('/advocacy/:id', {
			templateUrl: 'app/advocacy/advocacy-event-show.html',
			// templateUrl: 'app/advocacy/stub.html',
			label: 'Event'
		})
		.when('/advocacy/:id/edit', {
			templateUrl: 'app/advocacy/advocacy-event-edit.html',
			label: 'Edit'
		})
		// .when('/index.html', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
		.otherwise({ templateUrl: 'app/messages/error.html' });
	}])

.run(['$rootScope', '$location', '$cookies', function ($rootScope, $location, $cookies) {
	// console.log('routes startup');

	if ($rootScope.loggedInUser) {
		// console.log('trying to change route ');
		$location.path($cookies.get('newRoute'));
	}

	$rootScope.$on('$routeChangeStart', function (event, newUrl, oldUrl) {
       
        if ($rootScope.loggedInUser) {
        	// console.log('logged in');
        	if (newUrl.$$route.originalPath === '/'){
        		// console.log('attempting public page');
        		$location.path('/stats');    		
        	}
        	// $cookies.put('oldRoute', oldUrl.$$route.originalPath);
        	$cookies.put('newRoute', newUrl.$$route.originalPath);
        } 
        // keep on public page
        else{
        	if (newUrl.$$route.originalPath !== '/'){
        		$location.path('/');
        	}
        }
      }
    );
  }]);
angular.module('dmaoApp').controller("loginCtrl", ['$scope', '$location', '$rootScope', '$cookies', 'api', 'config', function($scope, $location, $rootScope, $cookies, api, config) {
    // optionally prefill for testing
    setDemoLoginCredentials();

    var username = $cookies.get('username');
    if (username)
            $rootScope.loggedInUser = username;
    else
        $rootScope.loggedInUser = '';

    var apiKey = $cookies.get('apiKey');
    if (apiKey)
        api.apiKey = apiKey;
    else
        api.apiKey = '';

    config.institutionId = $cookies.get('institutionId');

    api.uri.o.institutions().then(function(response){
        //get all the institutions
        //console.log('response ', response);
        $scope.institutions = response;
        //console.log('Institutions ', $scope.institutions);

        //get name of institution for user
        getInstitutionName();
    });

    function getInstitutionName(){
        //get name of institution for user
        angular.forEach($scope.institutions, function(data){
            if (data.inst_id == $scope.institution) {
                // console.log('name ', data.name);
                $scope.institutionName = data.name;
            }
        });
    }

    // $location.path($cookies.get('lastRoute'));

    //api.clearKey();

    $scope.login = function() {

        //console.log($scope.username + ' attempting to log in ' + ' with password ' +
        //$scope.password);
        //console.log('api.authenticated apiKey ', api.apiKey);
        if (!$cookies.get('username')){
        //if (!api.authenticated()){
            //console.log('!api.authenticated apiKey ', api.apiKey);
            api.authenticate($scope.institution, $scope.username, $scope.password).then(function(response){
                //console.log('api.authenticated apiKey ', api.apiKey);
                //expects a populated array
                if (response.length){
                    config.institutionId = $scope.institution;

                    $cookies.put('username', $scope.username);
                    $cookies.put('institutionId', $scope.institution);
                    getInstitutionName();
                    $cookies.put('institutionName', $scope.institutionName);

                    api.apiKey = response[0].api_key;
                    $cookies.put('apiKey', response[0].api_key);

                    $scope.$apply(function() {
                        $rootScope.loggedInUser = $scope.username;
                        $location.path("/stats");
                    });
                }
                else{
                    //temporary!
                    alert('Aw snap! Something went wrong.');
                }
            });
        }
    };

    $scope.logout = function() {
        api.clearKey();
        config.institutionId = '';
        config.institutionName = '';
        $rootScope.loggedInUser = '';

        var cookies = $cookies.getAll();
        angular.forEach(cookies, function (v, k) {
               //console.log('cookie ', k, '', v);
                $cookies.remove(k);
           });
        
        setDemoLoginCredentials();
        // $scope.institution = '';
        // $scope.username = '';
        // $scope.password = '';

        $location.path("/");
    };

    function setDemoLoginCredentials(){
        $scope.institution = 'luve_u';
        $scope.username = 'dladmin';
        $scope.password = 'dladmin';
    }

}]);

function reverseChronoChartData(monthData) {
    // put into labelled format for chart, with array in reverse chronological order
    // assumes chronological order as input
    // outpuut format:
    // var arr = [
    //     ['Month Label 1', value],
    //     ['Month Label 2', value],
    // ];
    var chartData = [];
    var j = monthData.length;
    for(var i = 0; i < monthData.length; ++i) {
        --j;
        chartData[i] = [monthData[j].month, monthData[j].value];
    }  

    // console.table('chartData');
    // console.table(chartData);
    return chartData;
}


angular.module('dmaoApp').controller('dataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', function($scope, $rootScope, $http, api, ui, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        $scope.dataAvailable = false;
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {  //date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'data_download');
            if (data.length) {
                $scope.dataAvailable = true;
                //console.log('data length ', data.length);
            }
            $scope.dataFetched = true;
            $scope.$apply();
            DataAccessLineChart(data, {width: 700, height: 300});
            spinner.stop();
            // console.log('DataAccessLineChart(');        
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
var DataAccessLineChart = function(data, options){
    var drawChart = true;
    // var dataAccessResponseDataOld = App.dataAccessResponseData;
    
    // console.log('Data OLD', dataAccessResponseDataOld);

    // if (!angular.equals(App.dataAccessResponseData, data)){
    //   // console.log('Data CHANGED, should redraw graph');
    //   App.dataAccessResponseData = data;
    //   drawChart = true;
    // }
    // else
    // {
    //   // console.log('Checksum SAME, should NOT redraw graph');
    // }

    if (drawChart){
        var margin = {top: 20, right: 20, bottom: 30, left: 100},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.access_date); })
            .y(function(d) { return y(d.counter); });

            $( "#dataAccessChart" ).empty();

        var svg = d3.select("#dataAccessChart").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          
          data.forEach(function(d) {
            d.access_date = parseDate(d.access_date);
            d.counter = +d.count;
          });
          // //console.table(data);

          x.domain(d3.extent(data, function(d) { return d.access_date; }));
          y.domain(d3.extent(data, function(d) { return d.counter; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Downloads");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
    }
};

angular.module('dmaoApp').controller('metadataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', function($scope, $rootScope, $http, api, ui, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        $scope.dataAvailable = false;
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {  //date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };        
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'metadata');
            if (data.length) {
                $scope.dataAvailable = true;
                //console.log('data length ', data.length);
            }
            $scope.dataFetched = true;
            $scope.$apply();
            MetadataAccessLineChart(data, {width:700, height:300});
            spinner.stop();
            // console.log('MetadataAccessLineChart(');        
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
var MetadataAccessLineChart = function(data, options){

    var drawChart = true;
    // var metadataAccessResponseDataOld = App.metadataAccessResponseData;
    
    // // console.log('Data OLD', dataAccessResponseDataOld);

    // if (!angular.equals(metadataAccessResponseDataOld, data)){
    //   // console.log('Data CHANGED, should redraw graph');
    //   App.metadataAccessResponseData = data;
    //   redrawChart = true;
    // }
    // else
    // {
    //   // console.log('Checksum SAME, should NOT redraw graph');
    // }

    if (drawChart){
        var margin = {top: 20, right: 20, bottom: 30, left: 100},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.access_date); })
            .y(function(d) { return y(d.counter); });

            $( "#metadataAccessChart" ).empty();

        var svg = d3.select("#metadataAccessChart").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          
          data.forEach(function(d) {
            d.access_date = parseDate(d.access_date);
            d.counter = +d.count;
          });
          // //console.table(data);

          x.domain(d3.extent(data, function(d) { return d.access_date; }));
          y.domain(d3.extent(data, function(d) { return d.counter; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")              
              .style("text-anchor", "end")
              .text("Accesses");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
    }
};

var DataAccessChart = {

    init: function(params) {
        $.ajax({
            url: ApiService.uri.datasetAccess(params),
            success: function(data){
                // console.log('data');
                // console.log(data);
                var filteredData = ApiService.filter.datasetAccess(data, 'data_download');
                var numMonths = 12;
                var monthData = ApiService.filter.dataLastNMonths(filteredData, numMonths);
                var chartData = reverseChronoChartData(monthData);


                if ($('#data_access').size() != 0) {

                    $('#data_access_loading').hide();
                    $('#data_access_content').show();

                    var plot_statistics = $.plot($("#data_access"),
                        [{
                            data: chartData,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#BAD9F5']
                        }, {
                            data: chartData,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#9ACAE6",
                                lineWidth: 2
                            },
                            color: '#9ACAE6',
                            shadowSize: 1
                        }, {
                            data: chartData,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#9ACAE6',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: "#eee",
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderColor: "#eee",
                                borderWidth: 1
                            }
                        });

                    var previousPoint = null;
                    $("#data_access").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' downloads');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


            }
        });
    }
}
var MetadataAccessChart = {

    init: function(params) {
        $.ajax({
            url: ApiService.uri.datasetAccess(params),
            success: function(data){
                // console.log('data');
                // console.log(data);
                var filteredData = ApiService.filter.datasetAccess(data, 'metadata');
                var numMonths = 12;
                var monthData = ApiService.filter.dataLastNMonths(filteredData, numMonths);
                var chartData = reverseChronoChartData(monthData);

                if ($('#metadata_access').size() != 0) {

                    $('#metadata_access_loading').hide();
                    $('#metadata_access_content').show();

                    var plot_statistics = $.plot($("#metadata_access"),
                        [{
                            data: chartData,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#f89f9f']
                        }, {
                            data: chartData,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#f89f9f",
                                lineWidth: 2
                            },
                            color: '#f89f9f',
                            shadowSize: 1
                        }, {
                            data: chartData,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#f89f9f',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: "#eee",
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderColor: "#eee",
                                borderWidth: 1
                            }
                        });

                    var previousPoint = null;
                    $("#metadata_access").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' downloads');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


            }
        });
    }
}
angular.module('dmaoApp').controller('filterCtrl', ['$scope', '$rootScope', '$interval', '$timeout', '$cookies', 'breadcrumbs', 'api', 'config', function($scope, $rootScope, $interval, $timeout, $cookies, breadcrumbs, api, config) {
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

var DMAOFilters = (function(){    
    var config = {};

    var init = function(gConfig){
        config = gConfig;
    };

    var DateRangePicker = function(){
        //console.log('DateRangePicker 1');
        $('#reportrange span').html(moment(config.startDate, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDate, "YYYYMMDD").format('MMMM D, YYYY'));

        //console.log('DateRangePicker 2');
        $('#reportrange').daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
            endDate: moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
            minDate: '01/01/2000',
            maxDate: '31/12/9999',
            dateLimit: { days: 100000 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        }, function(start, end, label) {
            // console.log('There has been a change by selecting a value');

            // console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            // console.log('I have updated the html with dates in the right format');

            // console.log('option has been selected');
            var startDate = start.format('YYYYMMDD');
            var endDate = end.format('YYYYMMDD');

            // console.log('I have grabbed the dates into variables');

            // console.log(startDate, endDate);
            //console.log('There has been a change by selecting a value');

            config.startDate = startDate;
            config.endDate = endDate;



            // console.log('I have assigned the dates to config');

            tellAngular(startDate, endDate);

            // console.log('What on earth is happening now?');



            // var delay = 1;
            // setTimeout(function(){
            //      console.log('I am in a timeout which has a delay of ' + delay);
            //     },
            //     delay);

            // console.log('I am listed after the timeout');
        });
        //console.log('DateRangePicker 3');

       //$('.applyBtn').click(function() {
           //console.log('datepicker applyBtn clicked');
            // console.log( $('input[name="daterangepicker_start"]').val() );
            // console.log( 'ado format ' + $('input[name="daterangepicker_start"]').format('YYYYMMDD').val() );
            //var startDateUI = $('input[name="daterangepicker_start"]').val();
            //var startDate = moment(startDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            //var endDateUI = $('input[name="daterangepicker_end"]').val();
            //var endDate = moment(endDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            // console.log('Button click formatted startDate ' + startDate );
            // console.log(startDate, endDate);
           //console.log('There has been a change by clicking the button');

           // config.startDate = startDate;
           // config.endDate = endDate;
           //console.log('before angular update with date range');
           // var scope = angular.element($("#filterController")).scope();
           // scope.$apply(function(){
           //     scope.startDate = startDate;
           //     scope.endDate = endDate;
           //     console.log('scope.$apply ', scope.startDate, scope.endDate);
           // });
           //console.log('after angular update with date range');
        //});
        //console.log('DateRangePicker 4');
    };

    //var setFaculty = function(faculty){
    //    config.faculty = faculty;
    //    // tell Angular
    //    var scope = angular.element($("#filterController")).scope();
    //    scope.$apply(function(){
    //        scope.faculty = faculty;
    //    });
    //};

    var initUserSelections = function(){
        // update globals
        config.faculty = config.facultyDefault;
        config.startDate = config.startDateDefault;
        config.endDate = config.endDateDefault;

        //console.log('DateRangePicker 5');
        // tell jQuery daterangepicker
        $('#reportrange').data('daterangepicker').setStartDate(moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange').data('daterangepicker').setEndDate(moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange span').html(moment(config.startDateDefault, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDateDefault, "YYYYMMDD").format('MMMM D, YYYY'));
        //console.log('DateRangePicker 6');

        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function () {
            scope.faculty = config.faculty;
            scope.startDate = config.startDateDefault;
            scope.endDate = config.endDateDefault;
        });
    };

    function tellAngular(startDate, endDate){
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function() {
            scope.startDate = startDate;
            scope.endDate = endDate;
        });
    }

    return {
        init: init,
        initUserSelections: initUserSelections,
        DateRangePicker: DateRangePicker,
        //setFaculty: setFaculty
    };
})();
var App = {
    institutionId: '',
    institutionName: '',
    institutionDataCiteSymbol: '',
    startDateDefault: '20000101',
    endDateDefault: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),       
    startDate: '20000101',
    endDate: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),
    faculty: '',
    facultyDefault: '',
    facultyMap: {},
    departmentMap: {},
    updateDelay: 30000,
    loadingText: ' Loading... '
};

var ApiService = {
    version:    'v0.3',
    apiKey:     '',
    authenticated: function(){
        if (this.apiKey){
            return true;
        }
        return false;
    },
    prefix: function() {
        // Prototype
        // http://lib-ldiv.lancs.ac.uk:8080/dmaonline/v0.2/use_case_1/lancaster?
        // date=<project_awarded|project_start|project_end>&sd=YYYYMMDD&ed=YYYYMMDD
        var uri = URI({
            protocol:   'http',
            hostname:   'lib-dmao.lancs.ac.uk',
            port:       '8070',
            path:       'dmaonline',             
        });
        uri += '/' + this.version;
        return uri.toString();
    },
    clearKey: function(){
        this.apiKey = '';
    },
    authenticate: function(institutionID, username, password){
        //console.log('this.apiKey ', this.apiKey);

        var uri = URI(ApiService.prefix() + '/o/' + institutionID + '/o_get_api_key');
        //console.log('uri ', uri);

        var shaObj = new jsSHA("SHA-224", "TEXT");
        shaObj.update(password);
        var hash = shaObj.getHash("HEX");
        //console.log('hash ', hash);

            uri = this.uri.addParams(uri, {
                    user: username,
                    passwd: hash
                });
        //console.log('uri ', uri);
        //console.log($.getJSON(uri));
        return $.getJSON(uri);
    },
    uri: {
        addParams: function(uri, params){
            for (key in params) {
                if (params[key] || params[key] === false) {
                    uri.addSearch(key, params[key]);
                }
            }                    
            return uri;
        },
        datasets: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/datasets');
            if (params) {
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        dmps: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/project_dmps');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        dmpStatus: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/dmp_status');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        }, 
        storage: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/storage');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        project: function(params){
            var uri = URI(ApiService.prefix() + '/storage' + '/'
                        + params.project_id + '/' + App.institutionId);
            if (params){
                //uri = this.addParams(uri, params);
                //var json = JSON.stringify (params)
            }
            return uri;
        },
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/rcuk_as');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        datasetAccess: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/dataset_accesses');
            //var uri = URI(ApiService.prefix() + '/dataset_accesses' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        datasetAccessByDateRange: function(params){
            var uri = this.datasetAccess(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return $.getJSON(uri);
        },
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/rcuk_as');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        divisions: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/faculties_departments');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        publications: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/publications_editor');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        persons: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
                ApiService.apiKey + '/persons');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        advocacyEvents: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
                ApiService.apiKey + '/advocacy_events');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        advocacySessionTypes: function(params){
            var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                ApiService.apiKey + '/advocacy_session_types');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        put: {
            dmps: function (params) {
                //alert('ApiService.uri.put.dmps called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/project_dmps');

                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            storage: function (params) {
                //alert('ApiService.uri.put.storage called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/storage');

                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            publications: function (params) {
                //alert('ApiService.uri.put.storage called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/publications_editor');
                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            advocacySessionTypes: function (params) {
                // console.log(JSON.stringify(params.data));
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy_session_types');
                return $.ajax({
                        url: uri,
                        type: 'PUT',
                        data: JSON.stringify(params.data),
                        contentType: "application/json; charset=UTF-8"
                    });
            },
            advocacyEvents: function (params) {
                // console.log(JSON.stringify(params.data));
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy');
                return $.ajax({
                        url: uri,
                        type: 'PUT',
                        data: JSON.stringify(params.data),
                        contentType: "application/json; charset=UTF-8",
                    });
            }
        },
        post: {
            advocacySessionTypes: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy_session_types');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
            advocacyEvents: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
            advocacyPersons: function(params){
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/map_advocacy_person');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
        },
        delete: {
            advocacySessionTypes: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                    ApiService.apiKey + '/advocacy_session_types' + '/' + 'ast_id' +
                    '/' + params.ast_id);

                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                });
            },
            advocacyEvents: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                    ApiService.apiKey + '/advocacy' + '/' + 'event_id' +
                    '/' + params.event_id);
                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                });
            },
            advocacyPerson: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey +
                    '/map_advocacy_person' + '/' + 'event_id' + '/' + params.event_id + '/' + 'person_id' + '/' + params.person_id);
                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                    });
            }
        },

        //modifiable: {
        //    dmps: function() {
        //        var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/project_dmps_modifiable');
        //        return $.getJSON(uri);
        //    },
        //},
        o: {
            institutions: function () {
                var uri = URI(ApiService.prefix() + '/o' + '/o_inst_list');
                return $.getJSON(uri);
            }
        },
        public: function(resource) {
            var uri = URI(ApiService.prefix() + '/o' + '/' + resource);
            return $.getJSON(uri);
        },
    },
    datacite: {
        minted: function (queryString) {
            var uri = URI(queryString);
            return $.getJSON(uri);
        }
    },
    irus: {
        base_url: 'http://irus.mimas.ac.uk/api/sushilite/v1_7/GetReport',
        report: function(params) {
            var uri = URI(ApiService.irus.base_url);
            if (params){
                uri = ApiService.uri.addParams(uri, params);
            }
            return $.getJSON(uri);
        }
    },
    filter: {
        datasetAccess: function(data, accessType){
            var filteredData = [];
            for(var i = 0; i < data.length; ++i) {
                if (data[i].access_type === accessType) {
                    filteredData.push(data[i]);
                }
            }
            // console.log('filteredData');
            // console.table(filteredData);
            return filteredData;
        },
        dataLastNMonths: function(data, nMonths){
            // init
            var monthData = [];
            for(var i = 0; i < nMonths; ++i) {
                var startDate = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD');
                var endDate = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD');
                monthData.push({startDate: startDate, 
                                endDate: endDate,
                                month: moment(startDate).format('MMM'),
                                value: 0
                            });
            }

            for(var i = 0; i < data.length; ++i) {
                for(var j = 0; j < nMonths; ++j) {
                    if (data[i].access_date >= monthData[j].startDate && data[i].access_date <= monthData[j].endDate){
                        monthData[j].value += data[i].counter;
                    }
                }
            }
            // console.log('monthData');
            // console.table(monthData);
            return monthData;
        },    
        dataAggregateDateCounts: function(data){
            // console.log('data in dataAggregateDateCounts');
            // console.table(data);
            // init
            var date_data = {};
            for(var i = 0; i < data.length; ++i) {
                var access_date_hash = data[i].access_date.replace(/-/g, "");
                if (date_data[access_date_hash]){
                    date_data[access_date_hash].counter += data[i].counter;
                } else{
                    var o = {   access_date: data[i].access_date,
                                counter: data[i].counter
                            };
                    date_data[access_date_hash] = o;
                }
            }
            // console.log('date_data');
            // console.log(date_data);

            var date_data_arr = [];
            $.each(date_data, function(key, value){
                date_data_arr.push(date_data[key]);
            });
            
            return date_data_arr;
        },         
    },   
    template: {
        dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    },
};
var UiService = {
  spinner: function(target){
      var opts = {
          lines: 13 // The number of lines to draw
          , length: 28 // The length of each line
          , width: 14 // The line thickness
          , radius: 42 // The radius of the inner circle
          , scale: 1 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , color: '#000' // #rgb or #rrggbb or array of colors
          , opacity: 0.25 // Opacity of the lines
          , rotate: 0 // The rotation offset
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 1 // Rounds per second
          , trail: 60 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , zIndex: 2e9 // The z-index (defaults to 2000000000)
          , className: 'spinner' // The CSS class to assign to the spinner
          , top: '50%' // Top position relative to parent
          , left: '50%' // Left position relative to parent
          , shadow: false // Whether to render a shadow
          , hwaccel: false // Whether to use hardware acceleration
          , position: 'absolute' // Element positioning
      };
      var target = document.getElementById(target);
      return new Spinner(opts).spin(target);
  },
  spinnerSimple: function(target){
      var opts = {
          lines: 13 // The number of lines to draw
          , length: 7 // The length of each line
          , width: 3 // The line thickness
          , radius: 10 // The radius of the inner circle
          , scale: 1 // Scales overall size of the spinner
          , corners: 1 // Corner roundness (0..1)
          , color: '#000' // #rgb or #rrggbb or array of colors
          , opacity: 0.25 // Opacity of the lines
          , rotate: 0 // The rotation offset
          , direction: 1 // 1: clockwise, -1: counterclockwise
          , speed: 1 // Rounds per second
          , trail: 60 // Afterglow percentage
          , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
          , zIndex: 2e9 // The z-index (defaults to 2000000000)
          , className: 'spinner' // The CSS class to assign to the spinner
          , top: '50%' // Top position relative to parent
          , left: '50%' // Left position relative to parent
          , shadow: false // Whether to render a shadow
          , hwaccel: false // Whether to use hardware acceleration
          , position: 'absolute' // Element positioning
      };
      var target = document.getElementById(target);
      return new Spinner(opts).spin(target);
      //
      //var spinner = new Spinner().spin()
      //target.appendChild(spinner.el)
  }
};

angular.module('dmaoApp').directive('aggregate', function() {
	return {
		restrict: 		'E',
		templateUrl: 	'app/statistics/aggregate-directive.html',
		replace: 		'true',
		scope: {
        	value: 			"@",
        	description: 	"@",
        	icon: 			"@",
        	colour:         "@",
        	link:      		"@",
        	units:      	"@",
            currency:       "@", 
        }
    };
});
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
angular.module('dmaoApp').controller('dataCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.dataset_accesses = {};
        $scope.dataset_accesses.data = config.loadingText;
        $scope.dataset_accesses.metadata = config.loadingText;
        var params = {
                        sd:         message.startDate,
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        summary_totals:    true
                    };
        api.uri.datasetAccess(params).then(function(response) {
            $scope.$apply(function(){
            //    console.log('api.uri.datasetAccess ', response);

            $scope.dataset_accesses.data = 0;
            $scope.dataset_accesses.metadata = 0;
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
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });    
}]);
angular.module('dmaoApp').controller('datasetsRCUKCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;

    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.datasetsRCUKCtrl){        
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            filter:     'rcuk',
                            count:      true
                        };
            //console.log('before datasetsRCUKCtrl request');
            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });        
}]);
angular.module('dmaoApp').controller('datasetsCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', function($scope, $rootScope, $http, api, ui, config) {

    //console.log('hard coding $rootScope.loggedInUser credentials in datasetsCtrl to bypass auth');
    //$rootScope.loggedInUser = 'luve_u';

    // init
    $scope.value = 0;
    
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.datasetsCtrl){
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            count:      true 
                        };
            //console.log('before datasetsCtrl request');
            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){
                    var oldValue = $scope.value;
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                    //console.log('after datasetsCtrl update ', 'old ', oldValue, 'new ', $scope.value);
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });       
}]);  

angular.module('dmaoApp').controller('dmpsCreatedCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });
    
    function update(message){
        $scope.value = config.loadingText;
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        has_dmp:    true,
                        count:      true
                    };
        
        api.uri.dmps(params).then(function(response) {
            $scope.$apply(function(){
                var value = response[0].num_project_dmps;
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
angular.module('dmaoApp').controller('dmpStatusCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    // $scope.fraction = {numerator: 0, denominator: 0}
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.dmpStatusCtrl){        
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            count:      true
                        };
            
            api.uri.dmpStatus(params).then(function(response) {
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
            $scope.$apply(function(){
                var value = response[0].num_dmp_status;
                if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });  
}]);
angular.module('dmaoApp').controller('doiMintingCtrl', ['$scope', '$rootScope', 'api', 'config', function($scope, $rootScope, api, config) {
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




angular.module('dmaoApp').controller('irusRequestCtrl', ['$scope', '$rootScope', 'api', 'config', function($scope, $rootScope, api, config) {
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


}]);




angular.module('dmaoApp').controller('noDmpProjectsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });
    
    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.noDmpProjectsCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            has_dmp:    false,
                            count:      true
                        };
            
            api.uri.dmps(params).then(function(response) {
                $scope.$apply(function(){
                    var value = response[0].num_project_dmps;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    }); 
}]);
angular.module('dmaoApp').controller('publicationsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });
    
    function update(message){
        $scope.value = config.loadingText;
        var params = {  date:       'publication_date',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        count:      true
                    };
        
        api.uri.publications(params).then(function(response) {
            $scope.$apply(function(){
                var value = response[0].num_publications;
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
angular.module('dmaoApp').controller('rcukAccessComplianceCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.rcukAccessComplianceCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty: message.faculty
                        };
            api.uri.rcukAccessCompliance(params).then(function(response) {
                $scope.$apply(function(){
                    var count = 0;
                    for(var i=0;i<response.length;++i) {
                        if (response[i].rcuk_funder_compliant === 'y') ++count;
                    }
                    var value = 0;
                    if (count && count !== $scope.value) {
                        value = (count / response.length) * 100;
                    }
                    // only update if dirty
                    if (value !== $scope.value)
                        $scope.value = Math.round(value);
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);
angular.module('dmaoApp').directive('statistic', function() {
	return {
		restrict: 		'E',
		templateUrl: 	'app/statistics/statistic-directive.html',
		replace: 		'true',
		scope: {
        	value: 			"@",
        	description: 	"@",
        	icon: 			"@",
        	colour:         "@",
        	link:      		"@",
        	units:      	"@",
            currency:       "@", 
        }
    };
});
angular.module('dmaoApp').controller('storageCostCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
        // $scope.currency = '';

    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.storageCostCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                var total = 0;
                for(var i=0;i<response.length;++i) {            
                    total += response[i].expected_storage_cost;
                }
                var value = Math.round(total);
                $scope.$apply(function(){
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);
angular.module('dmaoApp').controller('storageUnitCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDate,
                endDate:        config.endDate,
                faculty:        config.faculty,
            });

    function update(message){
        $scope.value = config.loadingText;
        // if(config.inView.storageUnitCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                var total = 0;
                for(var i=0;i<response.length;++i) {            
                    total += response[i].expected_storage;
                }
                var value = Math.round(total * 0.001024);
                $scope.$apply(function(){
                    // only update if dirty
                    if (value !== $scope.value)
                        $scope.value = numeral(value).format('0,0');
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);

angular.module('dmaoApp').controller('datasetsRCUKTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        filter:             'rcuk'
                    };                
        api.uri.datasets(params).then(function(data){
            // console.log('Datasets ' + uri);
            DatasetsRCUKTable.init(data);    
            // console.log(Datasets.init(');        
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
var DatasetsRCUKTable = function() {
    var rcukDatasetsTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#rcukDatasetsTable" ).dataTable();
        oTable.fnDestroy();            

        rcukDatasetsTable = $('#rcukDatasetsTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'dataset_name' },
                { data: 'funder_name' },
                { data: 'dataset_pid' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'project_name' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#rcukDatasetsTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = rcukDatasetsTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Dataset link:</td>'+
                '<td>'+d.dataset_link+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset name:</td>'+
                '<td>'+d.dataset_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset notes:</td>'+
                '<td>'+d.dataset_notes+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Storage location:</td>'+
                '<td>'+d.storage_location+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+  
        '</table>';
    }

    return {
        init: init,
    };
}();
angular.module('dmaoApp').controller('datasetsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.datasets(params).then(function(data){
            DatasetsTable.init(data);    
            // console.log(Datasets.init(');        
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
var DatasetsTable = function() {
    var datasetsTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#datasetsTable" ).dataTable();
        oTable.fnDestroy();

        datasetsTable = $('#datasetsTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'dataset_name' },
                { data: 'funder_name' },
                { data: 'dataset_pid' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'project_name' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });    
    }

    function setupRowExpanderListener() {
        $('#datasetsTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = datasetsTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }  

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Dataset link:</td>'+
                '<td>'+d.dataset_link+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset name:</td>'+
                '<td>'+d.dataset_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset notes:</td>'+
                '<td>'+d.dataset_notes+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Storage location:</td>'+
                '<td>'+d.storage_location+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+  
        '</table>';
    }      

    return {
        init: init,
    };
}();
angular.module('dmaoApp').controller('dmpStatusTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            true,
                    };                
        api.uri.dmpStatus(params).then(function(data){
            //console.log('Datasets ' + uri);
            DmpStatusTable.init(data);    
            // console.log(Datasets.init(');        
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
var DmpStatusTable = function() {
    var dmpStatusTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#dmpStatusTable" ).dataTable();
        oTable.fnDestroy();

        dmpStatusTable = $('#dmpStatusTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },                    
                { data: 'funder_id' },
                { data: 'dmp_state' },
                { data: 'dmp_status' },
                { data: 'project_start' },
                { data: 'project_end' },

            ]
        });
    }

    function setupRowExpanderListener() {
        $('#dmpStatusTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = dmpStatusTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+    
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Data management plan source system id:</td>'+
                '<td>'+d.dmp_source_system_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Data management plan state:</td>'+
                '<td>'+d.dmp_state+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Data management plan status:</td>'+
                '<td>'+d.dmp_status+'</td>'+
            '</tr>'+    
        '</table>';
    }

    return {
        init: init,
    };
}();

angular.module('dmaoApp').controller('dmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            true,
                    };                
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            DmpTable.init(data);    
            // console.log(Datasets.init(');        
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
var DmpTable = function() {
    var dmpTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#dmpTable" ).dataTable();
        oTable.fnDestroy();

        dmpTable = $('#dmpTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'dmp_id' },
                { data: 'has_dmp_been_reviewed' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#dmpTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = dmpTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Has data management plan:</td>'+
                '<td>'+d.has_dmp+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
angular.module('dmaoApp').controller('noDmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            false,
                    };                
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            NoDmpTable.init(data);    
            // console.log(Datasets.init(');        
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
var NoDmpTable = function() {
    var noDmpTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#noDmpTable" ).dataTable();
        oTable.fnDestroy();

        noDmpTable = $('#noDmpTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#noDmpTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = noDmpTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Has data management plan:</td>'+
                '<td>'+d.has_dmp+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
angular.module('dmaoApp').controller('rcukAccessComplianceTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.rcukAccessCompliance(params).then(function(data){
            //console.log('Datasets ' + uri);
            RcukAccessComplianceTable.init(data);  
            // console.log(Datasets.init('); 
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
var RcukAccessComplianceTable = function() {
    var rcukAccessComplianceTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#rcukAccessComplianceTable" ).dataTable();
        oTable.fnDestroy();

        rcukAccessComplianceTable = $('#rcukAccessComplianceTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                },                   
                { data: 'publication_pid' },
                { data: 'publication_date' },
                { data: 'data_access_statement' },
                { data: 'funder_name' },
                { data: 'project_name' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#rcukAccessComplianceTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = rcukAccessComplianceTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+
           '<tr>'+
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+        
            '<tr>'+
                '<td>Publication id:</td>'+
                '<td>'+d.publication_id+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Cris id:</td>'+
                '<td>'+d.cris_id+'</td>'+
            '</tr>'+        
                '<td>Repo id:</td>'+
                '<td>'+d.repo_id+'</td>'+
            '</tr>'+    
            '</tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead institution id:</td>'+
                '<td>'+d.lead_inst_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Publication date:</td>'+
                '<td>'+d.publication_date+'</td>'+
            '</tr>'+ 
            '<tr>'+
                '<td>Data access statement:</td>'+
                '<td>'+d.data_access_statement+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
angular.module('dmaoApp').controller('storageTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    var params = {
                startDate:          config.startDate,
                endDate:            config.endDate,
                faculty:            config.faculty,
            };

    update(params);

    function update(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };
        api.uri.storage(params).then(function(data){
            //console.log('Datasets ' + uri);
            StorageTable.init(data);
            // console.log(Datasets.init(');
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
var StorageTable = function() {
    var storageTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);
        
        var oTable = $( "#storageTable" ).dataTable();
        oTable.fnDestroy();

        storageTable = $('#storageTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'expected_storage' },
                { data: 'expected_storage_cost' },
                { data: 'dataset_size' },                    
                { data: 'project_start' },
                { data: 'project_end' },
                { data: 'dataset_pid' },

            ]
        });
    }

    function setupRowExpanderListener() {
        $('#storageTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = storageTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+  
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+   
            '<tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+                       
            '<tr>'+        
                '<td>Expected storage cost:</td>'+
                '<td>'+d.expected_storage_cost+'</td>'+
            '</tr>'+                       
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+  
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+              
            '</tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+      
        '</table>';
    }

    return {
        init: init,
    };
}();
// input - array of objects
// output - 'data' hash containing array of objects
function toDataTablesFormat(data) {
	hash = {};
	hash['data'] = data;
	return hash;
}
angular.module('dmaoApp').controller('uiGridAdvocacyEventTableCtrl', ['$scope', '$rootScope', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, api, ui, config, $q, $interval){
    var params = {
        // startDate:          config.startDate,
        // endDate:            config.endDate,
        // faculty:            config.faculty,
    };

    $scope.gridOptions = {};
    $scope.modifications = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'AdvocacyEvent.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Advocacy Event", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };
    $scope.gridOptions.columnDefs = [
        {
            name: 'session_date',
            displayName: 'Date',
            width: 80,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'session_type',
            displayName: 'Type',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'ast_name',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            // editDropdownOptionsArray: [
            //     {id: 1, value: 'look'},
            //     {id: 2, value: 'me'},
            //     {id: 3, value: 'up'}
            // ]
        },
        {
            name: 'session_content',
            displayName: 'Content',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'notes',
            displayName: 'Notes',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'num_participants',
            displayName: 'Participants',
            width: 100,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        }
    ];

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        api.uri.advocacyEvents(params).then(function(data){
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //console.log('Changing ', colDef, newValue, oldValue);
            $scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            // console.log('rowEntity afterCellEdit ', rowEntity );
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        var spinner = ui.spinner('loader');

        //console.log('rowEntity ', rowEntity);

        var params = {};
        var data = {
            ast_name: rowEntity.ast_name,
            inst_id: rowEntity.inst_id
        };
        data['pkey:ast_id'] = rowEntity.ast_id;
        arr = [];
        arr.push(data);
        params['data'] = arr;

        //console.log('params ', params);

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.advocacySessionTypes(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
            //Cannot use promise.reject() and promise.resolve() with external jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');
                $scope.modifications = {};
                rowEntity.ast_name = data[1].ast_name;
                //console.log('rowEntity ', rowEntity );

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                spinner.stop();
            });
            promise.error(function(data){
                alert('Error whilst saving data to server');
                spinner.stop();
            });
        //}, 10, 1);
    };
    // saving end

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name]);
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.addRow = function() {
        var n = $scope.gridOptions.data.length + 1;
        var params = {};
        var data = {
            // ast_name: 'Session Type ' + n,
            // ast_name: 1,
            inst_id: config.institutionId
            // session_date:
        };
        arr = [];
        arr.push(data);
        params['data'] = arr;

        var promise = api.uri.post.advocacyEvents(params);
        promise.success(function(data){
            // $scope.gridOptions.data.push( { ast_name: 'Change me ' });
            update();
        });
        promise.error(function(data){
            update();
            alert('Error whilst saving data to server');
        });
    };

    $scope.removeRow = function(thing){
        params = {};
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        params.ast_id = rowCol.row.entity.ast_id;
        api.uri.delete.advocacySessionTypes(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                update();
            }
        });
    };


    function setupSessionTypes() {
        // harcoded column position!
        console.log($scope.gridOptions.columnDefs[1].editDropdownOptionsArray);
        var spinner = ui.spinner('loader');
        var sessionTypes = [];
        api.uri.advocacySessionTypes().then(function(data){
            for (var i=0; i<data.length; ++i){
                o = {};
                o['id'] = i+1;
                o['value'] = data[i].ast_id
                o['ast_name'] = data[i].ast_name;
                sessionTypes.push(o);
            }
            $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = sessionTypes;
            $scope.$apply();
            spinner.stop();
            console.log($scope.gridOptions.columnDefs[1].editDropdownOptionsArray);
        });
    }

    setupSessionTypes();

}]);


angular.module('dmaoApp').controller('uiGridAdvocacySessionTypeTableCtrl', ['$scope', '$rootScope', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, api, ui, config, $q, $interval){
    var params = {
        // startDate:          config.startDate,
        // endDate:            config.endDate,
        // faculty:            config.faculty,
    };

    $scope.gridOptions = {};
    $scope.modifications = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'AdvocacySessionType.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Advocacy Session Type", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };
    $scope.gridOptions.columnDefs = [
        {
            name: 'ast_name',
            displayName: 'Name',
            width: 250,
            sort: { direction: 'asc' },
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        }
    ];

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        api.uri.advocacySessionTypes(params).then(function(data){
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //console.log('Changing ', colDef, newValue, oldValue);
            $scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            // console.log('rowEntity afterCellEdit ', rowEntity );
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        var spinner = ui.spinner('loader');

        //console.log('rowEntity ', rowEntity);

        var params = {};
        var data = {
            ast_name: rowEntity.ast_name,
            inst_id: rowEntity.inst_id
        };
        data['pkey:ast_id'] = rowEntity.ast_id;
        arr = [];
        arr.push(data);
        params['data'] = arr;

        //console.log('params ', params);

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.advocacySessionTypes(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
            //Cannot use promise.reject() and promise.resolve() with external jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');
                $scope.modifications = {};
                rowEntity.ast_name = data[1].ast_name;
                //console.log('rowEntity ', rowEntity );

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                spinner.stop();
            });
            promise.error(function(data){
                alert('Error whilst saving data to server');
                spinner.stop();
            });
        //}, 10, 1);
    };
    // saving end

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name]);
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.addRow = function() {
        var n = $scope.gridOptions.data.length + 1;
        var params = {};
        var data = {
            ast_name: 'Session Type ' + n,
            inst_id: config.institutionId
        };
        arr = [];
        arr.push(data);
        params['data'] = arr;

        var promise = api.uri.post.advocacySessionTypes(params);
        promise.success(function(data){
            // $scope.gridOptions.data.push( { ast_name: 'Change me ' });
            update();
        });
        promise.error(function(data){
            update();
            alert('Error whilst saving data to server');
        });
    };

    $scope.removeRow = function(thing){
        params = {};
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        params.ast_id = rowCol.row.entity.ast_id;
        api.uri.delete.advocacySessionTypes(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                update();
            }
        });
    };

}]);


angular.module('dmaoApp').controller('uiGridDatasetsRcukTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'datasetsRcuk.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "RCUK datasets", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'dataset_name',
            displayName: 'Dataset',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 80,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_faculty_abbrev',
            displayName: 'Lead Faculty',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_dept_name',
            displayName: 'Lead Dept',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            filter:             'rcuk',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.datasets(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
    };

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridDatasetsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'datasets.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "All datasets", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'dataset_name',
            displayName: 'Dataset',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 80,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_faculty_abbrev',
            displayName: 'Lead Faculty',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_dept_name',
            displayName: 'Lead Dept',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.datasets(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
    };

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridDmpStatusTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'dmpStatus.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "All data management plans", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 150,
            enableCellEdit: false
        },
        {
            name: 'dmp_state',
            displayName: 'DMP State',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'dmp_status',
            displayName: 'DMP Status',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
            // has_dmp:            true
        };
        api.uri.dmpStatus(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $scope.saveRow = function( rowEntity ) {

        var spinner = ui.spinner('loader');

        var params = {
            project_id: rowEntity.project_id,
            has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.dmps(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );

        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with exernal jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);
                spinner.stop();
            });

            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.has_dmp_been_reviewed +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.has_dmp_been_reviewed.replace(/\|/g, ', '));
                spinner.stop();
            });
            $scope.savingData = false;

        //}, 3000, 1);
    };
    // saving end




    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridDmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'dmp.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Data management plans produced", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        //{
        //    name: 'lead_faculty_id',
        //    displayName: 'Lead Faculty ID',
        //    width: 110,
        //    enableCellEdit: false,
        //    enableFiltering: false
        //},
        {
            name: 'lead_faculty_abbrev',
            displayName: 'Lead Faculty',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_dept_name',
            displayName: 'Lead Dept',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'dmp_id',
            displayName: 'DMP ID',
            width: 80,
            enableCellEdit: false,
            enableFiltering: false
        },
        //{
        //    name: 'has_dmp_been_reviewed',
        //    displayName: 'DMP Reviewed',
        //    width: 120,
        //    //type: 'number',
        //    enableFiltering: false,
        //    headerCellClass: 'columnEditableHeaderCell',
        //    cellClass: 'columnEditableCellContents'
        //},
        {
            name: 'has_dmp_been_reviewed',
            displayName: 'DMP Reviewed',
            width: 130,
            headerCellClass: 'columnEditableHeaderCell',
            //cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'yes'},
                {id: 2, value: 'no'},
                {id: 3, value: 'unknown'}
            ]
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            has_dmp:            true,
            faculty:            message.faculty,
        };
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $scope.saveRow = function( rowEntity ) {

        var spinner = ui.spinner('loader');

        var params = {
            project_id: rowEntity.project_id,
            has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.dmps(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );

        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with exernal jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);
                spinner.stop();
            });

            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.has_dmp_been_reviewed +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.has_dmp_been_reviewed.replace(/\|/g, ', '));
                spinner.stop();
            });
            $scope.savingData = false;

        //}, 3000, 1);
    };
    // saving end




    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridNoDmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'noDmp.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Projects without data management plans", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'lead_faculty_abbrev',
            displayName: 'Lead Faculty',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_dept_name',
            displayName: 'Lead Dept',
            width: 250,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            has_dmp:            false,
            faculty:            message.faculty,
        };
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
    };

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridPublicationsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'publications-editor.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Publications editor", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'inst_pub_title',
            displayName: 'Publication',
            width: 150,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 90,
            enableCellEdit: false,
            enableFiltering: false
        },
        // {
        //     name: 'cris_id',
        //     displayName: 'CRIS ID',
        //     width: 90,
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        {
            name: 'data_access_statement',
            displayName: 'Access statement',
            width: 140,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'},
                {id: 3, value: 'partial'},
                {id: 4, value: 'no_fulltext'}
            ]
        },
        {
            name: 'data_access_statement_notes',
            displayName: 'Access statement notes',
            width: 220,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editableCellTemplate: '<textarea rows="3" style="width:100%" ng-class="col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></textarea>'
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 250,
            enableCellEdit: false,
            enableFiltering: false
        },
        // {
        //     name: 'has_dataset_pid',
        //     displayName: 'Dataset PID?',
        //     width: 120,
        //     headerCellClass: 'columnEditableHeaderCell',
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        // {
        //     name: 'inst_id',
        //     displayName: 'Institution ID',
        //     width: 50,
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        {
            name: 'inst_pub_status',
            displayName: 'Pub status',
            width: 100,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'inst_pub_type',
            displayName: 'Pub type',
            width: 100,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'faculty_abbreviation',
            displayName: 'Lead Faculty',
            width: 120,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'department_name',
            displayName: 'Lead Dept',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'funder_compliant',
            displayName: 'RCUK compliant',
            width: 140,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'},
                {id: 3, value: 'partial'}
            ]
        },
        {
            name: 'is_funded',
            displayName: 'Funded',
            width: 80,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'}
            ]
        },
        {
            name: 'is_rcuk_funder',
            displayName: 'RCUK',
            width: 70,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 150,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'publication_date',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.publications(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.publications({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $scope.saveRow = function( rowEntity ) {

        var spinner = ui.spinner('loader');

        var params = {
            publication_id: rowEntity.publication_id,
            data_access_statement: rowEntity.data_access_statement,
            data_access_statement_notes: rowEntity.data_access_statement_notes,
            funder_compliant: rowEntity.funder_compliant


            // project_id: rowEntity.project_id,
            // has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.publications(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );

        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with exernal jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);
                spinner.stop();
            });

            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.has_dmp_been_reviewed +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.has_dmp_been_reviewed.replace(/\|/g, ', '));
                spinner.stop();
            });
            $scope.savingData = false;

        //}, 3000, 1);
    };
    // saving end




    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridRcukAccessComplianceTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'rcukAccessCompliance.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "RCUK access compliance", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'publication_pid',
            displayName: 'Publication',
            width: 150,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'publication_date',
            displayName: 'Publication Date',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'data_access_statement',
            displayName: 'Data access statement',
            width: 180,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'rcuk_funder_compliant',
            displayName: 'RCUK funder compliant',
            width: 190,
            enableCellEdit: false,
            enableFiltering: false
        },        
        {
            name: 'funder_name',
            displayName: 'Funder name',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.rcukAccessCompliance(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
    };

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);






angular.module('dmaoApp').controller('uiGridStorageTableCtrl', ['$scope', '$rootScope', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, api, ui, config, $q, $interval){
    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};
    $scope.modifications = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'storage.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Storage", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };
    $scope.gridOptions.columnDefs = [
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            sort: { direction: 'asc' },
            enableCellEdit: false
        },
        {
            name: 'inst_storage_platform_id',
            displayName: 'Platform',
            sort: { direction: 'asc' },
            width: 100,
            enableCellEdit: false,
        },
        {
            name: 'expected_storage',
            displayName: 'Expected (GB)',
            width: 110,
            type: 'number',
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            enableFiltering: false
        },
        {
            name: 'expected_storage_cost',
            displayName: 'Expected Cost',
            width: 120,
            cellFilter: 'number: 2',
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'dataset_size',
            displayName: 'Dataset Size (GB)',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 300,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.storage(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log('Data ', data);
            //$scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.storage({modifiable: true}).success(function (data) {
        //console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //console.log('Changing ', colDef, newValue, oldValue);
            $scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            //console.log('$scope.modifications', $scope.modifications);
            // console.log('rowEntity afterCellEdit ', rowEntity );
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        var spinner = ui.spinner('loader');

        //console.log('rowEntity ', rowEntity);
        var old_inst_storage_platform_id = '';
        if ($scope.modifications['inst_storage_platform_id']) {
            old_inst_storage_platform_id = $scope.modifications['inst_storage_platform_id'].old;
        }
        else {
            old_inst_storage_platform_id = rowEntity.inst_storage_platform_id;
        }

        var params = {
            old_inst_storage_platform_id: old_inst_storage_platform_id,
            inst_storage_platform_id: rowEntity.inst_storage_platform_id,
            expected_storage: rowEntity.expected_storage.toString(),
            project_id: rowEntity.project_id
        };

        //console.log('params ', params);

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.storage(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        // console.log('after setSavePromise ');
        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with external jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');
                $scope.modifications = {};
                rowEntity.expected_storage_cost = data[1][0].expected_storage_cost;
                //console.log('rowEntity ', rowEntity );

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                spinner.stop();
            });
            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.expected_storage +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.expected_storage.replace(/\|/g, ', '));
                spinner.stop();
            });
        //}, 10, 1);
    };
    // saving end

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end

    // editing begin
    //$scope.addData = function() {
    //    var n = $scope.gridOptions.data.length + 1;
    //    $scope.gridOptions.data.push({
    //        "project_name": "a new project " + n,
    //        "inst_storage_platform_id": "Storage Platform ",
    //        "expected_storage": 0,
    //        "project_id": n
    //    });
    //};
    // editing end


    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);

