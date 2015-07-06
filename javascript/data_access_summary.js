var DataAccessSummary = function(delay){    
    var params = {  dateFilter: 'project_start',
                    startDate: App.startDate, 
                    endDate: App.endDate,
            };
    var update = function(params) {
        console.log(' DataAccessSummary updating using ', params)
        var uri = ApiService.uri.datasetAccessByDateRange(params);
        console.log('data access ' + uri);
        $.get(uri)
        .success(function(data) {
            var filteredData = ApiService.filter.datasetAccess(data, 'data_download');
            var count = 0;
            for(i=0;i<filteredData.length;++i) {
                count += filteredData[i].counter;
            }
            // only update if dirty
            if (count != $('#dataAccess').html())
                $('#dataAccess').html(count);
        });
    };

    update(params);
    setInterval(update, delay);

    return {
        update: update
    };
};