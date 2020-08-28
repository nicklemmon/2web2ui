import React, { Component } from 'react';
import { connect } from 'react-redux';
import { formatDateTime, formatDate } from 'src/helpers/date';
import classnames from 'classnames';
import { fetch as getAccount } from 'src/actions/account';
import { PanelLoading } from 'src/components/loading';
import { ProgressBar, Panel, Text, Box, Inline } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import styles from './UsageReport.module.scss';
import { LINKS } from 'src/constants';
import SendMoreCTA from './SendMoreCTA';

const actions = [
  {
    content: 'What counts towards usage?',
    to: LINKS.DAILY_USAGE,
    external: true,
    color: 'orange',
  },
];

const getPercent = (used, limit) => Math.floor((used / limit) * 100);

export const OGDisplayNumber = ({ label, content, primary }) => (
  <div className={styles.Display}>
    <h5 className={classnames(styles.Content, primary && styles.primary)}>{content}</h5>
    <h6 className={styles.Label}>{label}</h6>
  </div>
);

export const HibanaDisplayNumber = ({ label, content, primary }) => (
  <Box display="inline-block" mr="500">
    <Text fontSize="400" fontWeight="medium" color={primary ? 'blue.700' : undefined}>
      {content}
    </Text>
    <Text fontSize="200" fontWeight="light">
      {label}
    </Text>
  </Box>
);

const DisplayNumber = props => {
  return useHibanaToggle(OGDisplayNumber, HibanaDisplayNumber)(props);
};

export const OGProgressLabel = ({ title, secondaryTitle }) => (
  <div>
    <h5 className={styles.ProgressTitle}>{title}</h5>
    <h6 className={styles.ProgressSecondary}>{secondaryTitle}</h6>
  </div>
);

export const HibanaProgressLabel = ({ title, secondaryTitle }) => (
  <Box mb="200">
    <Inline>
      <Text fontSize="200" fontWeight="semibold">
        {title}
      </Text>
      <Text fontSize="200" fontWeight="light" color="gray.600">
        {secondaryTitle}
      </Text>
    </Inline>
  </Box>
);

const ProgressLabel = props => {
  return useHibanaToggle(OGProgressLabel, HibanaProgressLabel)(props);
};

export class UsageReport extends Component {
  componentDidMount() {
    this.props.getAccount({ include: 'usage' });
  }

  render() {
    const { subscription, usage } = this.props;

    if (!subscription || !usage) {
      return <PanelLoading />;
    }

    const remaining = subscription.plan_volume - usage.month.used;
    const overage = remaining < 0 ? Math.abs(remaining) : 0;
    const hasDailyLimit = usage.day.limit > 0;
    const hasMonthlyLimit = usage.month.limit > 0;

    return (
      <Panel.LEGACY title="Your Usage Report" actions={actions}>
        <Panel.LEGACY.Section>
          <ProgressLabel
            title="Today"
            secondaryTitle={`Since ${formatDateTime(usage.day.start)}`}
          />
          {hasDailyLimit && (
            <ProgressBar completed={getPercent(usage.day.used, usage.day.limit)} my="300" />
          )}
          <DisplayNumber label="Used" content={usage.day.used.toLocaleString()} primary />
          {hasDailyLimit && (
            <DisplayNumber label="Daily Limit" content={usage.day.limit.toLocaleString()} />
          )}
          <SendMoreCTA hasSendingLimits={hasDailyLimit || hasMonthlyLimit} />
        </Panel.LEGACY.Section>
        <Panel.LEGACY.Section>
          <ProgressLabel
            title="This Month"
            secondaryTitle={`Billing cycle: ${formatDate(usage.month.start)} - ${formatDate(
              usage.month.end,
            )}`}
          />
          {hasMonthlyLimit && (
            <ProgressBar completed={getPercent(usage.month.used, usage.month.limit)} my="300" />
          )}
          <DisplayNumber label="Used" content={usage.month.used.toLocaleString()} primary />
          <DisplayNumber label="Included" content={subscription.plan_volume.toLocaleString()} />
          {overage > 0 && (
            <DisplayNumber label="Extra Emails Used" content={overage.toLocaleString()} />
          )}
          {hasMonthlyLimit && (
            <DisplayNumber label="Monthly limit" content={usage.month.limit.toLocaleString()} />
          )}
        </Panel.LEGACY.Section>
      </Panel.LEGACY>
    );
  }
}

const mapStateToProps = ({ account: { usage, subscription } }) => ({ usage, subscription });
export default connect(mapStateToProps, { getAccount })(UsageReport);
