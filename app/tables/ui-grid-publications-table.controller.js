angular.module('dmaoApp').controller('uiGridPublicationsTableCtrl', function($scope, $rootScope, $http, api, ui, config, $q, $interval){
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
        rowHeight: 70,

        //exporting begin
        enableSelectAll: true,
        exporterCsvFilename: 'publications-editor.csv',
        exporterPdfDefaultStyle: {fontSize: 8},
        exporterPdfTableStyle: {margin: [0, 15, 0, 5]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'black'},
        exporterPdfHeader: { text: "Publications editor", style: 'headerStyle' },
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
            name: 'inst_pub_title',
            displayName: 'Publication',
            width: 150,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'project_name',
            displayName: 'Project',
            width: 90,
            enableCellEdit: false,
            enableFiltering: false
        },
        // {
        //     name: 'cris_id',
        //     displayName: 'CRIS ID',
        //     width: 90,
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        {
            name: 'data_access_statement',
            displayName: 'Access statement',
            width: 140,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'},
                {id: 3, value: 'partial'},
                {id: 4, value: 'no_fulltext'}
            ]
        },
        {
            name: 'data_access_statement_notes',
            displayName: 'Access statement notes',
            width: 220,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editableCellTemplate: '<textarea rows="3" style="width:100%" ng-class="col.uid" ui-grid-editor ng-model="MODEL_COL_FIELD"></textarea>'
        },
        {
            name: 'dataset_pid',
            displayName: 'Dataset PID',
            width: 250,
            enableCellEdit: false,
            enableFiltering: false
        },
        // {
        //     name: 'has_dataset_pid',
        //     displayName: 'Dataset PID?',
        //     width: 120,
        //     headerCellClass: 'columnEditableHeaderCell',
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        // {
        //     name: 'inst_id',
        //     displayName: 'Institution ID',
        //     width: 50,
        //     enableCellEdit: false,
        //     enableFiltering: false
        // },
        {
            name: 'inst_pub_status',
            displayName: 'Pub status',
            width: 100,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'inst_pub_type',
            displayName: 'Pub type',
            width: 100,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'faculty_abbreviation',
            displayName: 'Lead Faculty',
            width: 120,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'department_name',
            displayName: 'Lead Dept',
            width: 110,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'funder_compliant',
            displayName: 'RCUK compliant',
            width: 140,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'},
                {id: 3, value: 'partial'}
            ]
        },
        {
            name: 'is_funded',
            displayName: 'Funded',
            width: 80,
            headerCellClass: 'columnEditableHeaderCell',
            enableCellEdit: true,
            enableFiltering: false,
            editDropdownIdLabel: 'value',
            editDropdownValueLabel: 'value',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            editDropdownOptionsArray: [
                {id: 1, value: 'y'},
                {id: 2, value: 'n'}
            ]
        },
        {
            name: 'is_rcuk_funder',
            displayName: 'RCUK',
            width: 70,
            enableCellEdit: false,
            enableFiltering: false
        },
        {
            name: 'funder_name',
            displayName: 'Funder',
            width: 150,
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
            date:               'publication_date',
            sd:                 message.startDate,
            ed:                 message.endDate,
            faculty:            message.faculty,
        };
        api.uri.publications(params).then(function(data){
            //console.log('Datasets ' + uri);
            //console.log(data);
            //$scope.dataLoaded = true;
            $scope.dataFetched = true;
            $scope.gridOptions.data = data;
            $scope.$apply();
            spinner.stop();
        });
    }

    api.uri.publications({modifiable: true}).success(function (data) {
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
            publication_id: rowEntity.publication_id,
            data_access_statement: rowEntity.data_access_statement,
            data_access_statement_notes: rowEntity.data_access_statement_notes,
            funder_compliant: rowEntity.funder_compliant


            // project_id: rowEntity.project_id,
            // has_dmp_been_reviewed: rowEntity.has_dmp_been_reviewed
        };

        // create a fake promise - normally you'd use the promise returned by $http or $resource
        //var promise = $q.defer();
        var promise = api.uri.put.publications(params);
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





