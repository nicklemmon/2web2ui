export const PRESET_REPORT_CONFIGS = [
  {
    name: 'Summary Report',
    query_string:
      'range=day&metrics=count_targeted&metrics=count_rendered&metrics=count_accepted&metrics=count_bounce',
  },
  {
    name: 'Bounce Report',
    query_string:
      'range=day&metrics=count_targeted&metrics=count_sent&metrics=count_bounce&metrics=count_hard_bounce&metrics=count_soft_bounce&metrics=count_block_bounce&metrics=count_admin_bounce&metrics=count_undetermined_bounce&metrics=count_outofband_bounce&metrics=count_inband_bounce',
  },
  {
    name: 'Engagement Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_accepted&metrics=count_clicked&metrics=open_rate_approx',
  },
  {
    name: 'Delayed Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_sent&metrics=count_accepted&metrics=count_delivered_first&metrics=count_delivered_subsequent&metrics=accepted_rate&metrics=count_delayed&metrics=delayed_rate',
  },
  {
    name: 'Rejections Report',
    query_string: 'range=day&metrics=count_targeted&metrics=count_rejected&metrics=rejected_rate',
  },
  {
    name: 'Accepted Report',
    query_string:
      'range=day&metrics=count_sent&metrics=count_accepted&metrics=accepted_rate&metrics=avg_delivery_time_first&metrics=avg_delivery_time_subsequent&metrics=avg_msg_size',
  },
];
