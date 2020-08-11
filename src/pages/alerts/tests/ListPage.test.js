import { shallow } from 'enzyme';
import React from 'react';
import { ListPage } from '../ListPage';
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: false }]),
}));

describe('Page: Alerts List', () => {
  const props = {
    listAlerts: jest.fn(),
    deleteAlert: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn(),
    error: null,
    alerts: [
      {
        id: 'id-1',
        name: 'my alert 1',
        metric: 'health_score',
        last_triggered: '2019-06-15T14:48:00.000Z',
      },
      {
        id: 'id-2',
        name: 'my alert 2',
        metric: 'health_score',
        last_triggered: null,
      },
      {
        id: 'id-3',
        name: 'my alert 3',
        metric: 'monthly_sending_limit',
        last_triggered: '2019-06-05T05:48:00.000Z',
      },
    ],
    recentlyTriggeredAlerts: [
      {
        id: 'id-1',
        name: 'my alert 1',
        metric: 'health_score',
        last_triggered: '2019-06-15T14:48:00.000Z',
        last_triggered_formatted: 'Jun 15 2019, 10:48am',
        last_triggered_timestamp: 1560610080000,
      },
      {
        id: 'id-3',
        name: 'my alert 3',
        metric: 'monthly_sending_limit',
        last_triggered: '2019-06-05T05:48:00.000Z',
        last_triggered_formatted: 'Jun 5 2019, 10:48am',
        last_triggered_timestamp: 1559746080000,
      },
    ],
    loading: false,
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ListPage {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading component when loading data', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should render error when list fails to load', () => {
    wrapper.setProps({ error: { message: 'this failed' } });
    expect(wrapper.find('ApiErrorBanner')).toMatchSnapshot();
  });

  it('should render delete modal', () => {
    wrapper.setState({ alertToDelete: { id: 1, name: 'foo' } });
    expect(wrapper.find('DeleteModal')).toMatchSnapshot();
  });

  it('should render last triggered cards correctly in order', () => {
    const { recentlyTriggeredAlerts } = props;
    const panel = wrapper
      .find('AlertsPageComponent')
      .dive()
      .find('Panel');
    expect(panel).toHaveLength(2);
    expect(panel.first().find('[data-id="link-alert-name"]')).toHaveTextContent(
      recentlyTriggeredAlerts[0].name,
    );
    expect(panel.last().find('[data-id="link-alert-name"]')).toHaveTextContent(
      recentlyTriggeredAlerts[1].name,
    );
  });

  it('should toggle delete modal', () => {
    expect(wrapper).toHaveState('alertToDelete', {});
    wrapper.instance().openDeleteModal({ id: 'test-id', name: 'mock name' });
    expect(wrapper).toHaveState('alertToDelete', { id: 'test-id', name: 'mock name' });
    expect(wrapper.find('DeleteModal').prop('open')).toEqual(true);
  });

  it('should handle delete', async () => {
    wrapper.setState({ alertToDelete: { id: 'alert-id' } });
    await wrapper.instance().handleDelete();
    expect(props.deleteAlert).toHaveBeenCalledWith({ id: 'alert-id' });
    expect(props.showAlert).toHaveBeenCalled();
  });
});
