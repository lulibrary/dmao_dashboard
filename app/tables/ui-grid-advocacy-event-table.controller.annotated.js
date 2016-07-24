angular.module('dmaoApp').controller('uiGridAdvocacyEventTableCtrl', ['$scope', '$rootScope', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, api, ui, config, $q, $interval){
    var params = {
        // startDate:          config.startDate,
        // endDate:            config.endDate,
        // faculty:            config.faculty,
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
        exporterCsvFilename: 'AdvocacyEvent.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Advocacy Event", style: 'headerStyle' },
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
            name: 'session_date',
            displayName: 'Date',
            width: 80,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'session_type',
            displayName: 'Type',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'ast_name',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            // editDropdownOptionsArray: [
            //     {id: 1, value: 'look'},
            //     {id: 2, value: 'me'},
            //     {id: 3, value: 'up'}
            // ]
        },
        {
            name: 'session_content',
            displayName: 'Content',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'notes',
            displayName: 'Notes',
            width: 200,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        },
        {
            name: 'num_participants',
            displayName: 'Participants',
            width: 100,
            headerCellClass: 'columnEditableHeaderCell',
            cellClass: 'columnEditableCellContents',
            enableCellEdit: true
        }
    ];

    update(params);

    function update(message){
        $scope.dataFetched = false;
        var spinner = ui.spinner('loader');
        api.uri.advocacyEvents(params).then(function(data){
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    $scope.gridOptions.onRegisterApi = function(gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;

        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);

        gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //console.log('Changing ', colDef, newValue, oldValue);
            $scope.modifications[colDef.name] = {old: oldValue, new: newValue};
            // console.log('rowEntity afterCellEdit ', rowEntity );
        });
    };

    // saving begin
    $scope.saveRow = function( rowEntity ) {
        var spinner = ui.spinner('loader');

        //console.log('rowEntity ', rowEntity);

        var params = {};
        var data = {
            ast_name: rowEntity.ast_name,
            inst_id: rowEntity.inst_id
        };
        data['pkey:ast_id'] = rowEntity.ast_id;
        arr = [];
        arr.push(data);
        params['data'] = arr;

        //console.log('params ', params);

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.advocacySessionTypes(params);
        // console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
            //Cannot use promise.reject() and promise.resolve() with external jquery api call
            promise.success(function(data){
                // console.log('promise SUCCESS');
                $scope.modifications = {};
                rowEntity.ast_name = data[1].ast_name;
                //console.log('rowEntity ', rowEntity );

                //needed as promise is not an angular promise and there is no promise.resolve()
                $scope.gridApi.rowEdit.flushDirtyRows($scope.gridApi.grid);

                spinner.stop();
            });
            promise.error(function(data){
                alert('Error whilst saving data to server');
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
            values.push(currentSelection[i].row.entity[currentSelection[i].col.name]);
        }
        $scope.printSelection = values.toString();
    };

    $scope.scrollTo = function( rowIndex, colIndex ) {
        $scope.gridApi.core.scrollTo( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.scrollToFocus = function( rowIndex, colIndex ) {
        $scope.gridApi.cellNav.scrollToFocus( $scope.gridOptions.data[rowIndex], $scope.gridOptions.columnDefs[colIndex]);
    };

    $scope.addRow = function() {
        var n = $scope.gridOptions.data.length + 1;
        var params = {};
        var data = {
            // ast_name: 'Session Type ' + n,
            // ast_name: 1,
            inst_id: config.institutionId
            // session_date:
        };
        arr = [];
        arr.push(data);
        params['data'] = arr;

        var promise = api.uri.post.advocacyEvents(params);
        promise.success(function(data){
            // $scope.gridOptions.data.push( { ast_name: 'Change me ' });
            update();
        });
        promise.error(function(data){
            update();
            alert('Error whilst saving data to server');
        });
    };

    $scope.removeRow = function(thing){
        params = {};
        var rowCol = $scope.gridApi.cellNav.getFocusedCell();
        params.ast_id = rowCol.row.entity.ast_id;
        api.uri.delete.advocacySessionTypes(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                update();
            }
        });
    };


    function setupSessionTypes() {
        // harcoded column position!
        console.log($scope.gridOptions.columnDefs[1].editDropdownOptionsArray);
        var spinner = ui.spinner('loader');
        var sessionTypes = [];
        api.uri.advocacySessionTypes().then(function(data){
            for (var i=0; i<data.length; ++i){
                o = {};
                o['id'] = i+1;
                o['value'] = data[i].ast_id
                o['ast_name'] = data[i].ast_name;
                sessionTypes.push(o);
            }
            $scope.gridOptions.columnDefs[1].editDropdownOptionsArray = sessionTypes;
            $scope.$apply();
            spinner.stop();
            console.log($scope.gridOptions.columnDefs[1].editDropdownOptionsArray);
        });
    }

    setupSessionTypes();

}]);

