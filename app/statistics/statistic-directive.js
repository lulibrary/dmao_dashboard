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