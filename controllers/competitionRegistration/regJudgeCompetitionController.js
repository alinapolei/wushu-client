app.controller("regJudgeCompetitionController", function ($scope, $rootScope, $routeParams, $location, competitionService, commonFunctionsService, confirmDialogService, toastNotificationService) {
    $scope.selectedNotRegisteredUsers = [];
    $scope.selectedRegisteredUsers = [];
    $scope.toRegisterUsers = [];
    $scope.toUnRegisterUsers = [];
    getData();

    function getData(){
        competitionService.getJudgeRegistrationState($routeParams.idComp)
            .then(function (result) {
                $scope.registeredUsers = result.data.registeredJudges;
                $scope.notRegisteredUsers = result.data.unRegisteredJudges;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.selectNotRegistered = function (user) {
        if($scope.selectedNotRegisteredUsers.includes(user))
            $scope.selectedNotRegisteredUsers = commonFunctionsService.arrayRemove($scope.selectedNotRegisteredUsers, user);
        else
            $scope.selectedNotRegisteredUsers.push(user);
    };
    $scope.selectRegistered = function (user){
        if($scope.selectedRegisteredUsers.includes(user))
            $scope.selectedRegisteredUsers = commonFunctionsService.arrayRemove($scope.selectedRegisteredUsers, user);
        else
            $scope.selectedRegisteredUsers.push(user);
    };

    $scope.registerSelected = function () {
        $scope.registeredUsers = $scope.registeredUsers.concat($scope.selectedNotRegisteredUsers);
        $scope.selectedNotRegisteredUsers.forEach(selected => {
            let registration = $scope.toUnRegisterUsers.find(item => item.id === selected.id);
            if (registration)
                $scope.toUnRegisterUsers = commonFunctionsService.arrayRemove($scope.toUnRegisterUsers, registration);
            else
                $scope.toRegisterUsers = $scope.toRegisterUsers.concat(selected);
            $scope.notRegisteredUsers = commonFunctionsService.arrayRemove($scope.notRegisteredUsers, selected);
        });
        $scope.selectedNotRegisteredUsers = [];
    };
    $scope.unRegisterSelected = function () {
        $scope.notRegisteredUsers = $scope.notRegisteredUsers.concat($scope.selectedRegisteredUsers);
        $scope.selectedRegisteredUsers.forEach(selected =>{
            let registration = $scope.toRegisterUsers.find(item => item.id === selected.id);
            if(registration)
                $scope.toRegisterUsers = commonFunctionsService.arrayRemove($scope.toRegisterUsers, registration);
            else
                $scope.toUnRegisterUsers.push({id: selected.id});
            $scope.registeredUsers = commonFunctionsService.arrayRemove($scope.registeredUsers, selected);
        });
        $scope.selectedRegisteredUsers = [];
    };

    $scope.register = function () {
        competitionService.registerJudgeToCompetition($routeParams.idComp, $scope.toRegisterUsers, $scope.toUnRegisterUsers)
            .then(function (result) {
                toastNotificationService.successNotification("הרישום בוצע בהצלחה")
            }, function (error) {
                console.log(error);
                toastNotificationService.successNotification("ארעה שגיאה בעת ביצוע הרישום")
            });
    }

    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if (($scope.toRegisterUsers.length > 0 || $scope.toUnRegisterUsers.length > 0) && !$scope.isSaved && $rootScope.isChangingLocationFirstTime)
            confirmDialogService.notSavedItems(event, $location.path(), $scope.register);
    });
});