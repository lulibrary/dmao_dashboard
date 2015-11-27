app.controller('uiGridStorageTableCtrl', function($scope, $rootScope, api, ui, config, $q, $interval){
    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};
    $scope.modifications = {};

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
        exporterCsvFilename: 'storage.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Storage", style: 'headerStyle' },
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
            sort: { direction: 'asc' },
            enableCellEdit: false
        },
        {
            name: 'inst_storage_platform_id',
            displayName: 'Platform ID',
            sort: { direction: 'asc' },
            width: 120,
            enableCellEdit: false,
        },
        {
            name: 'expected_storage',
            displayName: 'Expected (GB)',
            width: 120,
            type: 'number',
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            enableFiltering: false
        },
        {
            name: 'expected_storage_cost',
            displayName: 'Expected Cost',
            width: 120,
            cellFilter: 'number: 2',
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'dataset_size',
            displayName: 'Dataset Size (GB)',
            width: 140,
            enableCellEdit: false,
            enableFiltering: false
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
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 300,
            enableCellEdit: false,
            enableFiltering: false
        }
    ];

    update(params);

    function update(message){
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.storage(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log('Data ', data);
            //$scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            $scope.gridOptions.data = data;
            $scope.$apply();
        });
    }

    api.uri.storage({modifiable: true}).success(function (data) {
        //console.log('modifiables ', data);
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

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //console.log('Changing ', colDef, newValue, oldValue);
            $scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            //console.log('$scope.modifications', $scope.modifications);
            console.log('rowEntity afterCellEdit ', rowEntity );
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        var spinner = ui.spinner('loader');

        //console.log('rowEntity ', rowEntity);
        var old_inst_storage_platform_id = '';
        if ($scope.modifications['inst_storage_platform_id']) {
            old_inst_storage_platform_id = $scope.modifications['inst_storage_platform_id'].old;
        }
        else {
            old_inst_storage_platform_id = rowEntity.inst_storage_platform_id;
        }

        var params = {
            old_inst_storage_platform_id: old_inst_storage_platform_id,
            inst_storage_platform_id: rowEntity.inst_storage_platform_id,
            expected_storage: rowEntity.expected_storage.toString(),
            project_id: rowEntity.project_id
        };

        //console.log('params ', params);

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.storage(params);
        console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        console.log('after setSavePromise ');
        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with external jquery api call
            promise.success(function(data){
                console.log('promise SUCCESS');
                $scope.modifications = {};
                rowEntity.expected_storage_cost = data[1][0].expected_storage_cost;
                //console.log('rowEntity ', rowEntity );

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                spinner.stop();
            });
            promise.error(function(data){
                alert('Error whilst saving data to server');
                //console.log('promise ERROR');
                //alert('Invalid input data:   ' + rowEntity.expected_storage +
                //'\n\nPermitted values:   ' + $scope.modifiable_column_constraints.expected_storage.replace(/\|/g, ', '));
                spinner.stop();
            });
        //}, 10, 1);
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

    // editing begin
    //$scope.addData = function() {
    //    var n = $scope.gridOptions.data.length + 1;
    //    $scope.gridOptions.data.push({
    //        "project_name": "a new project " + n,
    //        "inst_storage_platform_id": "Storage Platform ",
    //        "expected_storage": 0,
    //        "project_id": n
    //    });
    //};
    // editing end


    $scope.filterEventListener = $rootScope.$on("FilterEvent", function (event, message) {
        //update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
});

