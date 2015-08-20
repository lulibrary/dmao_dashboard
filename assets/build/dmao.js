var app = angular.module('dmaoApp', ['ngRoute']);

// This is a compromise. Factory is used to create an Angular service with dependency injection 
// into the controllers to make it explicit that api is an external dependency. 
// Api is actually a global variable, so that it can be used with jQuery code, without duplicating 
// the config definition.
app.factory('api', function() { 
    return ApiService;
});

app.factory('config', function() { 
    return App;
});
app.config(['$routeProvider', function($routeProvider) {
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
}]);
function reverseChronoChartData(monthData) {
    // put into labelled format for chart, with array in reverse chronological order
    // assumes chronological order as input
    // outpuut format:
    // var arr = [
    //     ['Month Label 1', value],
    //     ['Month Label 2', value],
    // ];
    var chartData = [];
    var j = monthData.length;
    for(var i = 0; i < monthData.length; ++i) {
        --j;
        chartData[i] = [monthData[j].month, monthData[j].value];
    }  

    // console.table('chartData');
    // console.table(chartData);
    return chartData;
}


app.controller('dataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        summary_by_date:    true
                    };        
        api.uri.datasetAccess(params).then(function(data){
            //console.log('data access ' + uri);
            data = api.filter.datasetAccess(data, 'data_download');
            DataAccessLineChart(data, {width:700, height:300});    
            // console.log('DataAccessLineChart(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);
var DataAccessLineChart = function(data, options){
    var drawChart = true;
    // var dataAccessResponseDataOld = App.dataAccessResponseData;
    
    // console.log('Data OLD', dataAccessResponseDataOld);

    // if (!angular.equals(App.dataAccessResponseData, data)){
    //   // console.log('Data CHANGED, should redraw graph');
    //   App.dataAccessResponseData = data;
    //   drawChart = true;
    // }
    // else
    // {
    //   // console.log('Checksum SAME, should NOT redraw graph');
    // }

    if (drawChart){
        var margin = {top: 20, right: 20, bottom: 30, left: 100},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.access_date); })
            .y(function(d) { return y(d.counter); });

            $( "#dataAccessChart" ).empty();

        var svg = d3.select("#dataAccessChart").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          
          data.forEach(function(d) {
            d.access_date = parseDate(d.access_date);
            d.counter = +d.sum;
          });
          // //console.table(data);

          x.domain(d3.extent(data, function(d) { return d.access_date; }));
          y.domain(d3.extent(data, function(d) { return d.counter; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")
              .style("text-anchor", "end")
              .text("Downloads");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
    }
};

app.controller('metadataAccessChartCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
                summary_by_date:    true
            };
    
    update(params);

    function update(message){
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

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    }); 
}]);
var MetadataAccessLineChart = function(data, options){

    var drawChart = true;
    // var metadataAccessResponseDataOld = App.metadataAccessResponseData;
    
    // // console.log('Data OLD', dataAccessResponseDataOld);

    // if (!angular.equals(metadataAccessResponseDataOld, data)){
    //   // console.log('Data CHANGED, should redraw graph');
    //   App.metadataAccessResponseData = data;
    //   redrawChart = true;
    // }
    // else
    // {
    //   // console.log('Checksum SAME, should NOT redraw graph');
    // }

    if (drawChart){
        var margin = {top: 20, right: 20, bottom: 30, left: 100},
            width = options.width - margin.left - margin.right,
            height = options.height - margin.top - margin.bottom;

        var parseDate = d3.time.format("%Y-%m-%d").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.access_date); })
            .y(function(d) { return y(d.counter); });

            $( "#metadataAccessChart" ).empty();

        var svg = d3.select("#metadataAccessChart").append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            .attr("width", options.width + margin.left + margin.right)
            .attr("height", options.height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


          
          data.forEach(function(d) {
            d.access_date = parseDate(d.access_date);
            d.counter = +d.sum;
          });
          // //console.table(data);

          x.domain(d3.extent(data, function(d) { return d.access_date; }));
          y.domain(d3.extent(data, function(d) { return d.counter; }));

          svg.append("g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          svg.append("g")
              .attr("class", "y axis")
              .call(yAxis)
            .append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 6)
              .attr("dy", ".71em")              
              .style("text-anchor", "end")
              .text("Accesses");

          svg.append("path")
              .datum(data)
              .attr("class", "line")
              .attr("d", line);
    }
};

