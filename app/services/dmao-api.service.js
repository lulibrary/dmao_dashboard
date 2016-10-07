var ApiService = {
    version:    'v0.3',
    apiKey:     '',
    authenticated: function(){
        if (this.apiKey){
            return true;
        }
        return false;
    },
    prefix: function() {
        // Prototype
        // http://lib-ldiv.lancs.ac.uk:8080/dmaonline/v0.2/use_case_1/lancaster?
        // date=<project_awarded|project_start|project_end>&sd=YYYYMMDD&ed=YYYYMMDD
        var uri = URI({
            protocol:   'http',
            hostname:   'lib-dmao.lancs.ac.uk',
            port:       '8070',
            path:       'dmaonline',             
        });
        uri += '/' + this.version;
        return uri.toString();
    },
    clearKey: function(){
        this.apiKey = '';
    },
    authenticate: function(institutionID, username, password){
        //console.log('this.apiKey ', this.apiKey);

        var uri = URI(ApiService.prefix() + '/o/' + institutionID + '/o_get_api_key');
        //console.log('uri ', uri);

        var shaObj = new jsSHA("SHA-224", "TEXT");
        shaObj.update(password);
        var hash = shaObj.getHash("HEX");
        //console.log('hash ', hash);

            uri = this.uri.addParams(uri, {
                    user: username,
                    passwd: hash
                });
        //console.log('uri ', uri);
        //console.log($.getJSON(uri));
        return $.getJSON(uri);
    },
    uri: {
        addParams: function(uri, params){
            for (key in params) {
                if (params[key] || params[key] === false) {
                    uri.addSearch(key, params[key]);
                }
            }                    
            return uri;
        },
        datasets: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/datasets');
            if (params) {
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        dmps: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/project_dmps');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        dmpStatus: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/dmp_status');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        }, 
        storage: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/storage');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        project: function(params){
            var uri = URI(ApiService.prefix() + '/storage' + '/'
                        + params.project_id + '/' + App.institutionId);
            if (params){
                //uri = this.addParams(uri, params);
                //var json = JSON.stringify (params)
            }
            return uri;
        },
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/rcuk_as');
            if (params){
                uri = this.addParams(uri, params);
            }
             return $.getJSON(uri);
        },  
        datasetAccess: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/dataset_accesses');
            //var uri = URI(ApiService.prefix() + '/dataset_accesses' + '/' + App.institutionId);
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
        rcukAccessCompliance: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/rcuk_as');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        divisions: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/faculties_departments');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        publications: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
            ApiService.apiKey + '/publications_editor');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        persons: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
                ApiService.apiKey + '/persons');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        advocacyEvents: function(params){
            var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' +
                ApiService.apiKey + '/advocacy_events');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        advocacySessionTypes: function(params){
            var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                ApiService.apiKey + '/advocacy_session_types');
            if (params){
                uri = this.addParams(uri, params);
            }
            return $.getJSON(uri);
        },
        put: {
            dmps: function (params) {
                //alert('ApiService.uri.put.dmps called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/project_dmps');

                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            storage: function (params) {
                //alert('ApiService.uri.put.storage called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/storage');

                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            publications: function (params) {
                //alert('ApiService.uri.put.storage called');
                var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/publications_editor');
                if (params) {
                    //uri = this.addParams(uri, params);
                    uri = ApiService.uri.addParams(uri, params);
                    // console.log('uri ', uri);
                }
                return $.ajax({
                        url: uri,
                        type: 'PUT'
                    });
            },
            advocacySessionTypes: function (params) {
                // console.log(JSON.stringify(params.data));
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy_session_types');
                return $.ajax({
                        url: uri,
                        type: 'PUT',
                        data: JSON.stringify(params.data),
                        contentType: "application/json; charset=UTF-8"
                    });
            },
            advocacyEvents: function (params) {
                // console.log(JSON.stringify(params.data));
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy');
                return $.ajax({
                        url: uri,
                        type: 'PUT',
                        data: JSON.stringify(params.data),
                        contentType: "application/json; charset=UTF-8",
                    });
            }
        },
        post: {
            advocacySessionTypes: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy_session_types');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
            advocacyEvents: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/advocacy');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
            advocacyPersons: function(params){
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey + '/map_advocacy_person');
                return $.ajax({
                        url: uri,
                        type: 'POST',
                        data: JSON.stringify(params.data),
                        contentType: "application/json"
                    });
            },
        },
        delete: {
            advocacySessionTypes: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                    ApiService.apiKey + '/advocacy_session_types' + '/' + 'ast_id' +
                    '/' + params.ast_id);

                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                });
            },
            advocacyEvents: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' +
                    ApiService.apiKey + '/advocacy' + '/' + 'event_id' +
                    '/' + params.event_id);
                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                });
            },
            advocacyPerson: function (params) {
                var uri = URI(ApiService.prefix() + '/' + App.institutionId + '/' + ApiService.apiKey +
                    '/map_advocacy_person' + '/' + 'event_id' + '/' + params.event_id + '/' + 'person_id' + '/' + params.person_id);
                return $.ajax({
                        url: uri,
                        type: 'DELETE'
                    });
            }
        },

        //modifiable: {
        //    dmps: function() {
        //        var uri = URI(ApiService.prefix() + '/c/' + App.institutionId + '/' + ApiService.apiKey + '/project_dmps_modifiable');
        //        return $.getJSON(uri);
        //    },
        //},
        o: {
            institutions: function () {
                var uri = URI(ApiService.prefix() + '/o' + '/o_inst_list');
                return $.getJSON(uri);
            }
        },
        public: function(resource) {
            var uri = URI(ApiService.prefix() + '/o' + '/' + resource);
            return $.getJSON(uri);
        },
    },
    datacite: {
        minted: function (queryString) {
            var uri = URI(queryString);
            return $.getJSON(uri);
        }
    },
    irus: {
        base_url: 'http://irus.mimas.ac.uk/api/sushilite/v1_7/GetReport',
        report: function(params) {
            var uri = URI(ApiService.irus.base_url);
            if (params){
                uri = ApiService.uri.addParams(uri, params);
            }
            return $.getJSON(uri);
        }
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