/**
 * this service contains calls for endpoints for the referee entity
 */
app.service('refereesService', function ($window, $http, constants, $location) {

    /**
     * get all judges from DB
     */
    this.getReferees = function () {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getReferees',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token') //'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MCwiYWNjZXNzIjoxLCJpYXQiOjE1NjUzNjY0MTUsImV4cCI6MTU2NTQ1MjgxNX0.R3hXyBVbiXfgKy9wOi7Y1V0YjZXMQ4jGIxWbHeQkuqI'
            },
        };
        return $http(req);
    };

    /**
     * get judge profile data
     * @param data - json data that include the rellevant judge id
     */
    this.getRefereeProfile = function (data) {
        var req = {
            method: 'POST',
            url: constants.serverUrl + '/private/commonCoachManager/getRefereeProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    };

    /**
     * update judge details
     * @param data - json input of judge data
     */
    this.updateProfile = function (data) {
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/allUser/updateProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }

    /**
     * go to referee profile, by the given referee id
     * @param selectedId - referee id
     */
    this.watchProfile = function (selectedId) {
        $location.path("/profile/refereeProfile/" + selectedId);
    }

    /**
     * delete judge profile with the given id
     * @param id - judge id to delete
     */
    this.deleteProfile = function (id) {
        let data = {
            userID: id
        };
        let req = {
            method: 'POST',
            url: constants.serverUrl + '/private/manager/deleteJudgeProfile',
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
            data: data
        };
        return $http(req);
    }
});
