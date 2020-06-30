export const STABLE_UNIX_DATE = 1581087062000; // Stable unix timestamp (2/6/2020)
export const PAGE_URL =
  '/reports/summary?from=2020-06-22T19%3A00%3A00Z&to=2020-06-23T19%3A03%3A48Z&range=day&timezone=America%2FNew_York&precision=hour&metrics=count_targeted&metrics=count_rendered&metrics=count_accepted&metrics=count_bounce';
export const METRICS = [
  {
    name: 'Admin Bounce Rate',
    queryParam: 'admin_bounce_rate',
  },
  {
    name: 'Admin Bounced',
    queryParam: 'count_admin_bounce',
  },
  {
    name: 'Generation Failure',
    queryParam: 'count_generation_failed',
  },
  {
    name: 'Generation Rejection',
    queryParam: 'count_generation_rejection',
  },
  {
    name: 'Injected',
    queryParam: 'count_injected',
  },
  {
    name: 'Policy Rejection',
    queryParam: 'count_policy_rejection',
  },
  {
    name: 'Rejected',
    queryParam: 'count_rejected',
  },
  {
    name: 'Targeted',
    queryParam: 'count_targeted',
  },
  {
    name: 'Accepted',
    queryParam: 'count_accepted',
  },
  {
    name: 'Accepted Rate',
    queryParam: 'accepted_rate',
  },
  {
    name: 'Avg Delivery Message Size',
    queryParam: 'avg_msg_size',
  },
  {
    name: 'Avg Latency 1st Attempt',
    queryParam: 'avg_delivery_time_first',
  },
  {
    name: 'Avg Latency 2+ Attempts',
    queryParam: 'avg_delivery_time_subsequent',
  },
  {
    name: 'Block Bounce Rate',
    queryParam: 'block_bounce_rate',
  },
  {
    name: 'Block Bounced',
    queryParam: 'count_block_bounce',
  },
  {
    name: 'Bounce Rate',
    queryParam: 'bounce_rate',
  },
  {
    name: 'Bounced',
    queryParam: 'count_bounce',
  },
  {
    name: 'Delayed',
    queryParam: 'count_delayed',
  },
  {
    name: 'Delayed 1st Attempt',
    queryParam: 'count_delayed_first',
  },
  {
    name: 'Delivered 1st Attempt',
    queryParam: 'count_delivered_first',
  },
  {
    name: 'Delivered 2+ Attempts',
    queryParam: 'count_delivered_subsequent',
  },
  {
    name: 'Delivery Message Volume',
    queryParam: 'total_msg_volume',
  },
  {
    name: 'Hard Bounce Rate',
    queryParam: 'hard_bounce_rate',
  },
  {
    name: 'Hard Bounced',
    queryParam: 'count_hard_bounce',
  },
  {
    name: 'Sent',
    queryParam: 'count_sent',
  },
  {
    name: 'Soft Bounce Rate',
    queryParam: 'soft_bounce_rate',
  },
  {
    name: 'Soft Bounced',
    queryParam: 'count_soft_bounce',
  },
  {
    name: 'Undetermined Bounce Rate',
    queryParam: 'undetermined_bounce_rate',
  },
  {
    name: 'Undetermined Bounced',
    queryParam: 'count_undetermined_bounce',
  },
  {
    name: 'Click-through Rate',
    queryParam: 'click_through_rate_approx',
  },
  {
    name: 'Clicks',
    queryParam: 'count_clicked',
  },
  {
    name: 'Initial Rendered',
    queryParam: 'count_initial_rendered',
  },
  {
    name: 'Initial Unique Rendered',
    queryParam: 'count_unique_initial_rendered_approx',
  },
  {
    name: 'Open Rate',
    queryParam: 'open_rate_approx',
  },
  {
    name: 'Rendered',
    queryParam: 'count_rendered',
  },
  {
    name: 'Spam Complaint Rate',
    queryParam: 'spam_complaint_rate',
  },
  {
    name: 'Spam Complaints',
    queryParam: 'count_spam_complaint',
  },
  {
    name: 'Unique Clicks',
    queryParam: 'count_unique_clicked_approx',
  },
  {
    name: 'Unique Confirmed Opens',
    queryParam: 'count_unique_confirmed_opened_approx',
  },
  {
    name: 'Unique Rendered',
    queryParam: 'count_unique_rendered_approx',
  },
  {
    name: 'Unsubscribe Rate',
    queryParam: 'unsubscribe_rate',
  },
  {
    name: 'Unsubscribes',
    queryParam: 'count_unsubscribe',
  },
];