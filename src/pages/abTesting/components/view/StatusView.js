import React, { Fragment } from 'react';
import { Panel } from 'src/components/matchbox';
import { OGOnlyWrapper } from 'src/components/hibana';
import { LabelledValue } from 'src/components';
import { formatDateTime } from 'src/helpers/date';

import styles from './View.module.scss';

const Winner = ({ test }) => {
  if (!test.winning_template_id) {
    return null;
  }

  let winningHelpText = null;

  if (test.winning_template_id === test.default_template.template_id) {
    winningHelpText = 'No winner was found.';
  }

  if (
    test.winning_template_id !== test.default_template.template_id &&
    test.test_mode === 'bayesian'
  ) {
    winningHelpText = 'This variant is now being sent by default.';
  }

  return (
    <OGOnlyWrapper as={Panel.LEGACY}>
      <Panel.LEGACY.Section>
        <LabelledValue label="Winner">
          <h6>{test.winning_template_id}</h6>
          <p className={styles.HelpText}>{winningHelpText}</p>
        </LabelledValue>
      </Panel.LEGACY.Section>
    </OGOnlyWrapper>
  );
};

const StatusView = ({ test }) => (
  <Fragment>
    <OGOnlyWrapper as={Panel.LEGACY}>
      <Panel.LEGACY.Section>
        <LabelledValue label="Start Date">
          <p>{formatDateTime(test.start_time)}</p>
        </LabelledValue>
        <LabelledValue label="End Date">
          <p>{formatDateTime(test.end_time)}</p>
        </LabelledValue>
      </Panel.LEGACY.Section>
    </OGOnlyWrapper>
    <Winner test={test} />
  </Fragment>
);

StatusView.defaultProps = {
  test: {},
};

export default StatusView;
