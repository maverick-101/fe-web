const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    apiPath: '',
    domain: '',
    revivePath: '',
    lockScreen: true,
  },
  production: {
    apiPath: 'ec2-52-70-110-65.compute-1.amazonaws.com',
    domain: '',
    revivePath: '',
    lockScreen: true,
  },
  domain: ''
};

module.exports = config[env];
