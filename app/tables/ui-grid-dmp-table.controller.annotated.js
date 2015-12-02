app.controller('uiGridDmpTableCtrl', ['$scope', '$rootScope', '$http', 'api', 'ui', 'config', '$q', '$interval', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
    $scope.dataLoaded = false;

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
        var params = {
            date:               'project_start',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.dmps(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            $scope.dataLoaded = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
        });
    }

    api.uri.dmps({modifiable: true}).success(function (data) {
        console.log('modifiables ', data);
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
        //gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
            //Do your REST call here via $http.get or $http.post
            //if (newValue != oldValue){
            //    var params = {
            //        project_id: rowEntity.project_id,
            //        has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
            //    };
            //    api.uri.put.dmps(params);
            //}
                // assumes a particular cell!
                //response = api.uri.project(rowEntity);
                //alert("POST (mock) to " + response);
                //console.log('Going to update ', rowEntity); //
            //curl -X PUT -s 'http://lib-dmao.lancs.ac.uk:8090/dmaonline/v0.3/c/d_lancaster/f8071b41d994e4557591bb3d3a148707820d7ee1e0310196e70ae8aa/project_dmps_view_put?project_id=1&has_dmp_been_reviewed=yes'
            //var request = 'http://lib-dmao.lancs.ac.uk:8090/dmaonline/v0.3/c/d_lancaster/f8071b41d994e4557591bb3d3a148707820d7ee1e0310196e70ae8aa/project_dmps_view_put?';
            //var data = {
            //  project_id: rowEntity.project_id,
            //  has_dmp_been_reviewed: newValue
            //};
            //request += 'project_id=' + rowEntity.project_id;
            //request += '&has_dmp_been_reviewed=yes';
            //console.log(request, data);

            //console.log(api.getKey('d_lancaster', 'letmein'));

            //response = api.uri.put.dmps(data);
            //console.log('response ' , response);


            //$http.put(request + data).
            //    success(function (data, status, headers) {
            //        console.log('SUCCESS', status, data);
            //    })
            //    .error(function (data, status, header, config) {
            //        console.log('FAILURE', status, data);
            //    });
            //Alert to show what info about the edit is available
            //alert('Project ' + rowEntity.project_name + '. You changed ' +
            //' column ' + colDef.name + ' from ' + oldValue + ' to ' + newValue + '.');
        //});
    };


    // saving begin
    //$scope.saveRow = function( rowEntity ) {
    //    //rowEntity.expected_storage = abs(rowEntity.expected_storage) // prevent negative
    //    console.log('Look ma I is faking a save!', rowEntity);
    //    // create a fake promise - normally you'd use the promise returned by $http or $resource
    //    var promise = $q.defer();
    //
    //    $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
    //
    //    // fake a delay of 3 seconds whilst the save occurs, return error if length <=0
    //    $interval( function() {
    //        if (rowEntity.has_dmp_been_reviewed.length > 0){ // need to use constraints
    //            promise.reject();
    //                    } else {
    //            promise.resolve();
    //        }
    //    }, 3000, 1);
    //};

    $scope.saveRow = function( rowEntity ) {

        var spinner = ui.spinner('loader');

        var params = {
            project_id: rowEntity.project_id,
            has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.dmps(params);
        console.log('promise ', promise);
        //Cannot use promise.promise with exernal jquery api call
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );

        // fake a delay of 3 seconds
        //$interval( function() {
            //Cannot use promise.reject() and promise.resolve() with exernal jquery api call
            promise.success(function(data){
                console.log('promise SUCCESS');

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


}]);





