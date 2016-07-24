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