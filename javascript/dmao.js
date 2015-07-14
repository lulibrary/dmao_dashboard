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
        1: 'FASS',
        2: 'FST',
        3: 'FHM',
        4: 'LUMS'
    },
    updateDelay: 600000,
    dataAccessResponseData: {},
    metadataAccessResponseData: {},
    setFaculty: function(faculty){
        this.faculty = faculty;
        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.faculty = faculty;
        });
    },
    initUserSelections: function(){
        // update globals
        this.faculty = this.facultyDefault;
        this.startDate = this.startDateDefault;
        this.endDate = this.endDateDefault;

        // tell jQuery daterangepicker
        $('#reportrange').data('daterangepicker').setStartDate(moment(this.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange').data('daterangepicker').setEndDate(moment(this.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange span').html(moment(this.startDateDefault, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(this.endDateDefault, "YYYYMMDD").format('MMMM D, YYYY'));

        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.faculty = App.faculty;
            scope.startDate = App.startDateDefault;
            scope.endDate = App.endDateDefault;
        });
    }
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
            // if (params.dateFilter){
            //     uri.addSearch("date", params.dateFilter);
            //     uri.addSearch("sd", params.startDate);
            //     uri.addSearch("ed", params.endDate);                
            // }
            // if (params.faculty){
            //     uri.addSearch("faculty", params.faculty);
            // }   
            // if (params.filter){
            //     uri.addSearch("filter", params.filter);
            // }              
            // if (params.count){
            //     uri.addSearch("count", params.count);
            // }                      
            return uri;
        },
        addDateRange: function(uri, params)
        {
            uri.addSearch("date", params.dateFilter);
            uri.addSearch("sd", params.startDate);
            uri.addSearch("ed", params.endDate);
            return uri;
        },
        addFaculty: function(uri, param){
            uri.addSearch("faculty", params.faculty);
            return uri;
        },
        datasets: function(params){           
            var uri = URI(ApiService.prefix() + '/datasets' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        // datasetsByDateRange: function(params){
        //     var uri = this.datasets(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     // return uriWithDateRange;
        //     return uri;
        // },
        dmps: function(params){
            var uri = URI(ApiService.prefix() + '/project_dmps' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },
        // dmpsByDateRange: function(params){
        //     var uri = this.dmps(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     return uri;
        // },        
        // noDmps: function(params){
        //     var uri = URI(ApiService.prefix() + '/project_dmps' + '/' + App.institutionId);
        //     if (params){
        //         uri = this.addParams(uri, params);
        //     }
        //     return uri;
        // },
        // noDmpsByDateRange: function(params){
        //     var uri = this.noDmps(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     return uri;
        // },   
        dmpStatus: function(params){
            var uri = URI(ApiService.prefix() + '/dmp_status' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },
        // dmpStatusByDateRange: function(params){
        //     var uri = this.dmpStatus(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     return uri;
        // },   
        storage: function(params){
            var uri = URI(ApiService.prefix() + '/storage' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        // expectedStorageByDateRange: function(params){
        //     var uri = this.expectedStorage(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     return uri;
        // },    
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/rcuk_as' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },
        // rcukAccessComplianceByDateRange: function(params){
        //     var uri = this.rcukAccessCompliance(params);
        //     // var uriWithDateRange = this.addDateRange(uri, params);
        //     return uri;
        // },  
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