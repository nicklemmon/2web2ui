import React from 'react';
import { Panel } from 'src/components/matchbox';
import { CheckCircle, Warning } from '@sparkpost/matchbox-icons';

import { PanelLoading } from 'src/components/loading';
import { useFeatureChangeContext } from '../context/FeatureChangeContext';

import cx from 'classnames';
import OGStyles from './FeatureChangeSection.module.scss';
import HibanaStyles from './FeatureChangeSectionHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

const Feature = ({ key, value, label, description, action }) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  return (
    <Panel.LEGACY.Section key={`confirm_${key}`}>
      <div className={styles.Label}>{label}</div>
      <div className={styles.Feature}>
        <div className={styles.description}>{description}</div>
        <div>{value ? <CheckCircle className={styles.FeatureCheckIcon} /> : action}</div>
      </div>
    </Panel.LEGACY.Section>
  );
};

const FeatureChangeSection = () => {
  const { features = [], loading, isReady } = useFeatureChangeContext();
  const styles = useHibanaOverride(OGStyles, HibanaStyles);

  if (!features.length) {
    return null;
  }

  if (loading) {
    return <PanelLoading minHeight="200px" />;
  }

  const renderCTA = () =>
    isReady ? (
      <Panel.LEGACY.Section name="feature-change-status">
        <div className={styles.FeatureListStatus}>
          <CheckCircle className={cx(styles.FeatureListIcon, styles.success)} />
          <div name="status-description">
            <strong>Your features have been updated</strong>
            <span>, please continue with your plan change.</span>
          </div>
        </div>
      </Panel.LEGACY.Section>
    ) : (
      <Panel.LEGACY.Section name="feature-change-status">
        <div className={styles.FeatureListStatus}>
          <Warning className={cx(styles.FeatureListIcon, styles.danger)} />
          <div name="status-description">
            <span>
              Your new plan has additional limits on features you currently use. See the list below
              to{' '}
            </span>
            <strong>make the necessary changes before you can change plans.</strong>
          </div>
        </div>
      </Panel.LEGACY.Section>
    );

  return (
    <Panel.LEGACY accent={isReady ? 'green' : 'red'} title="Changes to Features">
      {renderCTA()}
      {features.map(props => (
        <Feature {...props} />
      ))}
    </Panel.LEGACY>
  );
};

export default FeatureChangeSection;
