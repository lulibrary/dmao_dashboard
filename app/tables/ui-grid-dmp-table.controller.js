angular.module('dmaoApp').controller('uiGridDmpTableCtrl', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
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
        exporterCsvFilename: 'dmp.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Data management plans produced", style: 'headerStyle' },
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
            name: 'project_name',
            displayName: 'Project',
            width: 250,
            enableCellEdit: false
        },
        //{
        //    name: 'lead_faculty_id',
        //    displayName: 'Lead Faculty ID',
        //    width: 110,
        //    enableCellEdit: false,
        //    enableFiltering: false
        //},
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
            name: 'dmp_id',
            displayName: 'DMP ID',
            width: 80,
            enableCellEdit: false,
            enableFiltering: false
        },
        //{
        //    name: 'has_dmp_been_reviewed',
        //    displayName: 'DMP Reviewed',
        //    width: 120,
        //    //type: 'number',
        //    enableFiltering: false,
        //    headerCellClass: 'columnEditableHeaderCell',
        //    cellClass: 'columnEditableCellContents'
        //},
        {
            name: 'has_dmp_been_reviewed',
            displayName: 'DMP Reviewed',
            width: 130,
            headerCellClass: 'columnEditableHeaderCell',
            //cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'yes'},
                {id: 2, value: 'no'},
                {id: 3, value: 'unknown'}
            ]
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
            has_dmp:            true,
            faculty:            message.faculty,
        };
        api.uri.dmps(params).then(function(data){
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
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
    };

    $scope.saveRow = function( rowEntity ) {

        var spinner = ui.spinner('loader');

        var params = {
            project_id: rowEntity.project_id,
            has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.dmps(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );

        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with exernal jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);
                spinner.stop();
            });

            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.has_dmp_been_reviewed +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.has_dmp_been_reviewed.replace(/\|/g, ', '));
                spinner.stop();
            });
            $scope.savingData = false;

        //}, 3000, 1);
    };
    // saving end




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


});





