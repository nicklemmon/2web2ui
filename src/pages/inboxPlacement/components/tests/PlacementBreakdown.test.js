import React from 'react';
import { shallow } from 'enzyme';
import PlacementBreakdown from '../PlacementBreakdown';

describe('Component: PlacementBreakdown', () => {
  const data = [
    {
      mailbox_provider: 'dogmail.com',
      region: 'north america',
      sending_ip: '101.101',
      placement: {
        inbox_pct: 0,
        spam_pct: 0,
        missing_pct: 1,
      },
      authentication: {
        spf_pct: 0,
        dkim_pct: 0,
        dmarc_pct: 1,
      },
    },
    {
      mailbox_provider: 'doghouseinbox.com',
      region: 'europe',
      sending_ip: '101.102',
      placement: {
        inbox_pct: 0.8,
        spam_pct: 0.1,
        missing_pct: 0.1,
      },
      authentication: {
        spf_pct: 0.8,
        dkim_pct: 0.1,
        dmarc_pct: 0.1,
      },
    },
  ];

  const subject = props => shallow(<PlacementBreakdown data={[]} {...props} />);

  it('renders correctly with no data', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('matches snapshot with provider data', () => {
    expect(subject({ data })).toMatchSnapshot();
  });
});
