module.exports = process.env.NODE_ENV === 'production'
  ? require('./configure-store.prod')
  : require('./configure-store.dev');
