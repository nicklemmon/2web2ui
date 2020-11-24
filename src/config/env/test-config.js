const testConfig = {
  apiBase: 'http://fake-api-test-host.com',
  splashPage: '/dashboard',
  release: 'test-release',
  segment: {
    enabled: false,
  },
  smtpAuth: {
    host: 'smtp.sparkmail.com',
    alternativePort: 2525,
  },
  support: {
    algolia: {
      appID: 'id',
      apiKey: 'key',
      index: 'index',
    },
  },
  authentication: {
    app: {
      cookie: {
        name: 'test',
        options: {
          path: '/',
        },
      },
    },
    site: {
      cookie: {
        name: 'website_test',
        options: {
          path: '/',
        },
      },
    },
  },
  crossLinkTenant: 'spc',
  cookieConsent: {
    cookie: {
      name: 'cookieConsent',
      ageDays: 365,
      options: {
        domain: 'test',
        path: '/',
      },
    },
  },
  tenantId: 'test',
};

export default testConfig;
