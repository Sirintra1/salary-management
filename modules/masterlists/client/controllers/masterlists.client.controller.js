(function() {
    'use strict';

    // Masterlists controller
    angular
        .module('masterlists')
        .controller('MasterlistsController', MasterlistsController);

    MasterlistsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'masterlistResolve'];

    function MasterlistsController($scope, $state, $window, Authentication, masterlist) {
        var vm = this;

        vm.authentication = Authentication;
        vm.masterlist = masterlist;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        // Remove existing Masterlist
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.masterlist.$remove($state.go('masterlists.list'));
            }
        }

        // Save Masterlist
        function save(isValid) {
            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.masterlistForm');
                return false;
            }

            // TODO: move create/update logic to service
            if (vm.masterlist._id) {
                vm.masterlist.$update(successCallback, errorCallback);
            } else {
                vm.masterlist.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                $state.go('masterlists.list', {
                    masterlistId: res._id
                });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());