angular.module('dmaoApp').controller('uiGridRcukAccessComplianceTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
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
        exporterCsvFilename: 'rcukAccessCompliance.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "RCUK access compliance", style: 'headerStyle' },
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
            name: 'publication_pid',
            displayName: 'Publication',
            width: 150,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'publication_date',
            displayName: 'Publication Date',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'data_access_statement',
            displayName: 'Data access statement',
            width: 180,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'rcuk_funder_compliant',
            displayName: 'RCUK funder compliant',
            width: 190,
            enableCellEdit: false,
            enableFiltering: false
        },        
        {
            name: 'funder_name',
            displayName: 'Funder name',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
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
        api.uri.rcukAccessCompliance(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        // console.log('modifiables ', data);
        $scope.modifiable_column_constraints = {};
        for (var i in data){
            $scope.modifiable_column_constraints[data[i].c_name] = data[i].c_vals;
        }
        //console.log('modifiable_column_constraints ', $scope.modifiable_column_constraints);
    });

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





