var App = {
    institutionId: 'lancaster',
    startDate:  '',
    endDate: '',
    updateDelay: 60000,
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
    defaults: {
        startDate: '20000101',
        endDate: moment().format('YYYYMMDD')
    },
    uri: {
        addDateRange: function(uri, params)
        {
            uri.addSearch("date", params.dateFilter);
            uri.addSearch("sd", params.startDate);
            uri.addSearch("ed", params.endDate);
            return uri;
        },
        datasets: function(){
            var uri = URI(ApiService.prefix() + '/datasets' + '/' + App.institutionId);
            return uri;
        },
        datasetsByDateRange: function(params){
            var uri = this.datasets();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },
        dmps: function(){
            var uri = URI(ApiService.prefix() + '/dmps' + '/' + App.institutionId);
            return uri;
        },
        dmpsByDateRange: function(params){
            var uri = this.dmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },        
        noDmps: function(){
            var uri = URI(ApiService.prefix() + '/nodmps' + '/' + App.institutionId);
            return uri;
        },
        noDmpsByDateRange: function(params){
            var uri = this.noDmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        dmpStatus: function(){
            var uri = URI(ApiService.prefix() + '/dmp_status' + '/' + App.institutionId);
            return uri;
        },
        dmpStatusByDateRange: function(params){
            var uri = this.dmpStatus();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        expectedStorage: function(){
            var uri = URI(ApiService.prefix() + '/expected_storage' + '/' + App.institutionId);
            return uri;
        },
        expectedStorageByDateRange: function(params){
            var uri = this.expectedStorage();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },    
        rcukAccessCompliance: function(){
            var uri = URI(ApiService.prefix() + '/rcuk_as' + '/' + App.institutionId);
            return uri;
        },
        rcukAccessComplianceByDateRange: function(params){
            var uri = this.rcukAccessCompliance();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
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