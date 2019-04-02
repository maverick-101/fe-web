const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: 'https://api.saaditrips.com/api',
    domain: '',
    revivePath: '',
    lockScreen: false,
  },
  production: {
    apiPath: 'http://10.0.1.128/api',
    domain: '',
    revivePath: '',
    lockScreen: false,
  },
  domain: ''
};

module.exports = config[env];
