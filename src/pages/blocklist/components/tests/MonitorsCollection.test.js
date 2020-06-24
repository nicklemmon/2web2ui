import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import MonitorssCollection from '../MonitorsCollection';

describe('Blocklist Component: MonitorsCollection', () => {
  const monitors = [
    {
      resource: '1.2.3.4',
      currently_blacklisted_on: ['SpamHaus-SBL', 'Invaluement-ivmSIP'],
      last_listed_at: '2019-07-23T12:48:00.000Z',
      watched_at: '2019-07-23T12:48:00.000Z',
      total_listing_count: 12,
      active_listing_count: 2,
    },
  ];
  const subject = ({ ...props }) => {
    const defaults = { monitors };

    return render(
      <TestApp>
        <MonitorssCollection {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders the rows correctly', () => {
    const { queryByText } = subject();
    //row data
    expect(queryByText('1.2.3.4')).toBeInTheDocument();
    expect(queryByText('12')).toBeInTheDocument();
    expect(queryByText('2')).toBeInTheDocument();

    //headers
    expect(queryByText('Watched')).toBeInTheDocument();
    expect(queryByText('Current Blocklistings')).toBeInTheDocument();
    expect(queryByText('Historic Blocklistings')).toBeInTheDocument();
  });

  it('links each item to the incidents page filtered by the resource', () => {
    const { queryByText } = subject();
    const anchor = queryByText('1.2.3.4');
    expect(anchor.getAttribute('href')).toBe('/blocklist/incidents?search=1.2.3.4');
  });
});
