app.controller("registerController", function ($scope, $rootScope, $http, $window, $location, $filter, clubService, excelService, coachService, registerService, constants, confirmDialogService, toastNotificationService) {
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyleEnum = constants.sportStyleEnum;
    $scope.regex = constants.regex;

    $scope.currentDate = new Date();
    $scope.userType = "sportsman";
    $scope.coaches = new Array()
    $scope.clubs = new Array();
    let dropZoneRegisterUsers = document.getElementById("dropZoneRegisterUsers");
    let downloadExcelLinkSportsman = document.getElementById("downExcelSportsman");
    let downloadExcelLinkCoahces = document.getElementById("downExcelCoach");
    getCoachesAndClub();

    $scope.BrowseFileClick = function () {
        let fileinput = document.getElementById("fileSportsman");
        fileinput.click();
        fileinput.onchange = function (event) {
            $scope.ExcelExport(event)
            changeDropZone(event.target.value.toString());

        }
    }

    function getCoachesAndClub() {
        coachService.getCoaches()
            .then(function (result) {
                $scope.coaches = result.data;
            }, function (error) {
                console.log(error)
            });

        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });

    }

    $scope.filterClub = function () {
        $scope.sportclub = $filter('filter')($scope.clubs, function (obj) {
            return obj.id === $scope.coach.sportclub;
        })[0];
    };

    $scope.uploadNewFile = function () {
        $scope.excelErrors = [];
        $scope.isDropped = false;
        dropZoneRegisterUsers.className = "dropzone"
        document.getElementById("fileSportsman").value = "";
    }
    $scope.ExcelExport = function (event) {
        excelService.uploadExcel(event, function (res) {
            res.result.shift();
            registerExcelUsers(res.result, $scope.userType)
        })
    };


    dropZoneRegisterUsers.ondrop = function (e) {
        excelService.dropZoneDropFile(e, function (res) {
            changeDropZone(res.fileName)
            res.result.shift();
            registerExcelUsers(res.result, $scope.userType)
        })
    };

    function changeDropZone(name) {
        let nameArray = name.toString().split("\\");
        $scope.filename = nameArray[nameArray.length - 1];
        $scope.isDropped = true;
        dropZoneRegisterUsers.className = "dropzoneExcel"
    }

    dropZoneRegisterUsers.ondragover = function () {
        this.className = 'dropzone dragover';
        return false;
    };
    dropZoneRegisterUsers.ondragleave = function () {
        this.className = 'dropzone';
        return false;
    };

    /*** manual registration ***/
    $scope.submit = async function (isValid) {
        let data = [];
        if (isValid) {
            if ($scope.userType=='sportsman') {
                data.push({
                    id: $scope.id,
                    firstName: $scope.firstname,
                    lastName: $scope.lastname,
                    phone: $scope.phone,
                    address: $scope.address,
                    birthDate: $filter('date')($scope.birthdate, "MM/dd/yyyy").toString(),
                    email: $scope.email,
                    sportClub: $scope.sportclub.id,
                    sex: $scope.selectedSex,
                    sportStyle: $scope.sportStyle,
                    idCoach: $scope.coach.id
                });
            } else {
                data.push({
                    id: $scope.id,
                    firstname: $scope.firstname,
                    lastname: $scope.lastname,
                    phone: $scope.phone,
                    email: $scope.email,
                    birthdate: $filter('date')($scope.birthdate, "MM/dd/yyyy").toString(),
                    address: $scope.address,
                    sportclub: $scope.sportclub.id,
                    sportStyle: $scope.sportStyle,
                    teamname: $scope.teamname
                });
            }
            registerUsers(data, $scope.userType)
        }
    };
    $rootScope.isChangingLocationFirstTime = true;
    $scope.$on('$routeChangeStart', function (event, newRoute, oldRoute) {
        if ($scope.registerForm.$dirty && !$scope.isSaved && $rootScope.isChangingLocationFirstTime) {
            if (!$scope.registerForm.$valid) $scope.isClicked = true;
            confirmDialogService.notSavedItems(event, $location.path(), $scope.submit, $scope.registerForm.$valid);
        }
    });

    function registerExcelUsers(data, userType) {
        registerService.registerUsersExcel(data, userType)
            .then((results) => {
                $scope.isSaved = true;
                toastNotificationService.successNotification("הרישום בוצע בהצלחה");
                $location.path("/home");
            })
            .catch((err) => {
                console.log(err);
                if (!err.data.message)
                    $scope.excelErrors = err.data;
                else {
                    let serverErrors = [];
                    if (err.data.number === 547)
                        serverErrors.push("ת.ז מאמן לא קיימת במערכת");
                    if (err.data.number === 2627)
                        serverErrors.push("ת.ז " + getIdFromErrorMessage(err.data.message) + " קיימת כבר במערכת.");
                    if (serverErrors.length > 0)
                        $scope.excelErrors = [{errors: serverErrors}]
                }
            })
    }

    function registerUsers(data, userType) {
        if (userType=='sportsman')
            registerService.registerUsers(data,userType)
                .then((results) => {
                    $scope.isSaved = true;
                    toastNotificationService.successNotification("הרישום בוצע בהצלחה");
                    $location.path("/home");
                })
                .catch((err) => {
                    console.log(err);
                    if (!err.data.message)
                        $scope.excelErrors = err.data;
                    else {
                        let serverErrors = [];
                        if (err.data.number === 547)
                            serverErrors.push("ת.ז מאמן לא קיימת במערכת");
                        if (err.data.number === 2627)
                            serverErrors.push("ת.ז " + getIdFromErrorMessage(err.data.message) + " קיימת כבר במערכת.");
                        if (serverErrors.length > 0)
                            $scope.excelErrors = [{errors: serverErrors}]
                    }
                })
    }

    $scope.downloadExcelRegisterSportsMan = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatSportsman/' + token;
        downloadExcelLinkSportsman.setAttribute('href', url);
        downloadExcelLinkSportsman.click();
    }

    $scope.downloadExcelRegisterCoaches = function () {
        let token = $window.sessionStorage.getItem('token')
        let url = constants.serverUrl + '/downloadExcelFormatCoach/' + token;
        downloadExcelLinkCoahces.setAttribute('href', url);
        downloadExcelLinkCoahces.click();
    }


    fillDataTmpFunction();
    function fillDataTmpFunction() {
        $scope.id = 222222222;
        $scope.firstname = "ניסיון";
        $scope.lastname = "ניסיון";
        $scope.phone = "2222222222";
        $scope.email = "tmp@gmail.com";
        $scope.address = 'כגדכ'
        $scope.selectedSex = 'זכר'
        $scope.sportStyle = 'טאולו'
        $scope.birthdate = new Date(1990, 3, 3);
    }

    function getIdFromErrorMessage(error) {
        let parts = error.split('(');
        return parts[parts.length - 1].substring(0, parts[parts.length - 1].length - 2)
    }
});


