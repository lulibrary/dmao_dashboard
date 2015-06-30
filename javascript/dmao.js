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
            var uri = URI(ApiService.prefix() + '/use_case_1' + '/' + institutionId);
            return uri;
        },
        datasetsByDateRange: function(params){
            var uri = this.datasets();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },
        dmps: function(){
            var uri = URI(ApiService.prefix() + '/use_case_2a' + '/' + institutionId);
            return uri;
        },
        dmpsByDateRange: function(params){
            var uri = this.dmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },        
        noDmps: function(){
            var uri = URI(ApiService.prefix() + '/use_case_2b' + '/' + institutionId);
            return uri;
        },
        noDmpsByDateRange: function(params){
            var uri = this.noDmps();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        dmpStatus: function(){
            var uri = URI(ApiService.prefix() + '/use_case_3' + '/' + institutionId);
            return uri;
        },
        dmpStatusByDateRange: function(params){
            var uri = this.dmpStatus();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },   
        expectedStorage: function(){
            var uri = URI(ApiService.prefix() + '/use_case_4' + '/' + institutionId);
            return uri;
        },
        expectedStorageByDateRange: function(params){
            var uri = this.expectedStorage();
            var uriWithDateRange = this.addDateRange(uri, params);
            return uriWithDateRange;
        },    
        rcukAccessCompliance: function(){
            var uri = URI(ApiService.prefix() + '/use_case_5' + '/' + institutionId);
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
    template: {
        dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    },
};