app.service('competitionService', function ($window, $http, $uibModal) {
    /*****http requests*****/
    serverUrl = "http://localhost:3000";
    this.insertCompetition = function (data) {
        var req = {
            method: 'POST',
            url: serverUrl + '/private/addCompetition',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };
    this.getCompetitons = function (conditions) {
        var req = {
            method: 'POST',
            url: serverUrl + '/private/getCompetitions'+conditions,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };
    this.getOpenCompetitons = function (conditions) {
        var req = {
            method: 'POST',
            url: serverUrl + '/private/getCompetitions'+conditions,
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };
    this.getCompetitionDetails = function (id) {
        var req = {
            method: 'POST',
            url: serverUrl + '/private/getCompetitionDetail',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: {
                id: id
            }
        };
        return $http(req);
    };
    this.getSportsman = function () {
        var req = {
            method: 'POST',
            url: serverUrl + '/private/getCoachSportsman',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            }
        };
        return $http(req);
    };

    /*****common functions for gui*****/
    this.watchCompDetails = function (idCompetiton) {
        $uibModal.open({
            templateUrl: "views/competitonDetails.html",
            controller: "competitionDetailsModal as cDetailsCtrl",
            backdrop  : true,
            keyboard: false,
            resolve: {
                getId: function () {
                    return idCompetiton;
                }
            }
        }).result.catch(function () { });
    };
    this.regSportsman = function (idCompetiton) {
        $uibModal.open({
            templateUrl: "views/regSportsmanCompetition.html",
            controller: "competitionRegisterModal as cRegCtrl",
            backdrop  : 'static',
            keyboard  : false,
            resolve: {
                getId: function () {
                    return idCompetiton;
                }
            }
        }).result.catch(function () { });
    };
    this.buildConditions = function buildConditions(location, sportStyle, status){
        var conditions = [];

        if(location !== null && location !== undefined) {
            conditions.push('location=' + location);
        }
        if(sportStyle !== null && sportStyle !== undefined){
            conditions.push('sportStyle=' + sportStyle.name);
        }
        if(status != null && status !== undefined){
            conditions.push('status=' + status.name);
        }

        return conditions.length ? '?' + conditions.join('&') : '';
    }
});