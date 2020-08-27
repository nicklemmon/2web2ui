import React from 'react';
import { InstantSearch, Hits } from 'react-instantsearch/dom';
import { Panel, Box } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import AlgoliaResults from './AlgoliaResults';
import AlgoliaSearch from './AlgoliaSearch';
import config from 'src/config';
import styles from './SearchPanel.module.scss';

const searchCfg = config.support.algolia;

export const OGSearchPanel = ({ defaultSearchText }) => (
  <InstantSearch appId={searchCfg.appID} apiKey={searchCfg.apiKey} indexName={searchCfg.index}>
    <Panel.LEGACY.Section>
      <AlgoliaSearch defaultSearchText={defaultSearchText} />
    </Panel.LEGACY.Section>
    <Panel.LEGACY.Section className={styles.Results}>
      <Hits hitComponent={AlgoliaResults} />
    </Panel.LEGACY.Section>
  </InstantSearch>
);

const HibanaSearchPanel = ({ defaultSearchText }) => (
  <InstantSearch appId={searchCfg.appID} apiKey={searchCfg.apiKey} indexName={searchCfg.index}>
    <Panel.LEGACY.Section>
      <AlgoliaSearch defaultSearchText={defaultSearchText} />
    </Panel.LEGACY.Section>
    <Panel.LEGACY.Section>
      <div className={styles.ResultsHibana}>
        <Box height="1100" overflowY="scroll">
          <Hits hitComponent={AlgoliaResults} />
        </Box>
      </div>
    </Panel.LEGACY.Section>
  </InstantSearch>
);

const SearchPanel = props => useHibanaToggle(OGSearchPanel, HibanaSearchPanel)(props);

export default SearchPanel;
