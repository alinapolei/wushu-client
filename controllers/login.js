app.controller("loginController", function ($scope, $http, $window, $location, $rootScope, constants, SocketService, confirmDialogService) {
    $scope.regex = constants.regex;

    $scope.submit = function (isValid) {
        if (isValid) {
            var user = {
                userID: $scope.username,
                password: $scope.password
            };
            $http.post(constants.serverUrl + '/loginFirstStep', user)
                .then(function (firstResponse) {
                    confirmDialogService.chooseUserType(firstResponse.data.dbResults.usertype, (userType) =>{
                        firstResponse.data.dbResults.usertype = userType;
                        $http.post(constants.serverUrl + '/loginSecondStep', firstResponse.data)
                            .then(function (response) {
                                    $window.sessionStorage.setItem('name', response.data.firstname);
                                    $window.sessionStorage.setItem('id', response.data.id);
                                    $rootScope.name = $window.sessionStorage.getItem('name');

                                    $window.sessionStorage.setItem('access', userType);
                                    $rootScope.access = $window.sessionStorage.getItem('access');
                                    $window.sessionStorage.setItem('isFirstLogin', response.data.isFirstTime);
                                    $window.sessionStorage.setItem('token', response.data.token);
                                    SocketService.emit('login', {userId: user.userID});
                                    $location.path('/home');
                            }, function (err) {
                                console.log(err)
                            });
                    })
                }, function(err){
                    console.log(err)
                });


            // $http.post(constants.serverUrl + '/login', user)
            //     .then(function (response) {
            //             confirmDialogService.chooseUserType(response.data.access, (userType) => {
            //                 $window.sessionStorage.setItem('name', response.data.firstname);
            //                 $window.sessionStorage.setItem('id', response.data.id);
            //                 $rootScope.name = $window.sessionStorage.getItem('name');
            //
            //                 $window.sessionStorage.setItem('access', userType);
            //                 $rootScope.access = $window.sessionStorage.getItem('access');
            //                 $window.sessionStorage.setItem('isFirstLogin', response.data.isFirstTime);
            //                 $window.sessionStorage.setItem('token', response.data.token);
            //                 SocketService.emit('login', {userId: user.userID});
            //                 $location.path('/home');
            //                 $scope.$apply()
            //             });
            //
            //         },
            //         function (error) {
            //             $scope.isError = true;
            //             console.log(error.data);
            //         });
        }
    };
});
