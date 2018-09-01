(function () {
  'use strict';

  angular
    .module('masterlists')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('masterlists', {
        abstract: true,
        url: '/masterlists',
        template: '<ui-view/>'
      })
      .state('masterlists.list', {
        url: '',
        templateUrl: 'modules/masterlists/client/views/list-masterlists.client.view.html',
        controller: 'MasterlistsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Masterlists List'
        }
      })
      .state('masterlists.create', {
        url: '/create',
        templateUrl: 'modules/masterlists/client/views/form-masterlist.client.view.html',
        controller: 'MasterlistsController',
        controllerAs: 'vm',
        resolve: {
          masterlistResolve: newMasterlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Masterlists Create'
        }
      })
      .state('masterlists.edit', {
        url: '/:masterlistId/edit',
        templateUrl: 'modules/masterlists/client/views/form-masterlist.client.view.html',
        controller: 'MasterlistsController',
        controllerAs: 'vm',
        resolve: {
          masterlistResolve: getMasterlist
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Masterlist {{ masterlistResolve.name }}'
        }
      })
      .state('masterlists.view', {
        url: '/:masterlistId',
        templateUrl: 'modules/masterlists/client/views/view-masterlist.client.view.html',
        controller: 'MasterlistsController',
        controllerAs: 'vm',
        resolve: {
          masterlistResolve: getMasterlist
        },
        data: {
          pageTitle: 'Masterlist {{ masterlistResolve.name }}'
        }
      });
  }

  getMasterlist.$inject = ['$stateParams', 'MasterlistsService'];

  function getMasterlist($stateParams, MasterlistsService) {
    return MasterlistsService.get({
      masterlistId: $stateParams.masterlistId
    }).$promise;
  }

  newMasterlist.$inject = ['MasterlistsService'];

  function newMasterlist(MasterlistsService) {
    return new MasterlistsService();
  }
}());
