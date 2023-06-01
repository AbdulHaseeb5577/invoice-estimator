const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/graphql', createProxyMiddleware({
    target: 'https://c1d5fb1d4c.nxcli.io',
    changeOrigin: true,
  }));
};
