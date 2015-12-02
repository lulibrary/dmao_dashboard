app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/landing', { templateUrl: 'app/public/landing.html' })
		//.when('/landing', { templateUrl: 'app/tables/storage-table.html' })
		//.when('/landing', { templateUrl: 'app/tables/dmp-table.html' })
		//.when('/landing', { templateUrl: 'app/statistics/statistic-compilation.html' })
		.when('/', { templateUrl: 'app/statistics/statistic-compilation.html' })
		.when('/all', { templateUrl: 'app/public/landing.html' })
		.when('/stats', { 	templateUrl: 'app/statistics/statistic-compilation.html'})
		.when('/login', { templateUrl: 'app/auth/login.html' })
		.when('/datasets', { templateUrl: 'app/tables/datasets-table.html' })
		.when('/datasetsRCUK', { templateUrl: 'app/tables/datasets-rcuk-table.html' })
		.when('/dmp', { templateUrl: 'app/tables/dmp-table.html' })
		.when('/nodmp', { templateUrl: 'app/tables/no-dmp-table.html' })
		.when('/dmps', { templateUrl: 'app/tables/dmp-status-table.html' })
		.when('/storage', { templateUrl: 'app/tables/storage-table.html' })
		.when('/compliance', { templateUrl: 'app/tables/rcuk-access-compliance-table.html' })
		.when('/data', { templateUrl: 'app/charts/data-access-chart.html' })
		.when('/metadata', { templateUrl: 'app/charts/metadata-access-chart.html' })
		// .when('/index.html', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
		.otherwise({ templateUrl: 'app/messages/error.html' });
	}])
    // use the HTML5 History API to get clean URLs and remove the hashtag from the URL
    // $locationProvider.html5Mode(true);
	.run(['$rootScope', '$location', function($rootScope, $location) {
		$rootScope.$on( "$routeChangeStart", function(event, next, current) {
			//console.log('apikey $routeChangeStart1', ApiService.apikey);


			//console.log('Current route name: ' + $location.path());
			//console.log('$rootScope.loggedInUser ', $rootScope.loggedInUser);

			if ($rootScope.loggedInUser == null) {
				// no logged user, redirect to /login
				if ($location.path() === '/landing' ||
					next.templateUrl === 'app/auth/login.html') {
				} else {
					$location.path("/landing");
				}
			}
			//console.log('apikey $routeChangeStart2', ApiService.apikey);
		});
		//console.log('apikey $routeChangeStart3', ApiService.apikey);
	}]);
