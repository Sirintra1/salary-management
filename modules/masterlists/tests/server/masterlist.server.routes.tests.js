'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Masterlist = mongoose.model('Masterlist'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  masterlist;

/**
 * Masterlist routes tests
 */
describe('Masterlist CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Masterlist
    user.save(function () {
      masterlist = {
        name: 'Masterlist name'
      };

      done();
    });
  });

  it('should be able to save a Masterlist if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Masterlist
        agent.post('/api/masterlists')
          .send(masterlist)
          .expect(200)
          .end(function (masterlistSaveErr, masterlistSaveRes) {
            // Handle Masterlist save error
            if (masterlistSaveErr) {
              return done(masterlistSaveErr);
            }

            // Get a list of Masterlists
            agent.get('/api/masterlists')
              .end(function (masterlistsGetErr, masterlistsGetRes) {
                // Handle Masterlists save error
                if (masterlistsGetErr) {
                  return done(masterlistsGetErr);
                }

                // Get Masterlists list
                var masterlists = masterlistsGetRes.body;

                // Set assertions
                (masterlists[0].user._id).should.equal(userId);
                (masterlists[0].name).should.match('Masterlist name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Masterlist if not logged in', function (done) {
    agent.post('/api/masterlists')
      .send(masterlist)
      .expect(403)
      .end(function (masterlistSaveErr, masterlistSaveRes) {
        // Call the assertion callback
        done(masterlistSaveErr);
      });
  });

  it('should not be able to save an Masterlist if no name is provided', function (done) {
    // Invalidate name field
    masterlist.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Masterlist
        agent.post('/api/masterlists')
          .send(masterlist)
          .expect(400)
          .end(function (masterlistSaveErr, masterlistSaveRes) {
            // Set message assertion
            (masterlistSaveRes.body.message).should.match('Please fill Masterlist name');

            // Handle Masterlist save error
            done(masterlistSaveErr);
          });
      });
  });

  it('should be able to update an Masterlist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Masterlist
        agent.post('/api/masterlists')
          .send(masterlist)
          .expect(200)
          .end(function (masterlistSaveErr, masterlistSaveRes) {
            // Handle Masterlist save error
            if (masterlistSaveErr) {
              return done(masterlistSaveErr);
            }

            // Update Masterlist name
            masterlist.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Masterlist
            agent.put('/api/masterlists/' + masterlistSaveRes.body._id)
              .send(masterlist)
              .expect(200)
              .end(function (masterlistUpdateErr, masterlistUpdateRes) {
                // Handle Masterlist update error
                if (masterlistUpdateErr) {
                  return done(masterlistUpdateErr);
                }

                // Set assertions
                (masterlistUpdateRes.body._id).should.equal(masterlistSaveRes.body._id);
                (masterlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Masterlists if not signed in', function (done) {
    // Create new Masterlist model instance
    var masterlistObj = new Masterlist(masterlist);

    // Save the masterlist
    masterlistObj.save(function () {
      // Request Masterlists
      request(app).get('/api/masterlists')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Masterlist if not signed in', function (done) {
    // Create new Masterlist model instance
    var masterlistObj = new Masterlist(masterlist);

    // Save the Masterlist
    masterlistObj.save(function () {
      request(app).get('/api/masterlists/' + masterlistObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', masterlist.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Masterlist with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/masterlists/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Masterlist is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Masterlist which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Masterlist
    request(app).get('/api/masterlists/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Masterlist with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Masterlist if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Masterlist
        agent.post('/api/masterlists')
          .send(masterlist)
          .expect(200)
          .end(function (masterlistSaveErr, masterlistSaveRes) {
            // Handle Masterlist save error
            if (masterlistSaveErr) {
              return done(masterlistSaveErr);
            }

            // Delete an existing Masterlist
            agent.delete('/api/masterlists/' + masterlistSaveRes.body._id)
              .send(masterlist)
              .expect(200)
              .end(function (masterlistDeleteErr, masterlistDeleteRes) {
                // Handle masterlist error error
                if (masterlistDeleteErr) {
                  return done(masterlistDeleteErr);
                }

                // Set assertions
                (masterlistDeleteRes.body._id).should.equal(masterlistSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Masterlist if not signed in', function (done) {
    // Set Masterlist user
    masterlist.user = user;

    // Create new Masterlist model instance
    var masterlistObj = new Masterlist(masterlist);

    // Save the Masterlist
    masterlistObj.save(function () {
      // Try deleting Masterlist
      request(app).delete('/api/masterlists/' + masterlistObj._id)
        .expect(403)
        .end(function (masterlistDeleteErr, masterlistDeleteRes) {
          // Set message assertion
          (masterlistDeleteRes.body.message).should.match('User is not authorized');

          // Handle Masterlist error error
          done(masterlistDeleteErr);
        });

    });
  });

  it('should be able to get a single Masterlist that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Masterlist
          agent.post('/api/masterlists')
            .send(masterlist)
            .expect(200)
            .end(function (masterlistSaveErr, masterlistSaveRes) {
              // Handle Masterlist save error
              if (masterlistSaveErr) {
                return done(masterlistSaveErr);
              }

              // Set assertions on new Masterlist
              (masterlistSaveRes.body.name).should.equal(masterlist.name);
              should.exist(masterlistSaveRes.body.user);
              should.equal(masterlistSaveRes.body.user._id, orphanId);

              // force the Masterlist to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Masterlist
                    agent.get('/api/masterlists/' + masterlistSaveRes.body._id)
                      .expect(200)
                      .end(function (masterlistInfoErr, masterlistInfoRes) {
                        // Handle Masterlist error
                        if (masterlistInfoErr) {
                          return done(masterlistInfoErr);
                        }

                        // Set assertions
                        (masterlistInfoRes.body._id).should.equal(masterlistSaveRes.body._id);
                        (masterlistInfoRes.body.name).should.equal(masterlist.name);
                        should.equal(masterlistInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Masterlist.remove().exec(done);
    });
  });
});
