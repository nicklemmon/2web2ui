// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  require('cypress-plugin-retries/lib/plugin')(on);
  require('@cypress/code-coverage/task')(on, config);

  on('task', {
    // Used to allow `cy.log()` to the Node console when running in headless mode
    log(message) {
      // eslint-disable-next-line
      console.log(message);

      return null;
    },
  });

  // Configuration options that do not change between environments
  config.blacklistHosts = [
    'api.sparkpost.test',
    'api-staging.sparkpost.com',
    '*google-analytics.com',
    '*.storage.googleapis.com',
    '*pendo.io',
    'api.segment.io',
    'cdn.segment.com',
    '*siftscience.com',
    '*googletagmanager.com',
    '*sentry.io',
    '*zuora.com',
  ];
  config.integrationFolder = 'cypress/tests/integration';
  config.reporter = 'cypress-multi-reporters';
  config.reporterOptions = {
    configFile: 'cypress.reporter.json',
  };
  config.viewportWidth = 1280;
  config.viewportHeight = 800;

  return config;
};
