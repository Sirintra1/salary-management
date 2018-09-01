(function() {
    'use strict';

    angular
        .module('accounts')
        .controller('AccountsListController', AccountsListController);

    AccountsListController.$inject = ['AccountsService', '$scope', '$http', 'Authentication'];

    function AccountsListController(AccountsService, $scope, $http, Authentication) {
        var vm = this;
        vm.authentication = Authentication;
        vm.accounts = AccountsService.query();
        // vm.createAccount = new AccountsService();
        $scope.getYears = function(year) {
            $http.get('/api/checkyear/' + year).then(function(res) {
                $scope.years = res.data.years;
            });
        };
        $scope.getYears();

        $scope.checkYear = function(year) {
            $http.get('/api/checkyear/' + year).then(function(res) {
                if (res.data.status) {
                    $scope.addYear(year);
                } else {
                    alert(res.data.message);
                }
            });
        };

        $scope.addYear = function(year) {
            var number = 0;
            var checkLoop = 0;
            for (var i = 0; i < 12; i++) {
                var saveYear = year;
                var saveNo = i + 1;
                var setDate = new Date(year, i + 1, 0);
                var month = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                var saveName = month[setDate.getMonth()];
                var saveDay = setDate.getDate();
                var itemsDay = [];
                for (var j = 0; j < saveDay; j++) {
                    var cookingDay = new Date(year, i, j + 1);
                    var listdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    itemsDay.push({
                        day: j + 1,
                        nameday: listdays[cookingDay.getDay()],
                        indexday: cookingDay.getDay()
                    });
                }

                var saveAccount = new AccountsService({
                    year: year,
                    month: {
                        name: saveName,
                        days: saveDay,
                        no: saveNo,
                        items: itemsDay
                    }
                });
                number = i + 1;
                saveAccount.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                checkLoop += 1;
                if (number === checkLoop) {
                    vm.accounts = AccountsService.query();
                    $scope.getYears();
                }
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        };
    }
}());