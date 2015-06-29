var Datasets = function() {
    var DatasetsTable;

    var init = function() {
        setupTable();
        setupRowExpanderListener();
    };
    return {
        init: init,
    };
}();

function setupTable() {
    $.ajax({

        // url: "http://lib-ldiv.lancs.ac.uk:8080/dmaonline/use_case_5/lancaster/", 
        
        url: getUrl({use_case_code:"1", institution:"lancaster"}),
        success: function(json){

            var hash = toDataTablesFormat(json);

            datasetsTable = $('#datasetsTable').DataTable( {
                data: hash['data'],
                dom: 'ClfrtipR', // drag n drop reorder
                columns: [
                    {
                        data:           null,
                        className:      'details-control',
                        orderable:      false,                      
                        defaultContent: ''
                    }, 
                    { data: 'dataset_name' },
                    { data: 'funder_name' },
                    { data: 'dataset_pid' },
                    { data: 'lead_faculty_abbrev' },
                    { data: 'lead_dept_name' },
                    { data: 'project_name' },
                    { data: 'project_start' },
                    { data: 'project_end' },
                ]
            });
        }
    });
}

function setupRowExpanderListener() {
    $('#datasetsTable tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = datasetsTable.row( tr );

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
            '<td>Funder id:</td>'+
            '<td>'+d.funder_id+'</td>'+
        '</tr>'+         
        '<tr>'+
            '<td>Funder name:</td>'+
            '<td>'+d.funder_name+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Dataset id:</td>'+
            '<td>'+d.dataset_id+'</td>'+
        '</tr>'+          
        '<tr>'+        
            '<td>Dataset pid:</td>'+
            '<td>'+d.dataset_pid+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Dataset link:</td>'+
            '<td>'+d.dataset_link+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Dataset size:</td>'+
            '<td>'+d.dataset_size+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Dataset name:</td>'+
            '<td>'+d.dataset_name+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Dataset notes:</td>'+
            '<td>'+d.dataset_notes+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Storage location:</td>'+
            '<td>'+d.storage_location+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Lead faculty id:</td>'+
            '<td>'+d.lead_faculty_id+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Lead faculty abbreviation:</td>'+
            '<td>'+d.lead_faculty_abbrev+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Lead faculty name:</td>'+
            '<td>'+d.lead_faculty_name+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Lead department id:</td>'+
            '<td>'+d.lead_department_id+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Lead department abbrev:</td>'+
            '<td>'+d.lead_dept_abbrev+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Lead department name:</td>'+
            '<td>'+d.lead_dept_name+'</td>'+
        '</tr>'+  
    '</table>';
}