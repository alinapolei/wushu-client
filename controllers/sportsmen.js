app.controller("sportsmenController", function ($scope, $http, $window, $location, constants, clubService, pagingService, sportsmanService) {
    serverUrl = "http://localhost:3000";
    $scope.sexEnum = constants.sexEnum;
    $scope.sportStyles = constants.sportStyleEnum;
    var allUsers;
    $scope.pager = {};
    $scope.isToDesc = true;
    $scope.headerTable = "ספורטאיים";
    setPage(1);
    getDataForDisplay();

    function getDataForDisplay() {
        clubService.getClubs()
            .then(function (result) {
                $scope.clubs = result.data;
            }, function (error) {
                console.log(error)
            });
    }

    $scope.setPage = function(page){
        setPage(page);
    };

    function setPage(page) {
        if (page < 1 || (page > $scope.pager.totalPages && $scope.totalPages > 0)) {
            return;
        }

        //$scope.pager = pagingService.GetPager(allUsers.length, page);

        var req = {
            method: 'POST',
            url: serverUrl + '/private/getSportsmen' + sportsmanService.buildConditionds($scope.searchText, $scope.selectedsportStyle, $scope.selectedClub, $scope.selectedSex, $scope.isToDesc),
            headers: {
                'x-auth-token': $window.sessionStorage.getItem('token')
            },
        };
        $http(req).then(function (result) {
            let totalCount = result.data.totalCount;

            $scope.pager = pagingService.GetPager(totalCount, page);
            $scope.users = pagingService.sliceData(result.data.sportsmen, $scope.pager.startIndex, $scope.pager.endIndex);
        }, function (error) {
            console.log(error)
        });
    }

    $scope.sortStyleChanged = function (){
        $scope.isToDesc = !$scope.isToDesc;
        setPage(1);
    }
    
    $scope.watchProfile = function (selectedId) {
        $location.path("/sportsmanProfile/" + selectedId);
    }

});