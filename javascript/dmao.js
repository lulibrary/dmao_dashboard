var institutionId = 'lancaster';

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
            var uri = URI(ApiService.prefix() + '/datasets' + '/' + institutionId);
            return uri;
        },
        datasetsByDateRange: function(params){
            var uri = this.datasets();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },
        dmps: function(){
            var uri = URI(ApiService.prefix() + '/dmps' + '/' + institutionId);
            return uri;
        },
        dmpsByDateRange: function(params){
            var uri = this.dmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },        
        noDmps: function(){
            var uri = URI(ApiService.prefix() + '/nodmps' + '/' + institutionId);
            return uri;
        },
        noDmpsByDateRange: function(params){
            var uri = this.noDmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        dmpStatus: function(){
            var uri = URI(ApiService.prefix() + '/dmp_status' + '/' + institutionId);
            return uri;
        },
        dmpStatusByDateRange: function(params){
            var uri = this.dmpStatus();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        expectedStorage: function(){
            var uri = URI(ApiService.prefix() + '/expected_storage' + '/' + institutionId);
            return uri;
        },
        expectedStorageByDateRange: function(params){
            var uri = this.expectedStorage();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },    
        rcukAccessCompliance: function(){
            var uri = URI(ApiService.prefix() + '/rcuk_as' + '/' + institutionId);
            return uri;
        },
        rcukAccessComplianceByDateRange: function(params){
            var uri = this.rcukAccessCompliance();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },  
        datasetAccess: function(){
            var uri = URI(ApiService.prefix() + '/dataset_accesses' + '/' + institutionId);
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