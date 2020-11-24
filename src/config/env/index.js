import devConfig from './dev-config';
import productionConfig from './production-config';
import stagingConfig from './staging-config';
import testConfig from './test-config';
import uatConfig from './uat-config';


export default (
  nodeEnv,
  environment = 'production' // for enterprise tenants
) => {
  if (nodeEnv === 'production') {
    const configByEnvironment = {
      production: productionConfig,
      staging: stagingConfig,
      uat: uatConfig
    };

    return configByEnvironment[environment];
  }

  if (nodeEnv === 'test') {
    return testConfig;
  }

  return devConfig;
};
