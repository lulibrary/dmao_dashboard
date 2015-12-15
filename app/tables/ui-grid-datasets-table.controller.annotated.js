app.controller('uiGridDatasetsTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    //$scope.dataLoaded = false;

    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
        rowEditWaitInterval: 1,  // ms before row is 'saved'
        enableGridMenu: true,
        //showGridFooter: true,
        rowHeight: 35,
        enableColumnResizing: true,
        //enableCellEditOnFocus: true,
        enableFiltering: true,
        //rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'datasets.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "All datasets", style: 'headerStyle' },
        exporterPdfFooter: function ( currentPage, pageCount ) {
            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };
        },
        exporterPdfCustomFormatter: function ( docDefinition ) {
            docDefinition.styles.headerStyle = { fontSize: 22, bold: true, margin: [340, 0, 20, 0] };
            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, margin: [400, 0, 20, 0] };
            return docDefinition;
        },
        exporterPdfOrientation: 'landscape',
        exporterPdfPageSize: 'A4',
        exporterPdfMaxGridWidth: 700,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        //exporting end
    };

    $scope.gridOptions.columnDefs = [
        {
            name: 'dataset_name',
            displayName: 'Dataset',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 80,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_faculty_abbrev',
            displayName: 'Lead Faculty',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'lead_dept_name',
            displayName: 'Lead Dept',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        {
            name: 'project_start',
            displayName: 'Project Start',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_end',
            displayName: 'Project End',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    //console.log('$scope.gridOptions.columnDefs ', $scope.gridOptions.columnDefs);

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.datasets(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
    };

    //cell navigation begin
    $scope.currentFocused = "";

    $scope.getCurrentFocus = function(){
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        if(rowCol !== null) {
            $scope.currentFocused = 'Row Id:' + rowCol.row.entity.id + ' col:' + rowCol.col.colDef.name;
        }
    };

    $scope.getCurrentSelection = function() {
        var values = [];
        var currentSelection = $scope.gridApi.cellNav.getCurrentSelection();
        for (var i = 0; i < currentSelection.length; i++) {
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name])
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };
    //cell navigation end



    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });


}]);





