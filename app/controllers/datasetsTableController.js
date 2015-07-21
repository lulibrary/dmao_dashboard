app.controller('datasetsTableCtrl', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){
        if(config.controllersInView.datasetsTableCtrl){
            var params = {  date:               'project_start',
                            sd:                 message.startDate,
                            ed:                 message.endDate,
                            faculty:            message.faculty,
                        };                
            api.uri.datasets(params).then(function(data){
                //console.log('Datasets ' + uri);
                Datasets.init(data);    
                // console.log(Datasets.init(');        
            });
        }
    }

    $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  
});