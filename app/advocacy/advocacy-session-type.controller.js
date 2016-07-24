angular.module('dmaoApp').controller("advocacySessionTypeCtrl", function($scope, $http, $location, $route, $routeParams, api, config, ui){

    $scope.model = {};
    $scope.things = [];

    $scope.schema = {
        type: "object",
        required: [
            'ast_name'
        ],
        properties: {
            ast_name: {
                type: 'string',
                minLength: 2,
                title: 'Name'
            }
        }
    };

    $scope.form = [
        'ast_name',
        {
            type: 'submit',
            title: 'Save'
        }
    ];

    $scope.index = function(){
        // console.log('get called');
        // load data
        var spinner = ui.spinner('loader');
        var promise = api.uri.advocacySessionTypes();
        // console.log(promise);
        promise.success(function(data){
            // console.log('promise SUCCESS');
            var download = [];
            angular.forEach(data, function(x) {
                // console.log(x);
                var o = {};
                o['ast_id'] = x['ast_id'];
                o['ast_name'] = x['ast_name'];
                o['inst_id'] = x["inst_id"];
                download.push(o);
            });
            $scope.things = download;
            $scope.$apply();
            spinner.stop();
            // console.log('tings ', $scope.things);
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.new = function(){
        $location.path('/advocacySessionTypes/new');
    };

    function create(){
        post().then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $location.path('/advocacySessionTypes');
                $scope.$apply();
            }
        });
    }

    $scope.onSubmitNew = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            create();
            // reset();
        }
    };

    function post(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.ast_name = thing.ast_name;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        return api.uri.post.advocacySessionTypes(params);
    }

    $scope.edit = function(){
        var spinner = ui.spinner('loader');
        // var params = { 'ast_id': $routeParams.id };
        var promise = api.uri.advocacySessionTypes();
        promise.success(function(data){
            // console.log(data);

            angular.forEach(data, function(x) {// console.log(x);
                // console.log(x);
                if (x.ast_id == $routeParams.id) {
                    // console.log('yay');
                    $scope.model = x;
                    $scope.$apply();
                    spinner.stop();
                }
            });
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    function put(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o['pkey:ast_id'] = thing.ast_id;
        o.inst_id = config.institutionId;
        o.ast_name = thing.ast_name;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        return api.uri.put.advocacySessionTypes(params);
    }

    $scope.onSubmitEdit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            put().then(function(data){
                $location.path('/advocacySessionTypes');
                $scope.$apply();
            });
        }
    };

    $scope.destroy = function(thing){
        var params = {};
        params.ast_id = thing.ast_id;
        api.uri.delete.advocacySessionTypes(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $route.reload();
            }
        });
    };

    // function reset(){
    //     $scope.model = {};
    //     $scope.form.$pristine = true;
    //     $scope.$broadcast('schemaFormRedraw');
    // }
});
