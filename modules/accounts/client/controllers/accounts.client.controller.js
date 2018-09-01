(function () {
    'use strict';

    // Accounts controller
    angular
        .module('accounts')
        .controller('AccountsController', AccountsController);

    AccountsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'accountResolve', 'MasterlistsService', 'MonthsService', '$stateParams'];

    function AccountsController($scope, $state, $window, Authentication, account, MasterlistsService, MonthsService, $stateParams) {
        var vm = this;

        vm.authentication = Authentication;
        vm.account = account;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;
        vm.masterlists = MasterlistsService.query();
        vm.months = MonthsService.query();
        // vm.getWidth = function () {
        //     var width = document.getElementById('xxx').clientWidth / 7;
        //     var i = [];
        //     for (let i = 0; i < 7; i++) {
        //         var id = 'd' + i;
        //         document.getElementById(id).style.width = width;               
        //    }
        // };
        // vm.width = vm.getWidth();
        // vm.account.lists ? vm.account.lists : [];
        // vm.account.comment ? vm.account.comment : [];
        if (vm.account.lists.length > 0) {
            vm.account.lists = vm.account.lists;
        } else {
            vm.account.lists = [];
        }

        if (vm.account.comment.length > 0) {
            vm.account.comment = vm.account.comment;
        } else {
            vm.account.lists = [];
        }

        if ($stateParams.day) {
            vm.day = $stateParams.day;
        }
        var listday = [];
        var firstday = vm.account.month.items[0].indexday;
        var indexs = 0;
        var listdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (var i = 0; i < firstday; i++) {
            indexs = firstday - (i + 1);
            listday.push({
                nameday: listdays[indexs],
                day: 0
            });
        }
        vm.account.month.items = listday.concat(vm.account.month.items);
        $scope.selectList = function (item) {
            vm.prices = item.prices;
            vm.status = '';
            if (vm.account.lists.length > 0) {
                vm.account.lists.forEach(function (list) {
                    if (list.master._id === item._id) {
                        vm.status = 'have';
                    }
                });

            }

            if (vm.status === '' || vm.status !== 'have') {
                // vm.accuralreceipt.items.push(ord);
            } else {
                alert('คุณเลือกรายการซ้ำ');
                vm.list = '';
                vm.prices = '';
            }
        };

        $scope.addList = function (item) {
            vm.account.lists.push({
                master: item
            });
            vm.list = '';
            vm.prices = '';
            $scope.calOutcome();
            $scope.calIncome();
        };

        $scope.addComment = function () {
            vm.account.comment.push({
                other: vm.commentOther,
                price: vm.commentPrice,
                types: vm.commentTypes
            });
            vm.commentOther = '';
            vm.commentPrice = '';
            vm.commentTypes = '';
            $scope.calOutcome();
            $scope.calIncome();
        };
        // vm.list_outcome = [];
        // vm.account.month.items = [];
        $scope.addListOutcome = function () {
            vm.account.month.items.forEach(function (list) {
                if (list.day === Number(vm.day)) {
                    list.lists.push({
                        name: vm.listOutcome,
                        prices: vm.priceOutcome,
                        types: 'Outcome'

                    });
                }
            });
            $scope.calListOutcome();
            vm.listOutcome = '';
            vm.priceOutcome = '';

        };
        vm.listOutcometotal = 0;
        vm.listOutcomeAmount = 0;
        vm.listOutcomeBalance = 0;
        vm.listOutcomeAmount = (vm.account.amount / vm.account.month.days) - vm.listOutcometotal;
        if (vm.account._id) {
            vm.account.month.items.forEach(function (list) {
                list.total = 0;
                // vm.listOutcometotal = 0;
                if (list.lists) {
                    list.lists.forEach(function (sumPrice) {
                        if (list.day === Number(vm.day)) {
                            list.total += sumPrice.prices;
                            vm.listOutcometotal = list.total;
                        }
                    });
                }


            });
        }

        vm.listOutcomeBalance = (vm.account.amount / vm.account.month.days) - vm.listOutcometotal;
        $scope.calListOutcome = function () {
            vm.listOutcometotal = 0;
            vm.listOutcomeBalance = 0;
            vm.account.month.items.forEach(function (list) {
                list.total = 0;
                // vm.listOutcometotal = 0;
                list.lists.forEach(function (sumPrice) {
                    if (list.day === Number(vm.day)) {
                        list.total += sumPrice.prices;
                        vm.listOutcometotal = list.total;
                    }
                });

            });
            vm.listOutcomeBalance = (vm.account.amount / vm.account.month.days) - vm.listOutcometotal;
        };
        $scope.calOutcome = function () {
            vm.account.total = 0;
            var sumOutcome = 0;
            var sumCommmentOutcome = 0;
            angular.forEach(vm.account.lists, function (list) {
                sumOutcome += list.master.prices;
            });
            angular.forEach(vm.account.comment, function (comment) {
                if (comment.types === 'Outcome') {
                    sumCommmentOutcome += comment.price;
                }

            });
            vm.account.total = (sumOutcome + sumCommmentOutcome);
        };

        $scope.calIncome = function () {
            vm.account.amount = 0;
            var sumIncome = 0;
            var sumCommmentIncome = 0;
            angular.forEach(vm.masterlists, function (list) {
                if (list.types === 'Income') {
                    sumIncome += list.prices;
                }
            });
            angular.forEach(vm.account.comment, function (comment) {
                if (comment.types === 'Income') {
                    sumCommmentIncome += comment.price;
                }

            });
            vm.account.amount = (sumIncome + sumCommmentIncome) - vm.account.total;
        };

        $scope.removeList = function (item) {
            vm.account.lists.splice(item, 1);
            $scope.calOutcome();
            $scope.calIncome();
        };
        $scope.removeComment = function (item) {
            vm.account.comment.splice(item, 1);
            $scope.calOutcome();
            $scope.calIncome();
        };
        $scope.removeListOutcome = function (item) {
            vm.account.month.items.forEach(function (list) {
                list.lists.forEach(function (sumPrice) {
                    if (list.day === Number(vm.day)) {
                        list.lists.splice(item, 1);
                    }
                });
            });
            $scope.calListOutcome();
        };
        // Remove existing Account
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.account.$remove($state.go('accounts.list'));
            }
        }

        // Save Account
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.accountForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.account._id) {
                vm.account.$update(successCallback, errorCallback);
            } else {
                vm.account.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('accounts.view', {
                    accountId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());