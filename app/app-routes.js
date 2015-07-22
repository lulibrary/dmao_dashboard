app.config(function($routeProvider) {
	$routeProvider
	.when('/', { templateUrl: 'app/statistics/statistic-compilation.html' })
	.when('/datasets', { templateUrl: 'app/tables/datasets-table.html' })
	.when('/datasetsRCUK', { templateUrl: 'app/tables/datasets-rcuk-table.html' })	
	.when('/dmp', { templateUrl: 'app/tables/dmp-table.html' })
	.when('/nodmp', { templateUrl: 'app/tables/no-dmp-table.html' })
	.when('/dmps', { templateUrl: 'app/tables/dmp-status-table.html' })
	.when('/storage', { templateUrl: 'app/tables/storage-table.html' })
	.when('/compliance', { templateUrl: 'app/tables/rcuk-access-compliance-table.html' })
	// .when('/index.html', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
  	.otherwise({ templateUrl: 'app/messages/error.html' });

    // use the HTML5 History API to get clean URLs and remove the hashtag from the URL
    // $locationProvider.html5Mode(true);
});