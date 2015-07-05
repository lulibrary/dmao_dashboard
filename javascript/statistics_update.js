var StatisticsUpdate = function(){

    var DmaoSummaryUpdate = function(){
        console.log('DmaoSummaryUpdate');
        dataAccessUpdate();
        metadataAccessUpdate();
    }

    setIntervals();

    function setIntervals(){
        var delay = 6000;
        setInterval(dataAccessUpdate,delay);
        setInterval(metadataAccessUpdate, delay);
    }

    return {
        dataAccessUpdate: function() {
            var params = {  dateFilter: 'project_start',
                            startDate: App.startDate, 
                            endDate: App.endDate,
                        };
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
        },

        metadataAccessUpdate: function() {
            var params = {  dateFilter: 'project_start',
                            startDate: App.startDate, 
                            endDate: App.endDate,
                        };
            var uri = ApiService.uri.datasetAccessByDateRange(params);
            console.log('metadata access ' + uri);
            $.get(uri)
            .success(function(data) {
                var filteredData = ApiService.filter.datasetAccess(data, 'metadata');
                var count = 0;
                for(i=0;i<filteredData.length;++i) {
                    count += filteredData[i].counter;
                }
                // only update if dirty
                if (count != $('#metadataAccess').html())
                    $('#metadataAccess').html(count);
            });
        },
    };
};