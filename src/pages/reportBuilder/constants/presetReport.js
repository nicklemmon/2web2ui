export const PRESET_REPORT_CONFIGS = [
  {
    key: 'summary',
    name: 'Summary Report',
    query_string:
      'range=day&metrics=count_targeted&metrics=count_rendered&metrics=count_accepted&metrics=count_bounce',
    type: 'preset',
  },
  {
    key: 'bounce',
    name: 'Bounce Report',
    query_string:
      'range=day&metrics=count_targeted&metrics=count_sent&metrics=count_bounce&metrics=count_hard_bounce&metrics=count_soft_bounce&metrics=count_block_bounce&metrics=count_admin_bounce&metrics=count_undetermined_bounce&metrics=count_outofband_bounce&metrics=count_inband_bounce',
    type: 'preset',
  },
  {
    key: 'engagement',
    name: 'Engagement Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_accepted&metrics=count_clicked&metrics=open_rate_approx',
    type: 'preset',
  },
  {
    key: 'delayed',
    name: 'Delayed Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_accepted&metrics=count_delivered_first&metrics=count_delivered_subsequent&metrics=accepted_rate&metrics=count_delayed&metrics=delayed_rate',
    type: 'preset',
  },
  {
    key: 'rejections',
    name: 'Rejections Report',
    query_string: 'range=day&metrics=count_targeted&metrics=count_rejected&metrics=rejected_rate',
    type: 'preset',
  },
  {
    key: 'accepted',
    name: 'Accepted Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_accepted&metrics=accepted_rate&metrics=avg_delivery_time_first&metrics=avg_delivery_time_subsequent&metrics=avg_msg_size',
    type: 'preset',
  },
];
