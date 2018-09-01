(function() {
    'use strict';

    angular
        .module('masterlists')
        .controller('MasterlistsListController', MasterlistsListController);

    MasterlistsListController.$inject = ['MasterlistsService', 'Authentication'];

    function MasterlistsListController(MasterlistsService, Authentication) {
        var vm = this;
        vm.authentication = Authentication;
        vm.masterlists = MasterlistsService.query();
    }
}());