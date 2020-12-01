import { shallow } from 'enzyme';
import React from 'react';
import { EmptyState } from 'src/components/matchbox';
import ErrorBoundary from '../ErrorBoundary';
import ErrorTracker from 'src/helpers/errorTracker';
import { DEFAULT_REDIRECT_ROUTE } from '../../../constants';

jest.mock('src/helpers/errorTracker');

describe('Component: ErrorBoundary', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      showAction: false,
      children: jest.fn(),
    };

    wrapper = shallow(
      <ErrorBoundary {...props}>
        <div>Children</div>
      </ErrorBoundary>,
    );
  });

  it('renders (children) correctly without error', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly with error', () => {
    wrapper.setState({ hasError: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('.componentDidCatch sets error state and reports the error', () => {
    const error = new Error('Oh no!');

    wrapper.instance().componentDidCatch(error);

    expect(wrapper.state('hasError')).toEqual(true);
    expect(ErrorTracker.report).toHaveBeenCalledWith('error-boundary', error);
  });

  it('renders custom cta label when passed', () => {
    wrapper.setProps({ ctaLabel: 'To Safety' });
    wrapper.setState({ hasError: true });
    expect(wrapper.find(EmptyState.LEGACY).prop('primaryAction').content).toEqual('To Safety');
  });

  it('uses custom action when passed', () => {
    const mockFn = jest.fn();
    wrapper.setProps({ ctaLabel: 'Reload Page', onCtaClick: mockFn });
    wrapper.setState({ hasError: true });
    expect(wrapper.find(EmptyState.LEGACY).prop('primaryAction').content).toEqual('Reload Page');
    expect(wrapper.find(EmptyState.LEGACY).prop('primaryAction').onClick).toBe(mockFn);
  });

  it('redirects to default landing page if custom action not passed', () => {
    window.location.replace = jest.fn();
    wrapper.setState({ hasError: true });
    wrapper
      .find(EmptyState.LEGACY)
      .prop('primaryAction')
      .onClick();
    expect(window.location.replace).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
  });

  describe('handleCtaClick', () => {
    it('replaces current location with default landing page', () => {
      window.location.replace = jest.fn();
      wrapper.instance().handleCtaClick();
      expect(window.location.replace).toHaveBeenCalledWith(DEFAULT_REDIRECT_ROUTE);
    });
  });
});
