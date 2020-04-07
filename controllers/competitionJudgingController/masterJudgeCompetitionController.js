app.controller("judgingCompetitionMaster", function ($scope, $http,$routeParams, $window, $location, constants, SocketService, competitionService, categoryService) {
    $scope.regex = constants.regex;
    $scope.disableButtonNext = true;

    SocketService.emit('judgeMasterEnterToCompetition',{userId :$window.sessionStorage.getItem('id'),idComp : $routeParams.idComp})

    let sportsmanQueue;
    let currentCategoryIndex = 0;
    let currentSportsmanIndex = 0;
    getDisplayData()
    function getDisplayData() {
        competitionService.getRegistrationState($routeParams.idComp)
            .then(function (result) {
               sportsmanQueue  = result.data;
               $scope.currentCategory = sportsmanQueue[currentCategoryIndex].category;
               $scope.currentSportsman = sportsmanQueue[currentCategoryIndex].users[currentSportsmanIndex];
               SocketService.emit('setNextSportsman',{ userId :$window.sessionStorage.getItem('id'),idComp: $routeParams.idComp ,sportsman: $scope.currentSportsman,category : $scope.currentCategory })

            }, function (error) {
                console.log(error)
            });

        competitionService.getCompetitionDetails($routeParams.idComp)
            .then(function (result) {
                $scope.currentCompetition = result.data;
            }).catch(function (error) {console.log(error)})

        competitionService.getRegisteredJudges($routeParams.idComp)
            .then(function (result) {
                $scope.judges = result.data;
            }, function (error) {
                toastNotificationService.errorNotification("ארעה שגיאה. אנא פנה לתמיכה טכנית");
                console.log(error)
            });

    }
    SocketService.on('judgeGiveGrade',function (data) {
        console.log("given grade")
        let judge= $scope.judges.find((judge)=>judge.idJudge ==data.userId)
        judge.isGraded=true;
        $scope.disableButtonNext = $scope.judges ? $scope.judges.some(j => !j.isGraded) : true;
    })
    $scope.nextSportsman=function(){
        currentSportsmanIndex++
        if(!sportsmanQueue[currentCategoryIndex].users[currentSportsmanIndex]) {
            currentSportsmanIndex = 0
            currentCategoryIndex++
        }
        $scope.currentCategory = sportsmanQueue[currentCategoryIndex].category;
        $scope.currentSportsman = sportsmanQueue[currentCategoryIndex].users[currentSportsmanIndex];
        $scope.grade = ''
        $scope.judges.forEach((judge)=>judge.isGraded=false)
        SocketService.emit('setNextSportsman',{ userId :$window.sessionStorage.getItem('id') ,idComp: $routeParams.idComp ,sportsman: $scope.currentSportsman,category : $scope.currentCategory })

    }


    $scope.getAgeRange = categoryService.getAgeRange;

});