var DataAccessChart = {

    init: function(params) {
        $.ajax({
            url: ApiService.uri.datasetAccess(params),
            success: function(data){
                // console.log('data');
                // console.log(data);
                var filteredData = ApiService.filter.datasetAccess(data, 'data_download');
                var numMonths = 12;
                var monthData = ApiService.filter.dataLastNMonths(filteredData, numMonths);
                var chartData = reverseChronoChartData(monthData);


                if ($('#data_access').size() != 0) {

                    $('#data_access_loading').hide();
                    $('#data_access_content').show();

                    var plot_statistics = $.plot($("#data_access"),
                        [{
                            data: chartData,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#BAD9F5']
                        }, {
                            data: chartData,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#9ACAE6",
                                lineWidth: 2
                            },
                            color: '#9ACAE6',
                            shadowSize: 1
                        }, {
                            data: chartData,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#9ACAE6',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: "#eee",
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderColor: "#eee",
                                borderWidth: 1
                            }
                        });

                    var previousPoint = null;
                    $("#data_access").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' downloads');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


            }
        });
    }
}
var MetadataAccessChart = {

    init: function(params) {
        $.ajax({
            url: ApiService.uri.datasetAccess(params),
            success: function(data){
                // console.log('data');
                // console.log(data);
                var filteredData = ApiService.filter.datasetAccess(data, 'metadata');
                var numMonths = 12;
                var monthData = ApiService.filter.dataLastNMonths(filteredData, numMonths);
                var chartData = reverseChronoChartData(monthData);

                if ($('#metadata_access').size() != 0) {

                    $('#metadata_access_loading').hide();
                    $('#metadata_access_content').show();

                    var plot_statistics = $.plot($("#metadata_access"),
                        [{
                            data: chartData,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#f89f9f']
                        }, {
                            data: chartData,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#f89f9f",
                                lineWidth: 2
                            },
                            color: '#f89f9f',
                            shadowSize: 1
                        }, {
                            data: chartData,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#f89f9f',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            yaxis: {
                                ticks: 5,
                                tickDecimals: 0,
                                tickColor: "#eee",
                                font: {
                                    lineHeight: 14,
                                    style: "normal",
                                    variant: "small-caps",
                                    color: "#6F7B8A"
                                }
                            },
                            grid: {
                                hoverable: true,
                                clickable: true,
                                tickColor: "#eee",
                                borderColor: "#eee",
                                borderWidth: 1
                            }
                        });

                    var previousPoint = null;
                    $("#metadata_access").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' downloads');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


            }
        });
    }
}
app.controller('filterCtrl', ['$scope', '$rootScope', '$interval', 'config', function($scope, $rootScope, $interval, config) {
    $scope.startDate = config.startDateDefault;
    $scope.endDate = config.endDateDefault;
    $scope.faculty = config.facultyDefault;   
    $scope.facultyName = config.facultyMap[config.facultyDefault];

    function broadcastFilterChange(msg){
        // //console.log(msg);
        $rootScope.$broadcast("FilterEvent", {  
                                                    msg: msg,
                                                    startDate: $scope.startDate,
                                                    endDate: $scope.endDate,
                                                    faculty: $scope.faculty
                                                    }
            );       
    }

    function update() {
        broadcastFilterChange("Timed update");
        // console.log("TIMED UPDATE at " + Date());
        // //console.table(config);
    }
    var timeout = config.updateDelay;
    $interval(update, timeout); 

    /****************
        startDate
    *****************/
    $scope.$watch(
        function() {
            return $scope.startDate;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.startDate');
            // if(angular.equals(newValue, oldValue)){
            //     return; 
            // }
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.startDate = newValue;                
            // broadcastDate("New date range");
        }); 

    /****************
        endDate
    *****************/
    $scope.$watch(
        function() {
            return $scope.endDate;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.endDate');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            //console.log('old ', oldValue, 'new ', newValue);
            $scope.endDate = newValue;
        });  

    /****************
        faculty
    *****************/
    $scope.$watch(
        function() {
            return $scope.faculty;
        },
        function(newValue, oldValue) {
            //console.log('Watched config.endDate');
            // if(angular.equals(newValue, oldValue)){
            //     return;
            // }    
            // console.log('old ', oldValue, 'new ', newValue);
            $scope.faculty = newValue;
            $scope.facultyName = config.facultyMap[newValue];       
        });     

    /****************
        DETERMINE WHETHER TO BROADCAST
        startDate,
        endDate,
        faculty
    *****************/
    $scope.$watch(
        function() {
            return {startDate: $scope.startDate, 
                    endDate: $scope.endDate,
                    faculty: $scope.faculty
                    }
        },
        function(newRange, oldRange) {
            // //console.log('Watched config.startEndDate in dateRangeCtrl');
            // //console.log('old ', oldValue, 'new ', newValue);
            var shouldBroadcast = false;
            if (newRange.startDate !== oldRange.startDate){
                shouldBroadcast = true;
            }
            if (newRange.endDate !== oldRange.endDate){
                shouldBroadcast = true;
            }
            if (newRange.faculty !== oldRange.faculty){
                shouldBroadcast = true;
            }
            if (shouldBroadcast){
                broadcastFilterChange("Filter change");
            } 
        },
        true
        );   
  

}]);

