app.config(function($routeProvider) {
	$routeProvider
	.when('/', { templateUrl: 'javascript/app/include/include.html' })
  	.otherwise({ template: "Couldn\'t match a route" })
		// controller: 'DatasetsController'

	// .when('/ShowOrders', {
	// 	templateUrl: 'templates/show_orders.html',
	// 	controller: 'ShowOrdersController'
 //  	})
  // 	.otherwise({
		// redirectTo: '/AddNewOrder'
  // 	});

        // use the HTML5 History API to get clean URLs and remove the hashtag from the URL
        // $locationProvider.html5Mode(true);
});