    $('#reportrange span').html(moment(App.startDate, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(App.endDate, "YYYYMMDD").format('MMMM D, YYYY'));

    $('#reportrange').daterangepicker({
        format: 'DD/MM/YYYY',
        startDate: moment(App.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
        endDate: moment(App.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
        minDate: '01/01/2000',
        maxDate: '31/12/9999',
        dateLimit: { days: 100000 },
        showDropdowns: true,
        showWeekNumbers: true,
        timePicker: false,
        timePickerIncrement: 1,
        timePicker12Hour: true,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        opens: 'left',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        cancelClass: 'btn-default',
        separator: ' to ',
        locale: {
            applyLabel: 'Submit',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            customRangeLabel: 'Custom',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            firstDay: 1
        }
    }, function(start, end, label) {
        // console.log(start.toISOString(), end.toISOString(), label);        
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        // console.log('option has been selected');
        var startDate = start.format('YYYYMMDD');
        var endDate = end.format('YYYYMMDD');

        // console.log(startDate, endDate);
           
        App.startDate = startDate;
        App.endDate = endDate;

        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.startDate = startDate;
            scope.endDate = endDate;
        });

        // console.log('after date selection ', App.startDate, App.endDate);
    });

   $('.applyBtn').click(function() {
        // console.log( $('input[name="daterangepicker_start"]').val() );
        // console.log( 'ado format ' + $('input[name="daterangepicker_start"]').format('YYYYMMDD').val() );
        var startDateUI = $('input[name="daterangepicker_start"]').val();
        var startDate = moment(startDateUI, "DD/MM/YYYY").format('YYYYMMDD')
        var endDateUI = $('input[name="daterangepicker_end"]').val();
        var endDate = moment(endDateUI, "DD/MM/YYYY").format('YYYYMMDD')
        // console.log('Button click formatted startDate ' + startDate );
        // console.log(startDate, endDate);  
        App.startDate = startDate;
        App.endDate = endDate;
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function(){
            scope.startDate = startDate;
            scope.endDate = endDate;
        });         
    });