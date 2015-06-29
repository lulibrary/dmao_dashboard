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
    template: {
        dr: '/dr/{institutionId}/{startDate}/{endDate}/{dateFilter}'
    },
};