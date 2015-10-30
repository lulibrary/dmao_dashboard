app.controller('uiGridStorageTableCtrl', function($scope, $rootScope, api, config, $q, $interval){
    var params = {
        startDate:          config.startDate,
        endDate:            config.endDate,
        faculty:            config.faculty,
    };

    $scope.gridOptions = {};

    $scope.gridOptions = {
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
            enableCellEdit: false
        },
        {
            name: 'expected_storage',
            displayName: 'Expected (GB)',
            width: 120,
            type: 'number',
            enableFiltering: false,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents'
        },
        {
            name: 'expected_storage_cost',
            displayName: 'Expected Cost',
            width: 120,
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
            width: 100,
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
            //console.log(data);
            $scope.gridOptions.data = data;
            $scope.$apply();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //Do your REST call here via $http.get or $http.post
            if (newValue != oldValue)
                // assumes a particular cell!
                response = api.uri.project(rowEntity);
                alert("POST (mock) to " + response);
                console.log(rowEntity); //
            //Alert to show what info about the edit is available
            //alert('Project ' + rowEntity.project_name + '. You changed ' +
            //' column ' + colDef.name + ' from ' + oldValue + ' to ' + newValue + '.');
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        //rowEntity.expected_storage = abs(rowEntity.expected_storage) // prevent negative
        console.log('Look ma I is faking a save!');
        // create a fake promise - normally you'd use the promise returned by $http or $resource
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );

        // fake a delay of 3 seconds whilst the save occurs, return error if gender is "male"
        $interval( function() {
            if (rowEntity.expected_storage < 0 ){
                promise.reject();
            } else {
                promise.resolve();
            }
        }, 3000, 1);
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
        //update(message);
    });

    $scope.$on('$destroy', function () {
        // Remove the listener
        $scope.filterEventListener();
    });
});

