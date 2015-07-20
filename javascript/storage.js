var Storage = function() {
    var storageTable;

    var init = function() {
        setupTable();
        setupRowExpanderListener();
    };

    function setupTable() {
        var params = {  date:       'project_start',
                        sd:         App.startDate, 
                        ed:         App.endDate,
                        faculty:    App.faculty,
                    };    
        // console.log('tables params', params);
        // console.log('App', App);

        ApiService.uri.storage(params).then(function(json){

            var hash = toDataTablesFormat(json);

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