var DMAOFilters = (function(){    
    var config = {};

    var init = function(gConfig){
        config = gConfig;
    };

    var DateRangePicker = function(){        
        $('#reportrange span').html(moment(config.startDate, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDate, "YYYYMMDD").format('MMMM D, YYYY'));        

        $('#reportrange').daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
            endDate: moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
            minDate: '01/01/2000',
            maxDate: '31/12/9999',
            dateLimit: { days: 100000 },
            showDropdowns: true,
            showWeekNumbers: true,
            timePicker: false,
            timePickerIncrement: 1,
            timePicker12Hour: true,
            ranges: {
               'Today': [moment(), moment()],
               'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
               'Last 7 Days': [moment().subtract(6, 'days'), moment()],
               'Last 30 Days': [moment().subtract(29, 'days'), moment()],
               'This Month': [moment().startOf('month'), moment().endOf('month')],
               'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            opens: 'left',
            drops: 'down',
            buttonClasses: ['btn', 'btn-sm'],
            applyClass: 'btn-primary',
            cancelClass: 'btn-default',
            separator: ' to ',
            locale: {
                applyLabel: 'Submit',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                customRangeLabel: 'Custom',
                daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
                monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                firstDay: 1
            }
        }, function(start, end, label) {
            // console.log(start.toISOString(), end.toISOString(), label);        
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            // console.log('option has been selected');
            var startDate = start.format('YYYYMMDD');
            var endDate = end.format('YYYYMMDD');

            // console.log(startDate, endDate);
               
            config.startDate = startDate;
            config.endDate = endDate;

            var scope = angular.element($("#filterController")).scope();
            scope.$apply(function(){
                scope.startDate = startDate;
                scope.endDate = endDate;
            });

            // console.log('after date selection ', config.startDate, config.endDate);

        });

       $('.applyBtn').click(function() {
            // console.log( $('input[name="daterangepicker_start"]').val() );
            // console.log( 'ado format ' + $('input[name="daterangepicker_start"]').format('YYYYMMDD').val() );
            var startDateUI = $('input[name="daterangepicker_start"]').val();
            var startDate = moment(startDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            var endDateUI = $('input[name="daterangepicker_end"]').val();
            var endDate = moment(endDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            // console.log('Button click formatted startDate ' + startDate );
            // console.log(startDate, endDate);  
            config.startDate = startDate;
            config.endDate = endDate;
            var scope = angular.element($("#filterController")).scope();
            scope.$apply(function(){
                scope.startDate = startDate;
                scope.endDate = endDate;
            });         
        });
    };

    var setFaculty = function(faculty){
        config.faculty = faculty;
        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.faculty = faculty;
        });
    };   

    var initUserSelections = function(){
        // update globals
        config.faculty = config.facultyDefault;
        config.startDate = config.startDateDefault;
        config.endDate = config.endDateDefault;

        // tell jQuery daterangepicker
        $('#reportrange').data('daterangepicker').setStartDate(moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange').data('daterangepicker').setEndDate(moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange span').html(moment(config.startDateDefault, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDateDefault, "YYYYMMDD").format('MMMM D, YYYY'));

        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.faculty = config.faculty;
            scope.startDate = config.startDateDefault;
            scope.endDate = config.endDateDefault;
        });
    }; 

    return {
        init: init,
        initUserSelections: initUserSelections,
        DateRangePicker: DateRangePicker,
        setFaculty: setFaculty
    };
})();
var App = {
    institutionId: 'lancaster',
    startDateDefault: '20000101',
    endDateDefault: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),       
    startDate: '20000101',
    endDate: '20350101', //moment().add(20, 'years').format('YYYYMMDD'),
    faculty: '',
    facultyDefault: '',
    facultyMap: {
       '': 'All faculties',
        1: 'Faculty of Arts and Social Sciences',
        2: 'Faculty of Science and Technology',
        3: 'Faculty of Health and Medicine',
        4: 'Lancaster University Management School'
    },
    updateDelay: 30000,
    // dataAccessResponseData: {},
    // metadataAccessResponseData: {},
};

