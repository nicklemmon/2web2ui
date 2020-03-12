import React from 'react';
import { Panel, Button } from '@sparkpost/matchbox';
import styles from './ApiDetailsTab.module.scss';
import ExternalLink from 'src/components/externalLink/ExternalLink';

const ApiDetailsTab = ({ history }) => (
  <Panel.Section>
    <div className={styles.Header}>Integrate Now</div>
    <p>
      {'Information on how to use this API key. '}
      <ExternalLink href="https://developers.sparkpost.com/api/data-privacy">
        {'Link to documentation '}
      </ExternalLink>
    </p>
    <Button color="orange" onClick={() => history.push(`/account/api-keys/create`)}>
      {'Generate key'}
    </Button>
  </Panel.Section>
);

export default ApiDetailsTab;