app.directive('statistic', function() {
    var directive = {};

    directive.restrict = 'E';

    directive.templateUrl = 'javascript/app/components/statistic/statisticView.html';

    directive.replace = 'true';

    directive.scope = {
        description: "=",
        value: '='
    };    

    return directive;
});