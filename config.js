const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: '',
    domain: '',
    revivePath: '',
    lockScreen: true,
  },
  production: {
    apiPath: '',
    domain: '',
    revivePath: '',
    lockScreen: true,
  },
  domain: ''
};

module.exports = config[env];
