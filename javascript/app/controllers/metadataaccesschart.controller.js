app.controller('metadataAccessChartCtrl', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
                summary_by_date:    true
            };
    
    request(params);

    function request(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };        
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'metadata');
            MetadataAccessLineChart(data, {width:700, height:300});    
            // console.log('MetadataAccessLineChart(');        
        });
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        request(message);
    }); 
});