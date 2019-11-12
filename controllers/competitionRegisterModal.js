app.controller("competitionRegisterModal", function ($scope, $rootScope, $window, $http, $routeParams, $filter, $location, sportsmanService, clubService, pagingService, competitionService, excelService, commonFunctionsService, constants, categoryService, confirmDialogService) {
    $scope.selectedNotRegisteredUsers = [];
    $scope.selectedRegisteredUsers = [];
    $scope.toRegisterUsers = [];
    $scope.toUnRegisterUsers = [];
    $scope.pager = {};
    let dropZoneRegCompetition = document.getElementById("dropZoneRegCompetition")
    let downExcelRegCompetition = document.getElementById("downExcelRegCompetition")

    setPage(1);
    getData();
    var regObj = {
        compId: $routeParams.idComp,
        sportsmenIds: []
    }

    $scope.setPage = function (page) {
        setPage(page);
    };

    function setPage(page) {
        if (page < 1 || (page > $scope.pager.totalPages && $scope.totalPages > 0)) {
            return;
        }

        sportsmanService.getSportsmenCount(sportsmanService.buildConditionds($scope.searchText, null, $scope.selectedClub, null, null, $routeParams.idComp, null))
            .then(function (result) {
                let totalCount = result.data.count;
                $scope.pager = pagingService.GetPager(totalCount, page);

                sportsmanService.getSportsmen(sportsmanService.buildConditionds($scope.searchText, null, $scope.selectedClub, null, null, $routeParams.idComp, null, $scope.pager.startIndex + 1, $scope.pager.endIndex + 1))
                    .then(function (result) {
                        $scope.users = sportsmanService.formatSportsmanCategoriesList(result.data.sportsmen, $scope.categories);
                    }, function (error) {
                        console.log(error)
                    });
            }, function (error) {
                console.log(error)
            });
        window.scroll(0, 0);
    }

    async function getData() {
        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });

        let result = await categoryService.getCategories();
        $scope.categories = result.data;
        setPage(1);
    }

    $scope.getAgeRange = categoryService.getAgeRange;

    function makeJsonToReg(rowObj) {
        for (let i = 0; i < rowObj.length; i++)
            regObj.sportsmenIds.push(parseInt(rowObj[i]["ת.ז ספורטאי"]))
    }

    $scope.addToToRegisterUsers = function (user, newCategory) {
        let registration = $scope.toUnRegisterUsers.find(item => item.id === user.id && item.category === newCategory.id);
        if (registration)
            $scope.toUnRegisterUsers = commonFunctionsService.arrayRemove($scope.toUnRegisterUsers, registration);
        else
            $scope.toRegisterUsers.push({id: user.id, category: newCategory.id});
    };
    $scope.addToToUnRegisterUsers = function (user, oldCategory) {
        if (oldCategory) {
            let registration = $scope.toRegisterUsers.find(item => item.id === user.id && item.category === oldCategory.id);
            if (registration)
                $scope.toRegisterUsers = commonFunctionsService.arrayRemove($scope.toRegisterUsers, registration);
            else
                $scope.toUnRegisterUsers.push({id: user.id, category: oldCategory.id});
            user.selectedCategories = commonFunctionsService.arrayRemove(user.selectedCategories, oldCategory);
            if (user.selectedCategories.length === 0)
                user.selectedCategories.push(undefined);
        } else
            user.selectedCategories.pop();
    };

    $scope.register = function () {
        competitionService.registerSportsmenToCompetition($routeParams.idComp, $scope.toRegisterUsers, $scope.toUnRegisterUsers)
            .then(function (result) {
                alert("הרישום בוצע בהצלחה");
                $scope.isSaved = true;
                if ($rootScope.isChangingLocationFirstTime) $location.path("/competitions/registerToCompetition");
            }, function (error) {
                console.log(error)
            });
    }
    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if (($scope.toRegisterUsers.length > 0 || $scope.toUnRegisterUsers.length > 0) && !$scope.isSaved && $rootScope.isChangingLocationFirstTime)
            confirmDialogService.notSavedItems(event, $location.path(), $scope.register);
    });

    $scope.downloadExcelRegCompetition = function () {
        let token = $window.sessionStorage.getItem('token')
        let compId = $routeParams.idComp;
        let url = constants.serverUrl + '/downloadExcelFormatRegisterToCompetition/' + token + '/' + compId;
        downExcelRegCompetition.setAttribute('href', url);
        downExcelRegCompetition.click();
    }

    /*Drop zone */
    dropZoneRegCompetition.ondrop = function (e) {
        excelService.dropZoneDropFile(e, function (res) {
            changeDropZone(res.fileName)
            let data = {
                compId: $routeParams.idComp,
                sportsman: res.result
            };
            competitionRegisterExcelSportsman(data);
        })
    };

    function competitionRegisterExcelSportsman(data) {
        competitionService.regExcelSportsmanCompetition(data)
            .then((res) => {
                alert("הספורטאיים נשמרו בהצלחה")
            }).catch((err) => {
            console.log(err)
            $scope.excelErrors = typeof err.data == 'object' ? undefined : err.data;
        })
    }

    function changeDropZone(name) {
        var droptext = document.getElementById("dropText");
        droptext.innerHTML = name.toString();
        $scope.isDropped = true;
        dropZoneRegCompetition.className = "dropzoneExcel"
    }

    dropZoneRegCompetition.ondragover = function () {
        this.className = 'dropzone dragover';
        return false;
    };
    dropZoneRegCompetition.ondragleave = function () {
        this.className = 'dropzone';
        return false;
    };
    $scope.uploadNewFile = function () {
        $scope.excelErrors = [];
        $scope.isDropped = false;
        dropZoneRegisterUsers.className = "dropzone"
        document.getElementById("dropText").innerHTML = "גרור קובץ או לחץ על העלאת קובץ";
        document.getElementById("fileSportsman").value = "";
    }
    $scope.ExcelExport = function (event) {
        excelService.uploadExcel(event, function (res) {
            competitionRegisterExcelSportsman(res.result)
        })
    };
});
