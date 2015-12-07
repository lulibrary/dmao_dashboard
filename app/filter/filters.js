var DMAOFilters = (function(){    
    var config = {};

    var init = function(gConfig){
        config = gConfig;
    };

    var DateRangePicker = function(){
        //console.log('DateRangePicker 1');
        $('#reportrange span').html(moment(config.startDate, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDate, "YYYYMMDD").format('MMMM D, YYYY'));

        //console.log('DateRangePicker 2');
        $('#reportrange').daterangepicker({
            format: 'DD/MM/YYYY',
            startDate: moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
            endDate: moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'),
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
            // console.log('There has been a change by selecting a value');

            // console.log(start.toISOString(), end.toISOString(), label);
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));

            // console.log('I have updated the html with dates in the right format');

            // console.log('option has been selected');
            var startDate = start.format('YYYYMMDD');
            var endDate = end.format('YYYYMMDD');

            // console.log('I have grabbed the dates into variables');

            // console.log(startDate, endDate);
            //console.log('There has been a change by selecting a value');

            config.startDate = startDate;
            config.endDate = endDate;



            // console.log('I have assigned the dates to config');

            tellAngular(startDate, endDate);

            // console.log('What on earth is happening now?');



            // var delay = 1;
            // setTimeout(function(){
            //      console.log('I am in a timeout which has a delay of ' + delay);
            //     },
            //     delay);

            // console.log('I am listed after the timeout');
        });
        //console.log('DateRangePicker 3');

       //$('.applyBtn').click(function() {
           //console.log('datepicker applyBtn clicked');
            // console.log( $('input[name="daterangepicker_start"]').val() );
            // console.log( 'ado format ' + $('input[name="daterangepicker_start"]').format('YYYYMMDD').val() );
            //var startDateUI = $('input[name="daterangepicker_start"]').val();
            //var startDate = moment(startDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            //var endDateUI = $('input[name="daterangepicker_end"]').val();
            //var endDate = moment(endDateUI, "DD/MM/YYYY").format('YYYYMMDD')
            // console.log('Button click formatted startDate ' + startDate );
            // console.log(startDate, endDate);
           //console.log('There has been a change by clicking the button');

           // config.startDate = startDate;
           // config.endDate = endDate;
           //console.log('before angular update with date range');
           // var scope = angular.element($("#filterController")).scope();
           // scope.$apply(function(){
           //     scope.startDate = startDate;
           //     scope.endDate = endDate;
           //     console.log('scope.$apply ', scope.startDate, scope.endDate);
           // });
           //console.log('after angular update with date range');
        //});
        //console.log('DateRangePicker 4');
    };

    //var setFaculty = function(faculty){
    //    config.faculty = faculty;
    //    // tell Angular
    //    var scope = angular.element($("#filterController")).scope();
    //    scope.$apply(function(){
    //        scope.faculty = faculty;
    //    });
    //};

    var initUserSelections = function(){
        // update globals
        config.faculty = config.facultyDefault;
        config.startDate = config.startDateDefault;
        config.endDate = config.endDateDefault;

        //console.log('DateRangePicker 5');
        // tell jQuery daterangepicker
        $('#reportrange').data('daterangepicker').setStartDate(moment(config.startDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange').data('daterangepicker').setEndDate(moment(config.endDateDefault, "YYYYMMDD").format('DD/MM/YYYY'));
        $('#reportrange span').html(moment(config.startDateDefault, "YYYYMMDD").format('MMMM D, YYYY') + ' - ' + moment(config.endDateDefault, "YYYYMMDD").format('MMMM D, YYYY'));
        //console.log('DateRangePicker 6');

        // tell Angular
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function () {
            scope.faculty = config.faculty;
            scope.startDate = config.startDateDefault;
            scope.endDate = config.endDateDefault;
        });
    };

    function tellAngular(startDate, endDate){
        var scope = angular.element($("#filterController")).scope();
        scope.$apply(function() {
            scope.startDate = startDate;
            scope.endDate = endDate;
        });
    }

    return {
        init: init,
        initUserSelections: initUserSelections,
        DateRangePicker: DateRangePicker,
        //setFaculty: setFaculty
    };
})();