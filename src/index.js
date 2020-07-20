import React from 'react';
import { render } from 'react-dom';
import configureStore from './store';
import config from './config';
import ErrorTracker from './helpers/errorTracker';
// Note: styles must be imported before the App and Providers
import 'src/index.scss';
import { HibanaStyleHandler } from 'src/components/hibana'; // TODO: Remove and delete component once OG theme is no longer in the app
import App from './App';
import Providers from './Providers';

const defaultStore = configureStore();

const renderApp = () => {
  render(
    <Providers store={defaultStore}>
      {/* TODO: Remove and delete component once OG theme is no longer in the app */}
      <HibanaStyleHandler />

      <App />
    </Providers>,
    document.getElementById('root'),
  );
};

ErrorTracker.install(config, defaultStore);
renderApp();
window.SPARKPOST_LOADED = true; // Indicates the app bundle has loaded successfully

// Hot module replacement
if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./App', () => {
      renderApp();
    });
  }
}
