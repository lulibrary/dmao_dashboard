var DmpStatus = function() {
    var dmpStatusTable;

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
        url: ApiService.uri.dmpStatus(),
        success: function(json){

            var hash = toDataTablesFormat(json);

            dmpStatusTable = $('#dmpStatusTable').DataTable( {
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
                    { data: 'funder_id' },
                    { data: 'dmp_stage' },
                    { data: 'dmp_status' },
                    { data: 'project_start' },
                    { data: 'project_end' },

                ]
            });
        }
    });
}

function setupRowExpanderListener() {
    $('#dmpStatusTable tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = dmpStatusTable.row( tr );

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
            '<td>Funder project code:</td>'+
            '<td>'+d.funder_project_code+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Is awarded:</td>'+
            '<td>'+d.is_awarded+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Institution id:</td>'+
            '<td>'+d.inst_id+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Institution project code:</td>'+
            '<td>'+d.institution_project_code+'</td>'+
        '</tr>'+
        '<tr>'+        
            '<td>Data management plan id:</td>'+
            '<td>'+d.dmp_id+'</td>'+
        '</tr>'+     
        '<tr>'+        
            '<td>Has data management plan been reviewed:</td>'+
            '<td>'+d.has_dmp_been_reviewed+'</td>'+
        '</tr>'+
        '</tr>'+        
            '<td>Expected storage:</td>'+
            '<td>'+d.expected_storage+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Lead faculty id:</td>'+
            '<td>'+d.lead_faculty_id+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Lead department id:</td>'+
            '<td>'+d.lead_department_id+'</td>'+
        '</tr>'+ 
        '<tr>'+        
            '<td>Data management plan source system id:</td>'+
            '<td>'+d.dmp_source_system_id+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Data management plan stage:</td>'+
            '<td>'+d.dmp_stage+'</td>'+
        '</tr>'+        
        '<tr>'+        
            '<td>Data management plan status:</td>'+
            '<td>'+d.dmp_status+'</td>'+
        '</tr>'+    
    '</table>';
}