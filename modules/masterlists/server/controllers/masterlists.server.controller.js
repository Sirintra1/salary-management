'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Masterlist = mongoose.model('Masterlist'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Masterlist
 */
exports.create = function(req, res) {
  var masterlist = new Masterlist(req.body);
  masterlist.user = req.user;

  masterlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(masterlist);
    }
  });
};

/**
 * Show the current Masterlist
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var masterlist = req.masterlist ? req.masterlist.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  masterlist.isCurrentUserOwner = req.user && masterlist.user && masterlist.user._id.toString() === req.user._id.toString();

  res.jsonp(masterlist);
};

/**
 * Update a Masterlist
 */
exports.update = function(req, res) {
  var masterlist = req.masterlist;

  masterlist = _.extend(masterlist, req.body);

  masterlist.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(masterlist);
    }
  });
};

/**
 * Delete an Masterlist
 */
exports.delete = function(req, res) {
  var masterlist = req.masterlist;

  masterlist.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(masterlist);
    }
  });
};

/**
 * List of Masterlists
 */
exports.list = function(req, res) {
  Masterlist.find().sort('-created').populate('user', 'displayName').exec(function(err, masterlists) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(masterlists);
    }
  });
};

/**
 * Masterlist middleware
 */
exports.masterlistByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Masterlist is invalid'
    });
  }

  Masterlist.findById(id).populate('user', 'displayName').exec(function (err, masterlist) {
    if (err) {
      return next(err);
    } else if (!masterlist) {
      return res.status(404).send({
        message: 'No Masterlist with that identifier has been found'
      });
    }
    req.masterlist = masterlist;
    next();
  });
};
