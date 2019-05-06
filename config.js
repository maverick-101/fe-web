const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: 'https://api.saaditrips.com/api',
    domain: '',
    revivePath: '',
    lockScreen: false,
  },
  production: {
    // apiPath: 'https://saaditrips.com/api',
    apiPath: 'https://api.saaditrips.com/api',
    domain: 'saaditrips.com',
    revivePath: '',
    lockScreen: false,
  },
  domain: ''
};

module.exports = config[env];
