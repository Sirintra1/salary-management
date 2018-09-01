// Masterlists service used to communicate Masterlists REST endpoints
(function () {
  'use strict';

  angular
    .module('masterlists')
    .factory('MasterlistsService', MasterlistsService);

  MasterlistsService.$inject = ['$resource'];

  function MasterlistsService($resource) {
    return $resource('api/masterlists/:masterlistId', {
      masterlistId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
