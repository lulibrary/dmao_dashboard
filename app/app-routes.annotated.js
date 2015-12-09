app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/landing', { templateUrl: 'app/public/landing.html' })
		//.when('/landing', { templateUrl: 'app/tables/storage-table.html' })
		//.when('/landing', { templateUrl: 'app/tables/dmp-table.html' })
		//.when('/landing', { templateUrl: 'app/statistics/statistic-compilation.html' })
		.when('/', { templateUrl: 'app/public/landing.html' })
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