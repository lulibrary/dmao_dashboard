angular.module('dmaoApp').config(function($routeProvider, $locationProvider) {
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
	})

.run(function ($rootScope, $location, $cookies) {
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
  });