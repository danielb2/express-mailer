var environment =  process.env.NODE_ENV || 'development';

var config = {
  development: {
    mailer: {
      from: 'TestApplication@localhost',
      host: 'smtp.gmail.com', // hostname
      secureConnection: true, // use SSL
      port: 465, // port for secure SMTP
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'gmailPassword'
      }
    }
  },
  test: {
    mailer: {
      from: 'TestApplication@localhost',
      host: 'localhost', // hostname
      secureConnection: true, // use SSL
      port: 8465, // test port for secure SMTP
      auth: {
        user: 'TestApplication',
        pass: 'TestApplication'
      }
    }
  }
};

exports = module.exports = config[environment];