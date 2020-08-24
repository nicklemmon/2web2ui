import React, { Fragment } from 'react';
import { EmailIcon, SlackIcon, WebhookIcon } from 'src/components/icons';
import { ExternalLink } from 'src/components/links';
import { emails, ifStringPresent, maxItems, noDuplicateItems } from 'src/helpers/validation';
export const FORM_NAME = 'alertForm';

export const METRICS = {
  monthly_sending_limit: 'Monthly Sending Limit',
  health_score: 'Health Score',
  block_bounce_rate: 'Block Bounce Rate',
  hard_bounce_rate: 'Hard Bounce Rate',
  soft_bounce_rate: 'Soft Bounce Rate',
  injection_count: 'Injection Count',
  blocklist: 'Blocklists',
};

export const FILTERS_FRIENDLY_NAMES = {
  none: 'None',
  ip_pool: 'IP Pool',
  mailbox_provider: 'Mailbox Provider',
  sending_domain: 'Sending Domain',
  sending_ip: 'Sending IP',
  subaccount_id: 'Subaccounts',
  blocklist_provider: 'Blocklists',
  blocklist_resource: 'Domains or IPs',
};

export const RECOMMENDED_METRIC_VALUE = {
  monthly_sending_limit: {
    raw: {
      gt: 80,
    },
  },
  health_score: {
    raw: {
      lt: 80,
      gt: 70,
    },
    week_over_week: {
      gt: 10,
    },
    day_over_day: {
      gt: 10,
    },
  },
  block_bounce_rate: {
    raw: {
      gt: 20,
    },
  },
  hard_bounce_rate: {
    raw: {
      gt: 20,
    },
  },
  soft_bounce_rate: {
    raw: {
      gt: 20,
    },
  },
};

const webhookSubtitle = (
  <Fragment>
    {'Create a webhook for this alert. '}
    <ExternalLink to="https://www.sparkpost.com/docs/user-guide/alerts/#webhook-payload-sample">
      Sample payload
    </ExternalLink>
  </Fragment>
);

const slackSubtitle = (
  <Fragment>
    {'Integrate this alert with Slack. '}
    <ExternalLink to="https://api.slack.com/incoming-webhooks">
      How to create a Slack Incoming webhook
    </ExternalLink>
  </Fragment>
);

export const NOTIFICATION_CHANNEL_DATA = {
  emails: {
    icon: <EmailIcon />,
    subtitle: 'Receive notifications through email. One address per line. Up to 10 addresses.',
    fieldProps: {
      validate: [
        ifStringPresent(emails),
        ifStringPresent(maxItems(10)),
        ifStringPresent(noDuplicateItems),
      ],
      placeholder: 'example@email.com',
      multiline: true,
    },
  },
  slack: {
    icon: <SlackIcon />,
    subtitle: slackSubtitle,
    fieldProps: {
      placeholder: 'https://hooks.slack.com/services/T00/B00/XX ',
    },
  },
  webhook: {
    icon: <WebhookIcon />,
    subtitle: webhookSubtitle,
    fieldProps: {
      placeholder: 'https://example.com/webhook-target',
    },
  },
};

export const SIGNALS_FILTERS = ['none', 'ip_pool', 'mailbox_provider', 'sending_domain'];

export const REALTIME_FILTERS = ['sending_ip', 'mailbox_provider', 'sending_domain'];

export const SOURCE_FRIENDLY_NAMES = {
  raw: 'Score',
  week_over_week: 'Week over Week',
  day_over_day: 'Day over Day',
};

export const OPERATOR_FRIENDLY_NAMES = {
  gt: 'Above',
  lt: 'Below',
};

export const NOTIFICATION_CHANNELS = ['emails', 'slack', 'webhook'];

export const DEFAULT_FORM_VALUES = {
  name: '',
  metric: '',
  subaccounts: [],
  sending_ip: [],
  mailbox_provider: [],
  sending_domain: [],
  single_filter: { filter_type: 'none', filter_values: [] },
  source: 'raw',
  operator: 'gt',
  value: 0,
  muted: false,
};
