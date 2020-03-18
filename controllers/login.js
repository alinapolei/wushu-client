app.controller("loginController", function ($scope, $http, $window, $location, $rootScope, constants) {
    $scope.regex = constants.regex;

    $scope.submit = function(isValid){
        if(isValid){
            var user ={
                userID : $scope.username,
                password : $scope.password};
            $http.post(constants.serverUrl+ '/login', user)
                .then(function (response) {
                        $window.sessionStorage.setItem('name', response.data.firstname);
                        $window.sessionStorage.setItem('id', response.data.id);
                        $rootScope.name = $window.sessionStorage.getItem('name');

                        $window.sessionStorage.setItem('access', response.data.access);
                        $rootScope.access = $window.sessionStorage.getItem('access');
                        $window.sessionStorage.setItem('isFirstLogin', response.data.isFirstTime);
                        $window.sessionStorage.setItem('token', response.data.token);
                        $location.path('/home');
                    },
                    function (error) {
                        $scope.isError = true;
                        console.log(error.data);
                    });
        }
    };
});