var ApiService = {
    version:    'v0.2', 
    prefix: function() {
        // Prototype
        // http://lib-ldiv.lancs.ac.uk:8080/dmaonline/v0.2/use_case_1/lancaster?
        // date=<project_awarded|project_start|project_end>&sd=YYYYMMDD&ed=YYYYMMDD
        var uri = URI({
            protocol:   'http',
            hostname:   'lib-ldiv.lancs.ac.uk',
            port:       '8080',
            path:       'dmaonline',             
        });
        uri += '/' + this.version;
        return uri.toString();
    },
    uri: {
        addParams: function(uri, params){
            for (key in params) {
                uri.addSearch(key, params[key]);
            }                    
            return uri;
        },
        datasets: function(params){           
            var uri = URI(ApiService.prefix() + '/datasets' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        dmps: function(params){
            var uri = URI(ApiService.prefix() + '/project_dmps' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        dmpStatus: function(params){
            var uri = URI(ApiService.prefix() + '/dmp_status' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        }, 
        storage: function(params){
            var uri = URI(ApiService.prefix() + '/storage' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },    
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/rcuk_as' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        datasetAccess: function(params){
            var uri = URI(ApiService.prefix() + '/dataset_accesses' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        datasetAccessByDateRange: function(params){
            var uri = this.datasetAccess(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return $.getJSON(uri);
        },
    },
    filter: {
        datasetAccess: function(data, accessType){
            var filteredData = [];
            for(var i = 0; i < data.length; ++i) {
                if (data[i].access_type === accessType) {
                    filteredData.push(data[i]);
                }
            }
            // console.log('filteredData');
            // console.table(filteredData);
            return filteredData;
        },
        dataLastNMonths: function(data, nMonths){
            // init
            var monthData = [];
            for(var i = 0; i < nMonths; ++i) {
                var startDate = moment().subtract(i, 'months').startOf('month').format('YYYY-MM-DD');
                var endDate = moment().subtract(i, 'months').endOf('month').format('YYYY-MM-DD');
                monthData.push({startDate: startDate, 
                                endDate: endDate,
                                month: moment(startDate).format('MMM'),
                                value: 0
                            });
            }

            for(var i = 0; i < data.length; ++i) {
                for(var j = 0; j < nMonths; ++j) {
                    if (data[i].access_date >= monthData[j].startDate && data[i].access_date <= monthData[j].endDate){
                        monthData[j].value += data[i].counter;
                    }
                }
            }
            // console.log('monthData');
            // console.table(monthData);
            return monthData;
        },    
        dataAggregateDateCounts: function(data){
            // console.log('data in dataAggregateDateCounts');
            // console.table(data);
            // init
            var date_data = {};
            for(var i = 0; i < data.length; ++i) {
                var access_date_hash = data[i].access_date.replace(/-/g, "");
                if (date_data[access_date_hash]){
                    date_data[access_date_hash].counter += data[i].counter;
                } else{
                    var o = {   access_date: data[i].access_date,
                                counter: data[i].counter
                            };
                    date_data[access_date_hash] = o;
                }
            }
            // console.log('date_data');
            // console.log(date_data);

            var date_data_arr = [];
            $.each(date_data, function(key, value){
                date_data_arr.push(date_data[key]);
            });
            
            return date_data_arr;
        },         
    },   
    template: {
        dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    },
};
app.controller('datasetsRCUKCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;

    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        // if(config.inView.datasetsRCUKCtrl){        
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            filter:     'rcuk',
                            count:      true
                        };

            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){            
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });        
}]);
app.controller('datasetsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,  
            });

    function update(message){
        // if(config.inView.datasetsCtrl){
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            count:      true 
                        };

            api.uri.datasets(params).then(function(response) {
                $scope.$apply(function(){
                    var value = response[0].num_datasets;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });       
}]);  

app.controller('dmpsCreatedCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });
    
    function update(message){
        var params = {  date:       'project_start',
                        sd:         message.startDate, 
                        ed:         message.endDate,
                        faculty:    message.faculty,
                        has_dmp:    true,
                        count:      true
                    };
        
        api.uri.dmps(params).then(function(response) {
            $scope.$apply(function(){ 
                var value = response[0].num_project_dmps;
                // only update if dirty
                if (value !== $scope.value) $scope.value = value;
            });
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });    
}]);
app.controller('dmpStatusCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    // init
    $scope.value = 0;
    // $scope.fraction = {numerator: 0, denominator: 0}
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault, 
                faculty:        config.facultyDefault,
            });

    function update(message){
        // if(config.inView.dmpStatusCtrl){        
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            count:      true
                        };
            
            api.uri.dmpStatus(params).then(function(response) {
            //     var count = 0;
            //     for(i=0;i<response.length;++i) {
            //         if (response[i].dmp_status === 'completed' || response[i].dmp_status === 'verified') ++count;
            //     }

            //     // only update if dirty
            //     if (count !== $scope.fraction.numerator)
            //         $scope.fraction.numerator = count;
            //     // only update if dirty
            //     if (response.length !== $scope.fraction.denominator)
            //         $scope.fraction.denominator = response.length;
            // });
            $scope.$apply(function(){
                var value = response[0].num_dmp_status;
                if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });  
}]);
app.controller('noDmpProjectsCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });
    
    function update(message){
        // if(config.inView.noDmpProjectsCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                            has_dmp:    false,
                            count:      true
                        };
            
            api.uri.dmps(params).then(function(response) {
                $scope.$apply(function(){
                    var value = response[0].num_project_dmps;
                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    }); 
}]);
app.controller('rcukAccessComplianceCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        // if(config.inView.rcukAccessComplianceCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty: message.faculty
                        };
            api.uri.rcukAccessCompliance(params).then(function(response) {
                $scope.$apply(function(){
                    var count = 0;
                    for(i=0;i<response.length;++i) {
                        if (response[i].data_access_statement === 'exists with persistent link') ++count;
                    }

                    // only update if dirty
                    var value = 0;
                    if (count && count !== $scope.value) {
                        value = (count / response.length) * 100;
                        $scope.value = Math.round(value);
                    }
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);
app.directive('statistic', function() {
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
app.controller('storageCostCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    // $scope.currency = '';

    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        // if(config.inView.storageCostCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                $scope.$apply(function(){
                    var total = 0;
                    var previous_project_id = -1;
                    // if (response.length){
                    //     $scope.currency = 
                    // }
                    for(i=0;i<response.length;++i) {            
                        if (response[i].project_id != previous_project_id) {
                            total += response[i].expected_storage_cost;
                        }
                        previous_project_id = response[i].project_id;
                    }
                    var value = Math.round(total);

                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);
app.controller('storageUnitCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {
    // init
    $scope.value = 0;
    update({
                startDate:      config.startDateDefault, 
                endDate:        config.endDateDefault,
                faculty:        config.facultyDefault,
            });

    function update(message){
        // if(config.inView.storageUnitCtrl){ 
            var params = {  date:       'project_start',
                            sd:         message.startDate, 
                            ed:         message.endDate,
                            faculty:    message.faculty,
                        };
            
            api.uri.storage(params).then(function(response) {
                $scope.$apply(function(){
                    var total = 0;
                    var previous_project_id = -1;
                    for(i=0;i<response.length;++i) {            
                        if (response[i].project_id != previous_project_id) {
                            total += response[i].expected_storage;
                        }
                        previous_project_id = response[i].project_id;
                    }
                    var value = Math.round(total * 0.001024);

                    // only update if dirty
                    if (value !== $scope.value) $scope.value = value;
                });
            });
        // }
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });   
}]);

app.controller('datasetsRCUKTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        filter:             'rcuk'
                    };                
        api.uri.datasets(params).then(function(data){
            // console.log('Datasets ' + uri);
            DatasetsRCUKTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    }); 
}]);
var DatasetsRCUKTable = function() {
    var rcukDatasetsTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#rcukDatasetsTable" ).dataTable();
        oTable.fnDestroy();            

        rcukDatasetsTable = $('#rcukDatasetsTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'dataset_name' },
                { data: 'funder_name' },
                { data: 'dataset_pid' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'project_name' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#rcukDatasetsTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = rcukDatasetsTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Dataset link:</td>'+
                '<td>'+d.dataset_link+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset name:</td>'+
                '<td>'+d.dataset_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset notes:</td>'+
                '<td>'+d.dataset_notes+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Storage location:</td>'+
                '<td>'+d.storage_location+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+  
        '</table>';
    }

    return {
        init: init,
    };
}();
app.controller('datasetsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.datasets(params).then(function(data){
            DatasetsTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var DatasetsTable = function() {
    var datasetsTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#datasetsTable" ).dataTable();
        oTable.fnDestroy();

        datasetsTable = $('#datasetsTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'dataset_name' },
                { data: 'funder_name' },
                { data: 'dataset_pid' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'project_name' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });    
    }

    function setupRowExpanderListener() {
        $('#datasetsTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = datasetsTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }  

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Dataset link:</td>'+
                '<td>'+d.dataset_link+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset name:</td>'+
                '<td>'+d.dataset_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Dataset notes:</td>'+
                '<td>'+d.dataset_notes+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Storage location:</td>'+
                '<td>'+d.storage_location+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+  
        '</table>';
    }      

    return {
        init: init,
    };
}();
app.controller('dmpStatusTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            true,
                    };                
        api.uri.dmpStatus(params).then(function(data){
            //console.log('Datasets ' + uri);
            DmpStatusTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var DmpStatusTable = function() {
    var dmpStatusTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#dmpStatusTable" ).dataTable();
        oTable.fnDestroy();

        dmpStatusTable = $('#dmpStatusTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },                    
                { data: 'funder_id' },
                { data: 'dmp_stage' },
                { data: 'dmp_status' },
                { data: 'project_start' },
                { data: 'project_end' },

            ]
        });
    }

    function setupRowExpanderListener() {
        $('#dmpStatusTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = dmpStatusTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+    
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Data management plan source system id:</td>'+
                '<td>'+d.dmp_source_system_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Data management plan state:</td>'+
                '<td>'+d.dmp_stage+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Data management plan status:</td>'+
                '<td>'+d.dmp_status+'</td>'+
            '</tr>'+    
        '</table>';
    }

    return {
        init: init,
    };
}();

app.controller('dmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            true,
                    };                
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            DmpTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var DmpTable = function() {
    var dmpTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#dmpTable" ).dataTable();
        oTable.fnDestroy();

        dmpTable = $('#dmpTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
                { data: 'dmp_id' },
                { data: 'has_dmp_been_reviewed' },
                { data: 'project_start' },
                { data: 'project_end' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#dmpTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = dmpTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Has data management plan:</td>'+
                '<td>'+d.has_dmp+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
app.controller('noDmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                        has_dmp:            false,
                    };                
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            NoDmpTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var NoDmpTable = function() {
    var noDmpTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#noDmpTable" ).dataTable();
        oTable.fnDestroy();

        noDmpTable = $('#noDmpTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'lead_faculty_abbrev' },
                { data: 'lead_dept_name' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#noDmpTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = noDmpTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+     
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+          
            '<tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Is awarded:</td>'+
                '<td>'+d.is_awarded+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Institution id:</td>'+
                '<td>'+d.inst_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Institution project code:</td>'+
                '<td>'+d.institution_project_code+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Data management plan id:</td>'+
                '<td>'+d.dmp_id+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Has data management plan:</td>'+
                '<td>'+d.has_dmp+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Has data management plan been reviewed:</td>'+
                '<td>'+d.has_dmp_been_reviewed+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+        
            '<tr>'+        
                '<td>Lead faculty abbreviation:</td>'+
                '<td>'+d.lead_faculty_abbrev+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead faculty name:</td>'+
                '<td>'+d.lead_faculty_name+'</td>'+
            '</tr>'+
            '<tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department abbrev:</td>'+
                '<td>'+d.lead_dept_abbrev+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Lead department name:</td>'+
                '<td>'+d.lead_dept_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
app.controller('rcukAccessComplianceTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.rcukAccessCompliance(params).then(function(data){
            //console.log('Datasets ' + uri);
            RcukAccessComplianceTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var RcukAccessComplianceTable = function() {
    var rcukAccessComplianceTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);

        var oTable = $( "#rcukAccessComplianceTable" ).dataTable();
        oTable.fnDestroy();

        rcukAccessComplianceTable = $('#rcukAccessComplianceTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                },                   
                { data: 'publication_pid' },
                { data: 'publication_date' },
                { data: 'data_access_statement' },
                { data: 'funder_name' },
                { data: 'project_name' },
            ]
        });
    }

    function setupRowExpanderListener() {
        $('#rcukAccessComplianceTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = rcukAccessComplianceTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+
           '<tr>'+
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+        
            '<tr>'+
                '<td>Publication id:</td>'+
                '<td>'+d.publication_id+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Cris id:</td>'+
                '<td>'+d.cris_id+'</td>'+
            '</tr>'+        
                '<td>Repo id:</td>'+
                '<td>'+d.repo_id+'</td>'+
            '</tr>'+    
            '</tr>'+        
                '<td>Funder project code:</td>'+
                '<td>'+d.funder_project_code+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead institution id:</td>'+
                '<td>'+d.lead_inst_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead faculty id:</td>'+
                '<td>'+d.lead_faculty_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Lead department id:</td>'+
                '<td>'+d.lead_department_id+'</td>'+
            '</tr>'+ 
            '</tr>'+        
                '<td>Publication date:</td>'+
                '<td>'+d.publication_date+'</td>'+
            '</tr>'+ 
            '<tr>'+
                '<td>Data access statement:</td>'+
                '<td>'+d.data_access_statement+'</td>'+
            '</tr>'+
            '</tr>'+        
                '<td>Funder id:</td>'+
                '<td>'+d.funder_id+'</td>'+
            '</tr>'+         
            '<tr>'+
                '<td>Funder name:</td>'+
                '<td>'+d.funder_name+'</td>'+
            '</tr>'+        
        '</table>';
    }

    return {
        init: init,
    };
}();
app.controller('storageTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'config', function($scope, $rootScope, $http, api, config) {  
    var params = {
                startDate:          config.startDateDefault, 
                endDate:            config.endDateDefault,
                faculty:            config.facultyDefault,
            };
    
    update(params);

    function update(message){     
        var params = {  date:               'project_start',
                        sd:                 message.startDate,
                        ed:                 message.endDate,
                        faculty:            message.faculty,
                    };                
        api.uri.storage(params).then(function(data){
            //console.log('Datasets ' + uri);
            StorageTable.init(data);    
            // console.log(Datasets.init(');        
        });
    }

    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });  

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
}]);
var StorageTable = function() {
    var storageTable;

    var init = function(data) {
        setupTable(data);
        setupRowExpanderListener();
    };

    function setupTable(data) {
        var hash = toDataTablesFormat(data);
        
        var oTable = $( "#storageTable" ).dataTable();
        oTable.fnDestroy();

        storageTable = $('#storageTable').DataTable( {
            lengthMenu: [ 25, 50, 75, 100 ],
            data: hash['data'],
            dom: 'ClfrtipR', // drag n drop reorder
            columns: [
                {
                    data:           null,
                    className:      'details-control',
                    orderable:      false,                      
                    defaultContent: ''
                }, 
                { data: 'project_name' },
                { data: 'expected_storage' },
                { data: 'expected_storage_cost' },
                { data: 'dataset_size' },                    
                { data: 'project_start' },
                { data: 'project_end' },
                { data: 'dataset_pid' },

            ]
        });
    }

    function setupRowExpanderListener() {
        $('#storageTable tbody').on('click', 'td.details-control', function () {

            var tr = $(this).closest('tr');
            var row = storageTable.row( tr );

            if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(row.data()) ).show();
                tr.addClass('shown');
            }
        });
    }

    /* Formatting function for row details - modify as you need */
    function format ( d ) {
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+      
            '<tr>'+        
                '<td>Project id:</td>'+
                '<td>'+d.project_id+'</td>'+
            '</tr>'+  
            '<tr>'+        
                '<td>Project name:</td>'+
                '<td>'+d.project_name+'</td>'+
            '</tr>'+         
            '<tr>'+        
                '<td>Project start date:</td>'+
                '<td>'+d.project_start+'</td>'+
            '</tr>'+ 
            '<tr>'+        
                '<td>Project end date:</td>'+
                '<td>'+d.project_end+'</td>'+
            '</tr>'+   
            '<tr>'+        
                '<td>Expected storage:</td>'+
                '<td>'+d.expected_storage+'</td>'+
            '</tr>'+                       
            '<tr>'+        
                '<td>Expected storage cost:</td>'+
                '<td>'+d.expected_storage_cost+'</td>'+
            '</tr>'+                       
            '<tr>'+        
                '<td>Dataset pid:</td>'+
                '<td>'+d.dataset_pid+'</td>'+
            '</tr>'+  
            '<tr>'+        
                '<td>Dataset id:</td>'+
                '<td>'+d.dataset_id+'</td>'+
            '</tr>'+              
            '</tr>'+        
                '<td>Dataset size:</td>'+
                '<td>'+d.dataset_size+'</td>'+
            '</tr>'+      
        '</table>';
    }

    return {
        init: init,
    };
}();
// input - array of objects
// output - 'data' hash containing array of objects
function toDataTablesFormat(data) {
	hash = {};
	hash['data'] = data;
	return hash;
}