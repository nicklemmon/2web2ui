import React from 'react';
import { render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import IncidentDetails from '../IncidentDetails';

describe('Blocklist Component: RelatedIncidents', () => {
  const subject = ({ ...props }) => {
    const defaults = {
      resourceName: '1.2.3.4',
      blocklistName: 'spamhaus.org - sbl',
      listedTimestamp: '2019-05-23T12:48:00.000Z',
      resolvedTimestamp: '2019-05-24T13:48:00.000Z',
      daysListed: 45,
      historicalIncidents: [],
    };

    return render(
      <TestApp>
        <IncidentDetails {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders the listed date', () => {
    const { queryByText } = subject();
    expect(queryByText('Date Listed')).toBeInTheDocument();
    expect(queryByText('May 23 2019')).toBeInTheDocument();
  });

  it('renders the resolved date', () => {
    const { queryByText } = subject();
    expect(queryByText('Date Resolved')).toBeInTheDocument();
    expect(queryByText('May 24 2019')).toBeInTheDocument();
  });

  it('renders the days listed', () => {
    const { queryByText } = subject();
    expect(queryByText('Days Listed')).toBeInTheDocument();
    expect(queryByText('45')).toBeInTheDocument();
  });

  it('renders the empty state of no historical listings', () => {
    const { queryByText } = subject();
    expect(queryByText('Historical Incidents')).toBeInTheDocument();
    expect(
      queryByText('No historical incidents for 1.2.3.4 on spamhaus.org - sbl'),
    ).toBeInTheDocument();
  });

  it('renders the non-empty state of historical listings', () => {
    const { queryByText } = subject({
      historicalIncidents: [
        {
          id: 'abc',
          occurred_at_formatted: 'Jan 1 2019, 5:35pm',
          resolved_at_formatted: 'Jan 4 2019, 5:35pm',
        },
      ],
    });
    const anchor = queryByText('Listed Jan 1 2019, 5:35pm | Resolved Jan 4 2019, 5:35pm');
    expect(anchor).toBeInTheDocument();
    expect(anchor.getAttribute('href')).toBe('/blocklist/incidents/abc');
  });
});
