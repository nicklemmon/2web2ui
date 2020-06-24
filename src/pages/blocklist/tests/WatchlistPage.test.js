import React from 'react';
import { shallow } from 'enzyme';
import { fireEvent, render } from '@testing-library/react';
import TestApp from 'src/__testHelpers__/TestApp';
import { WatchlistPage } from '../WatchlistPage';

jest.mock('../components/RemoveFromWatchlistModal', () => () => 'My Delete Modal');

describe('WatchlistPage', () => {
  const monitors = [
    {
      resource: '101.101',
      currently_blacklisted_on: [],
      total_listing_count: 2,
      active_listing_count: 2,
      watched_at: '2019-07-13T00:00:00.000Z',
      last_listed_at: '2019-07-20T00:00:00.000Z',
    },
  ];

  const mockListMonitors = jest.fn();

  const renderSubject = props => {
    const defaults = {
      monitors: monitors,
      error: null,
      loading: null,
      listMonitors: mockListMonitors,
      hasBlocklisted: true,
    };

    return render(
      <TestApp>
        <WatchlistPage {...defaults} {...props} />
      </TestApp>,
    );
  };

  const shallowSubject = props => {
    const defaults = {
      monitors: monitors,
      error: null,
      loading: null,
      listMonitors: mockListMonitors,
      hasBlocklisted: true,
    };
    return shallow(<WatchlistPage {...defaults} {...props} />);
  };

  it('renders loading component when loading data', () => {
    const { queryByTestId } = renderSubject({ loading: true });

    expect(queryByTestId('loading')).toBeInTheDocument();
  });

  it('renders error banner when an error occurs', () => {
    const wrapper = shallowSubject({ error: { message: 'You dun goofed' } });
    expect(wrapper.find({ 'data-id': 'error-banner' })).toExist();
  });

  it('renders congratulations banner when no current blocklistings', () => {
    const { queryByTestId } = renderSubject({ hasBlocklisted: false });
    expect(queryByTestId('congrats-banner')).toBeInTheDocument();
  });

  it('Congrats Banner onDismiss correctly closes the banner', () => {
    const wrapper = shallowSubject({ hasBlocklisted: false });
    const bannerWrapper = wrapper.find('CongratsBanner');
    expect(bannerWrapper).toExist();
    bannerWrapper.prop('onDismiss')();
    const bannerWrapperAfterDismiss = wrapper.find('CongratsBanner');
    expect(bannerWrapperAfterDismiss).not.toExist();
  });

  it('renders Monitors Collection when correct data exists', () => {
    const wrapper = shallowSubject();
    expect(wrapper.find({ 'data-id': 'monitors-table' })).toExist();
  });

  it('renders delete modal when trying to delete a resource', () => {
    const { queryByText } = renderSubject();
    fireEvent.click(queryByText('Remove from Watchlist'));
    expect(queryByText('My Delete Modal')).toBeInTheDocument();
  });

  it('loads monitors when page starts rendering', () => {
    renderSubject();
    expect(mockListMonitors).toHaveBeenCalled();
  });
});
