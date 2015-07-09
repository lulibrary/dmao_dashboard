var RcukAccessCompliance = function() {
    var rcukAccessComplianceTable;

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
        url: ApiService.uri.rcukAccessCompliance(),
        success: function(json){

            var hash = toDataTablesFormat(json);

            rcukAccessComplianceTable = $('#rcukAccessComplianceTable').DataTable( {
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
                    { data: 'publication_pid' },
                    { data: 'publication_date' },
                    { data: 'data_access_statement' },
                    { data: 'funder_name' },
                    { data: 'project_name' },
                ]
            });
        }
    });
}

function setupRowExpanderListener() {
    $('#rcukAccessComplianceTable tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = rcukAccessComplianceTable.row( tr );

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
            '<td>Publication id:</td>'+
            '<td>'+d.publication_id+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Cris id:</td>'+
            '<td>'+d.cris_id+'</td>'+
        '</tr>'+        
            '<td>Repo id:</td>'+
            '<td>'+d.repo_id+'</td>'+
        '</tr>'+    
        '</tr>'+        
            '<td>Funder project code:</td>'+
            '<td>'+d.funder_project_code+'</td>'+
        '</tr>'+ 
        '</tr>'+        
            '<td>Lead institution id:</td>'+
            '<td>'+d.lead_inst_id+'</td>'+
        '</tr>'+ 
        '</tr>'+        
            '<td>Lead faculty id:</td>'+
            '<td>'+d.lead_faculty_id+'</td>'+
        '</tr>'+ 
        '</tr>'+        
            '<td>Lead department id:</td>'+
            '<td>'+d.lead_department_id+'</td>'+
        '</tr>'+ 
        '</tr>'+        
            '<td>Publication date:</td>'+
            '<td>'+d.publication_date+'</td>'+
        '</tr>'+ 
        '<tr>'+
            '<td>Data access statement:</td>'+
            '<td>'+d.data_access_statement+'</td>'+
        '</tr>'+
        '</tr>'+        
            '<td>Funder id:</td>'+
            '<td>'+d.funder_id+'</td>'+
        '</tr>'+         
        '<tr>'+
            '<td>Funder name:</td>'+
            '<td>'+d.funder_name+'</td>'+
        '</tr>'+        
    '</table>';
}