app.directive('statistic', function() {
	return {
		restrict: 		'E',
		templateUrl: 	'app/components/statistic/statisticView.html',
		replace: 		'true',
		scope: {
        	value: 			"@",
        	description: 	"@",
        	icon: 			"@",
        	colour:         "@",
        	link:      		"@",
        	units:      	"@",
        }
    };
});