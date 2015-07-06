var App = {
    institutionId: 'lancaster',
    startDate: '20000101',
    endDate: moment().format('YYYYMMDD'),
    faculty: '',
    updateDelay: 60000,
    setFaculty: function(faculty){
        this.faculty = faculty;
        // tell Angular
        var scope = angular.element($("#dateRangeCtrl")).scope();
        scope.$apply(function(){
            scope.faculty = faculty;
        });
    }
};

// function dataAccessUpdate() {
//     var params = {  dateFilter: 'project_start',
//                     startDate: App.startDate, 
//                     endDate: App.endDate,
//                 };
//     var uri = ApiService.uri.datasetAccessByDateRange(params);
//     console.log('data access ' + uri);
//     $.get(uri)
//     .success(function(data) {
//         var filteredData = ApiService.filter.datasetAccess(data, 'data_download');
//         var count = 0;
//         for(i=0;i<filteredData.length;++i) {
//             count += filteredData[i].counter;
//         }
//         // only update if dirty
//         if (count != $('#dataAccess').html())
//             $('#dataAccess').html(count);
//     });
// }

// function metadataAccessUpdate() {
//     var params = {  dateFilter: 'project_start',
//                     startDate: App.startDate, 
//                     endDate: App.endDate,
//                 };
//     var uri = ApiService.uri.datasetAccessByDateRange(params);
//     console.log('metadata access ' + uri);
//     $.get(uri)
//     .success(function(data) {
//         var filteredData = ApiService.filter.datasetAccess(data, 'metadata');
//         var count = 0;
//         for(i=0;i<filteredData.length;++i) {
//             count += filteredData[i].counter;
//         }
//         // only update if dirty
//         if (count != $('#metadataAccess').html())
//             $('#metadataAccess').html(count);
//     });
// }
// $(document).ready(function(){
//     $("#sd").change(function(){
//         update();
//     });
//     $("#ed").change(function(){
//         update();
//     });
// });

// function update(){
//     console.log('update');
// }







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
            if (params.dateFilter){
                uri.addSearch("date", params.dateFilter);
                uri.addSearch("sd", params.startDate);
                uri.addSearch("ed", params.endDate);                
            }
            if (params.faculty){
                uri.addSearch("faculty", params.faculty);
            }            
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
            return uri;
        },
        datasetsByDateRange: function(params){
            var uri = this.datasets(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            // return uriWithDateRange;
            return uri;
        },
        dmps: function(params){
            var uri = URI(ApiService.prefix() + '/project_dmps' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return uri;
        },
        dmpsByDateRange: function(params){
            var uri = this.dmps(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return uri;
        },        
        noDmps: function(params){
            var uri = URI(ApiService.prefix() + '/project_dmps' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return uri;
        },
        noDmpsByDateRange: function(params){
            var uri = this.noDmps(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return uri;
        },   
        dmpStatus: function(params){
            var uri = URI(ApiService.prefix() + '/dmp_status' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return uri;
        },
        dmpStatusByDateRange: function(params){
            var uri = this.dmpStatus(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return uri;
        },   
        expectedStorage: function(params){
            var uri = URI(ApiService.prefix() + '/expected_storage' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return uri;
        },
        expectedStorageByDateRange: function(params){
            var uri = this.expectedStorage(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return uri;
        },    
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/rcuk_as' + '/' + App.institutionId);
            if (params){
                uri = this.addParams(uri, params);
            }
            return uri;
        },
        rcukAccessComplianceByDateRange: function(params){
            var uri = this.rcukAccessCompliance(params);
            // var uriWithDateRange = this.addDateRange(uri, params);
            return uri;
        },  
        datasetAccess: function(){
            var uri = URI(ApiService.prefix() + '/dataset_accesses' + '/' + App.institutionId);
            return uri;
        },
        datasetAccessByDateRange: function(params){
            var uri = this.datasetAccess();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
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
    },
    template: {
        dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    },
};