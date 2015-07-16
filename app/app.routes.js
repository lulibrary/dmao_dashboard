app.config(function($routeProvider) {
	$routeProvider
	.when('/', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
	.when('/datasets', { templateUrl: 'app/components/table/datasets.html' })
	// .when('/index.html', { templateUrl: 'app/components/statistic/statisticCompilationView.html' })
  	.otherwise({ templateUrl: 'app/components/error/error.html' });

    // use the HTML5 History API to get clean URLs and remove the hashtag from the URL
    // $locationProvider.html5Mode(true);
});