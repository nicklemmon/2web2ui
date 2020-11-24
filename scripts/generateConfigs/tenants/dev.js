// yuck, this is a temporary hack, genrateConfig needs to go
const devTenants = {
  localhost: {
    host: 'localhost',
    authentication: {
      app: {
        cookie: {
          options: {
            domain: 'localhost',
          },
        },
      },
      site: {
        cookie: {
          options: {
            domain: 'localhost',
          },
        },
      },
    },
  },
};

module.exports = devTenants;
