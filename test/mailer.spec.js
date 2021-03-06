/*!
 * express-mailer spec
 */

/**
 * Module Dependencies
 */

var app = require('../example/app'),
    should = require('should'),
    request = require('superagent'),
    Mailbox = require('test-mailbox'),
    fs      = require('fs'),
    config = require('../example/config');

/**
 * Tests
 */

describe('Mailer', function () {

  var user,
      baseURL,
      server,
      fakeEmail,
      mailbox;

  before(function (done) {
    // Start up my app
    var port = 8000;
    server = app.listen(port);
    baseURL = 'http://localhost:' + port;
    fakeEmail = 'test@test.com';
    mailbox = new Mailbox({
      address: fakeEmail,
      auth: config.mailer.auth
    });

    mailbox.listen(config.mailer.port, done);

  });

  after(function (done) {
    //close mailbox and app
    mailbox.close(function() {
      server.close(function() {
        done();
      });
    });
  });

  describe('POST /send-mail-via-app', function () {

    it('should send mail to me', function (done) {

      mailbox.once('newMail', function (mail) {
        mail.html.should.include('<title>Test Email</title>');
        done();
      });

      request
        .post(baseURL + '/send-mail-via-app')
        .send({ 
          user: {
            email: fakeEmail
          }
        })
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
        });
    });

  });

  describe('POST /send-mail-via-res', function () {

    it('should send mail to me', function (done) {

      mailbox.once('newMail', function (mail) {
        mail.html.should.include('<title>Test Email</title>');
        done();
      });

      request
        .post(baseURL + '/send-mail-via-res')
        .send({ 
          user: {
            email: fakeEmail
          }
        })
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
        });
    });

  });


  describe('Rendering mail', function () {
    it('should not render an email which is missing variables', function(done) {
      app.locals.pretty = true;
      delete app.locals.testVariable;
      app.renderEmail('email', {
        to: 'test@example.com',
        subject: 'Test Email' },
        function (err, renderedMail) {
          err.toString().should.match(/testVariable is not defined/);
          app.locals.testVariable = 'Test Variable';
          done();
        });
    });

    it('should render an email', function(done) {
      app.locals.pretty = true;
      app.renderEmail('email', {
        to: 'test@example.com',
        subject: 'Test Email' },
        function (err, renderedMail) {
          var contents = fs.readFileSync('test/rendered_mail.html'); // reading file leaves trailing \n bug in node?
          renderedMail.should.equal(contents.toString());
          done();
        });
    });

  });

});
