angular.module('dmaoApp').controller("advocacyEventCtrl", ['$scope', '$http', '$location', '$route', '$routeParams', 'api', 'config', 'ui', function($scope, $http, $location, $route, $routeParams, api, config, ui){

    $scope.things = [];
    $scope.participants = [];

    $scope.schema = {
        type: "object",
        required: [
            'session_type',
            'session_content',
            'session_date'
        ],
        properties: {
            session_type: {
                type: "integer",
                title: "Type"
            },
            num_participants: {
                type: 'integer',
                title: 'Participants',
                minimum: 0
            },
            session_content: {
                type: 'string',
                minLength: 2,
                title: 'Content'
            },
            session_date: {
                title: 'Date',
                type: 'string',
                format: 'date'
            },
            notes: {
                type: 'string',
                minLength: 2,
                title: 'Notes'
            }
        }
    };

    $scope.form = [
        {
            key: 'session_date',
            type: 'datepicker',
            format: 'yyyy-mm-dd'
        },
        {
            key: 'session_content',
            fieldHtmlClass: 'advocacyContent'
        },
        {
            key: 'session_type',
            type: 'select',
            titleMap: []
        },
        {
            key: 'notes',
            type: 'textarea',
            fieldHtmlClass: 'advocacyNotes'
        },
        {
            key: 'num_participants',
            fieldHtmlClass: 'advocacyParticipants'
        },
        {
            type: 'submit',
            title: 'Save'
        }
    ];

    $scope.model = {};

    $scope.index = function(){
        var spinner = ui.spinner('loader');
        var promise = api.uri.advocacyEvents();
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);
            var last_event_id = null;
            angular.forEach(data, function(x) {
                if (x.event_id != last_event_id){
                    $scope.things.push(x);
                    last_event_id = x.event_id;
                }
            });
            $scope.$apply();
            spinner.stop();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.show = function(){
        // console.log('show called');
        var spinner = ui.spinner('loader');
        var params = { 'event_id': $routeParams.id }
        var promise = api.uri.advocacyEvents(params);
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);
            var last_event_id = null;
            angular.forEach(data, function(x) {
                // console.log(x);
                $scope.participants.push(x);
                if (x.event_id != last_event_id){
                    $scope.things.push(x);
                    last_event_id = x.event_id;
                }
            });
            $scope.$apply();
            spinner.stop();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
            spinner.stop();
        });
    };

    $scope.new = function(){
        $location.path('/advocacy/new');
    };

    function create(){
        post().then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $location.path('/advocacy');
                $scope.$apply();
            }
        });
    }

    function post(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.num_participants = thing.num_participants;
        o.notes = thing.notes;
        o.session_type = thing.session_type;
        o.session_date = thing.session_date;
        o.session_content = thing.session_content;
        arr.push(o);
        data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        return api.uri.post.advocacyEvents(params);
    }

    $scope.onSubmitNew = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            create();
        }
    };

    $scope.edit = function(){
        var spinner = ui.spinner('loader');
        var params = { 'event_id': $routeParams.id };
        var promise = api.uri.advocacyEvents(params);
        // console.log(promise);
        promise.success(function(data){
            // console.log(data);

            // get actual header info from first record in array
            var x = data[0];
            // console.log(x);

            var o = {};
            o['event_id'] = x['event_id'];
            o['inst_id'] = x['inst_id'];
            o['notes'] = x['notes'];
            o['num_participants'] = x['num_participants'];
            o['session_content'] = x['session_content'];
            o['session_date'] = x['session_date'];
            o['session_type'] = x['session_type'];
            $scope.model = o;
            // console.log($scope.model);

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

    function put(){
        var thing = $scope.model;
        var arr = [];
        var o = {};
        o['pkey:event_id'] = thing.event_id;
        o.inst_id = config.institutionId;
        // if (thing.num_participants)
        o.num_participants = thing.num_participants;
        o.notes = thing.notes;
        o.session_type = thing.session_type;
        o.session_date = thing.session_date;
        o.session_content = thing.session_content;
        arr.push(o);
        var data = arr;
        // console.log('thing' , JSON.stringify(arr));
        var params = {};
        params.data = data;
        api.uri.put.advocacyEvents(params);
    }

    $scope.onSubmitEdit = function(form) {
        // First we broadcast an event so all fields validate themselves
        $scope.$broadcast('schemaFormValidate');

        // Then we check if the form is valid
        if (form.$valid) {
            put();
            $location.path('/advocacy');
            // $scope.$apply();
        }
    };

    $scope.deleteAdvocacyEvent = function(eventId){
        var params = { 'event_id': eventId }
        api.uri.delete.advocacyEvents(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $location.path('/advocacy');
                $scope.$apply();
            }
        });
    };

    $scope.getPerson = function(val) {
        var params = {last_name_like: val};
        return api.uri.persons(params).then(function(response){
            return response.map(function(item){
                return item;
            });
        });
    };

    $scope.addPersonToEvent = function(searchPerson){
        var arr = [];
        var o = {};
        o.inst_id = config.institutionId;
        o.event_id = $scope.participants[0].event_id;
        o.person_id = searchPerson.person_id;
        arr.push(o);
        var data = arr;
        var params = {};
        params.data = data;

        api.uri.post.advocacyPersons(params).then(function(data){
            // console.log(data);
            var response = JSON.parse(data['affected_rows']);
            if(response == 1) {
                $route.reload();
            }
        });
    };

    $scope.removePersonFromEvent = function(searchPerson){
        var params = {};
        params.event_id = $scope.participants[0].event_id;
        params.person_id = searchPerson.person_id;
        api.uri.delete.advocacyPerson(params).then(function(data, textStatus, jqXHR){
            // console.log(jqXHR);
            if(jqXHR['status'] == 204) {
                $route.reload();
            }
        });
    };

    function getSessionTypes(){
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
            populateSessionTypesSelect(download);
            $scope.$apply();
        });
        promise.error(function(data){
            alert('Error whilst fetching data from server');
            //console.log('promise ERROR');
        });
    }

    function populateSessionTypesSelect(data) {
        // console.log('download ', data);
        var sessionTitleMap = [];
        for(var i=0; i < data.length; ++i){
            var o = {};
            o.value = data[i].ast_id;
            o.name = data[i].ast_name;
            sessionTitleMap.push(o);
        }
        // console.log('sessionTitleMap ', sessionTitleMap);
        for(var i=0; i < $scope.form.length; ++i){
            if ($scope.form[i].key == 'session_type'){
                $scope.form[i].titleMap = sessionTitleMap;
            }
        }
    }

    getSessionTypes();
}]);
