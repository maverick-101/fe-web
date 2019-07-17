const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: 'api/',
    domain: '',
    revivePath: '',
    lockScreen: false,
  },
  production: {
    // apiPath: 'https://saaditrips.com/api',
    apiPath: 'api/',
    domain: 'saaditrips.com',
    revivePath: '',
    lockScreen: false,
  },
  domain: ''
};

module.exports = config[env];
