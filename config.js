const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: '',
    domain: '',
    revivePath: '',
    lockScreen: false,
  },
  production: {
    // apiPath: 'https://saaditrips.com/api',
    apiPath: '',
    domain: 'saaditrips.com',
    revivePath: '',
    lockScreen: false,
  },
  domain: ''
};

module.exports = config[env];
