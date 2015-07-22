app.config(function($routeProvider) {
	$routeProvider
	.when('/', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
	.when('/datasets', { templateUrl: 'app/components/table/datasets.html' })
	.when('/datasetsRCUK', { templateUrl: 'app/components/table/datasetsRCUK.html' })	
	.when('/dmp', { templateUrl: 'app/components/table/dmp.html' })
	.when('/nodmp', { templateUrl: 'app/components/table/noDmp.html' })
	.when('/dmps', { templateUrl: 'app/components/table/dmpStatus.html' })
	.when('/storage', { templateUrl: 'app/components/table/storage.html' })
	.when('/compliance', { templateUrl: 'app/components/table/rcukAccessCompliance.html' })
	// .when('/index.html', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
  	.otherwise({ templateUrl: 'app/components/error/error.html' });

    // use the HTML5 History API to get clean URLs and remove the hashtag from the URL
    // $locationProvider.html5Mode(true);
});