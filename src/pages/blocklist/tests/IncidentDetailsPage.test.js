import { mount } from 'enzyme';
import React from 'react';
import TestApp from 'src/__testHelpers__/TestApp';
import { IncidentDetailsPage } from '../IncidentDetailsPage';
import RelatedIncidents from '../components/RelatedIncidents';
import IncidentDetails from '../components/IncidentDetails';

jest.mock('../components/IncidentDetails');
IncidentDetails.mockImplementation(() => <div className="mock-incident-details"></div>);

jest.mock('../components/RelatedIncidents');
RelatedIncidents.mockImplementation(() => <div className="mock-related-incidents"></div>);

const mockIncident = {
  id: '123',
  resource: '1.2.3.4',
  blacklist_name: 'spamhaus.org - pbl',
  occurred_at: '2019-12-31T18:14:57.899Z',
  resolved_at: '2019-12-31T19:01:32.741Z',
  status: 'resolved',
};

const mockHistoricalIncidents = [
  {
    id: '1234',
    resource: '1.2.3.4',
    blacklist_name: 'spamhaus.org - pbl',
    occurred_at: '2019-12-31T18:14:57.899Z',
    resolved_at: '2019-12-31T19:01:32.741Z',
    status: 'resolved',
  },
];

const mockIncidentsForResource = [
  {
    id: '1234',
    resource: '1.2.3.4',
    blacklist_name: 'spamhaus.org 2',
    occurred_at: '2019-12-31T18:14:57.899Z',
    resolved_at: '2019-12-31T19:01:32.741Z',
    status: 'resolved',
  },
];

const mockIncidentsForBlocklist = [
  {
    id: '2345',
    resource: '2.3.4.5',
    blacklist_name: 'spamhaus.org - pbl',
    occurred_at: '2019-12-31T18:14:57.899Z',
    resolved_at: '2019-12-31T19:01:32.741Z',
    status: 'resolved',
  },
];

describe('IncidentDetailsPage', () => {
  const mockGetIncident = jest.fn(() => Promise.resolve(mockIncident));
  const mockListIncidentsForResource = jest.fn();
  const mockListIncidentsForBlocklist = jest.fn();
  const mockListHistoricalResolvedIncidents = jest.fn();

  const subject = ({ ...props }) => {
    const defaults = {
      id: mockIncident.id,
      getIncident: mockGetIncident,
      listIncidentsForResource: mockListIncidentsForResource,
      listIncidentsForBlocklist: mockListIncidentsForBlocklist,
      listHistoricalResolvedIncidents: mockListHistoricalResolvedIncidents,
    };
    return mount(
      <TestApp>
        <IncidentDetailsPage {...defaults} {...props} />
      </TestApp>,
    );
  };

  it('fetches incident, similar incidents for resource and blocklist, and historical incidents on mount', async () => {
    const wrapper = subject({ loading: true });

    wrapper.update();

    expect(mockGetIncident).toHaveBeenCalledWith(mockIncident.id);
    wrapper.update();
    await mockGetIncident(mockIncident.id).then(() => {
      expect(mockListIncidentsForResource).toHaveBeenCalledWith(mockIncident.resource);
      expect(mockListIncidentsForBlocklist).toHaveBeenCalledWith(mockIncident.blacklist_name);
      expect(mockListHistoricalResolvedIncidents).toHaveBeenCalledWith(
        mockIncident.blacklist_name,
        mockIncident.resource,
      );
    });
  });

  it('renders the 3 panels once data has come back', () => {
    const wrapper = subject({
      loading: false,
      incident: mockIncident,
      incidentsForBlocklist: mockIncidentsForBlocklist,
      incidentsForResource: mockIncidentsForResource,
      historicalIncidents: mockHistoricalIncidents,
    });

    wrapper.update();

    expect(wrapper.find('.mock-related-incidents')).toHaveLength(2);
    expect(wrapper.find('.mock-incident-details')).toHaveLength(1);
  });
});
