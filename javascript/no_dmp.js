var NoDmp = function() {
    var noDmpTable;

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
        url: ApiService.uri.noDmps(),
        success: function(json){

            var hash = toDataTablesFormat(json);

            noDmpTable = $('#noDmpTable').DataTable( {
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
                    { data: 'lead_faculty_abbrev' },
                    { data: 'lead_dept_name' },
                ]
            });
        }
    });
}

function setupRowExpanderListener() {
    $('#noDmpTable tbody').on('click', 'td.details-control', function () {

        var tr = $(this).closest('tr');
        var row = noDmpTable.row( tr );

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
            '<td>Has data management plan:</td>'+
            '<td>'+d.has_dmp+'</td>'+
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