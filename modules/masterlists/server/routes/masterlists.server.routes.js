'use strict';

/**
 * Module dependencies
 */
var masterlistsPolicy = require('../policies/masterlists.server.policy'),
  masterlists = require('../controllers/masterlists.server.controller');

module.exports = function(app) {
  // Masterlists Routes
  app.route('/api/masterlists').all(masterlistsPolicy.isAllowed)
    .get(masterlists.list)
    .post(masterlists.create);

  app.route('/api/masterlists/:masterlistId').all(masterlistsPolicy.isAllowed)
    .get(masterlists.read)
    .put(masterlists.update)
    .delete(masterlists.delete);

  // Finish by binding the Masterlist middleware
  app.param('masterlistId', masterlists.masterlistByID);
};
