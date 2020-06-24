import { render } from '@testing-library/react';
import React from 'react';
import useRouter from 'src/hooks/useRouter';
import { IncidentsPage } from '../IncidentsPage';
import IncidentsCollection from '../components/IncidentsCollection';
import userEvent from '@testing-library/user-event';
import TestApp from 'src/__testHelpers__/TestApp';

jest.mock('../components/IncidentsCollection');
IncidentsCollection.mockImplementation(({ updateDateRange }) => (
  <button onClick={() => updateDateRange({ to: '123', from: '234', range: '567' })}>
    Update DatePicker
  </button>
));

jest.mock('src/hooks/useRouter');
useRouter.mockReturnValue({
  requestParams: {
    search: '',
  },
  updateRoute: jest.fn(),
});

describe('IncidentsPage', () => {
  const incidents = [
    {
      id: 1,
      resource: '101.101',
      blacklist_name: 'spammy mcspamface',
      occurred_at_formatted: 'Dec 3 2019 at 10:00am',
      occurred_at_timestamp: 123456789,
    },
  ];

  const monitors = [
    {
      resource: '101.101',
      currently_blacklisted_on: [],
    },
  ];

  const mockListMonitors = jest.fn();
  const mockListIncidents = jest.fn();

  const subject = ({ ...props }) => {
    const now = new Date('2019-12-18T04:20:00-04:00');
    Date.now = jest.fn(() => now);

    const defaults = {
      incidents: incidents,
      monitors: monitors,
      error: null,
      loading: null,
      listMonitors: mockListMonitors,
      listIncidents: mockListIncidents,
    };
    return render(
      <TestApp>
        <IncidentsPage {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('renders loading component when loading data', () => {
    const { queryByTestId } = subject({ loading: true });

    expect(queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders error banner when an error occurs', () => {
    const { queryByTestId } = subject({ error: { message: 'You dun goofed' } });
    //Can't search for the text because it is initially hidden
    expect(queryByTestId('error-banner')).toBeInTheDocument();
  });

  it('renders Incidents Collection when correct data exists', () => {
    const { queryByTestId } = subject();
    expect(queryByTestId('incidents-table')).toBeInTheDocument();
  });

  it('loads monitors and incidents when page starts rendering', () => {
    subject();
    expect(mockListMonitors).toHaveBeenCalled();
    expect(mockListIncidents).toHaveBeenCalled();
  });

  it('reloads incidents when datepicker updates', () => {
    const { queryByText } = subject();
    userEvent.click(queryByText('Update DatePicker'));
    expect(mockListIncidents).toHaveBeenCalled();
  });
});
