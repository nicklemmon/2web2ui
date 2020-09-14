import React from 'react';
import { shallow } from 'enzyme';
import { render } from '@testing-library/react';
import MessageEventsPage, { MessageEventsPageComponent } from '../MessageEventsPage';
import { CursorPaging } from 'src/components/collection/CursorPaging';
import * as downloading from 'src/helpers/downloading';
import styles from './MessageEventsPage.module.scss';
import { GUIDE_IDS } from 'src/constants';
import TestApp from 'src/__testHelpers__/TestApp';

let wrapper;
let instance;

describe('Page: Message Events tests', () => {
  const props = {
    empty: false,
    error: null,
    loading: false,
    getMessageEvents: jest.fn(() => []),
    getMessageEventsCSV: jest.fn(() => []),
    changePage: jest.fn(() => []),
    clearCSV: jest.fn(),
    refreshReportOptions: jest.fn(),
    events: [
      {
        formattedDate: 'so-formatted',
        type: 'delivery',
        friendly_from: 'hi@friendly',
        rcpt_to: 'ron.swanson@pawnee.state.in.us',
        subject: 'Cool',
      },
      {
        formattedDate: 'formatted',
        type: 'injection',
        friendly_from: 'mean@friendly',
        rcpt_to: 'tom.haverford@pawnee.state.in.us',
        subject: 'More Title',
      },
    ],
    history: {
      push: jest.fn(),
    },
    location: {
      state: { triggerGuide: true },
    },
    search: {
      dateOptions: {},
      recipients: [],
    },
    linkByPage: ['cursor=foo', 'cursor=bar', 'cursor=foobar', null],
    cachedResultsByPage: [[]],
    hasMorePagesAvailable: true,
    totalCount: 100,
    eventsCSV: [],
    eventsCSVLoading: false,
    styles,
    isHibanaEnabled: false,
  };
  const mockshow = jest.fn();
  window.Appcues = {};
  window.Appcues = { show: mockshow };

  beforeEach(() => {
    wrapper = shallow(<MessageEventsPageComponent {...props} />);
    instance = wrapper.instance();
    wrapper.setState({
      currentPage: 2,
      perPage: 25,
    });
    downloading.download = jest.fn();
    downloading.formatToCsv = jest.fn();
  });

  it('should render page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('refreshes on change in search filters', () => {
    const search = { ...props.search, changed: 'something' };
    wrapper.setProps({ search });
    expect(props.getMessageEvents).toHaveBeenCalledWith({
      ...search,
      perPage: wrapper.state().perPage,
    });
  });

  it('starts downloading events as CSV', () => {
    const eventsCSV = ['foo'];
    wrapper.setProps({ eventsCSV });
    expect(downloading.formatToCsv).toHaveBeenCalled();
    expect(downloading.download).toHaveBeenCalled();
  });

  it('does not refresh if search has not changed', () => {
    wrapper.setProps({ search: props.search, changed: 'something else' });
    expect(props.getMessageEvents).not.toHaveBeenCalled();
  });

  it('should render error when action fails', () => {
    wrapper.setProps({ error: { message: "You done f'ed up now" } });
    expect(wrapper).toMatchSnapshot();
    wrapper
      .find('ApiErrorBanner')
      .props()
      .reload();
    expect(wrapper.instance().props.getMessageEvents).toHaveBeenCalledWith({
      dateOptions: {},
      recipients: [],
    });
  });

  it('should start retrieving CSV data when clicking Save as CSV', () => {
    wrapper
      .find('Button')
      .last()
      .simulate('click');
    expect(wrapper.instance().props.getMessageEventsCSV).toHaveBeenCalledWith({
      dateOptions: {},
      recipients: [],
    });
  });

  it('should correctly disable previous button', () => {
    wrapper.setState({ currentPage: 1 });
    expect(wrapper.find(CursorPaging).prop('previousDisabled')).toEqual(true);
  });

  it('should correctly disable next button', () => {
    wrapper.setProps({ hasMorePagesAvailable: false });
    expect(wrapper.find(CursorPaging).prop('nextDisabled')).toEqual(true);
  });

  it('should correctly handle changing per page', () => {
    const perPage = 100;
    const { getMessageEvents, search } = props;
    instance.handlePerPageChange(perPage);
    expect(getMessageEvents).toHaveBeenCalledWith({ ...search, perPage });
  });

  it('should correctly handle changing page', () => {
    const { changePage } = props;
    const pageNumber = 1;
    instance.handlePageChange(pageNumber);
    expect(changePage).toHaveBeenCalledWith(pageNumber);
  });

  it('should correctly handle first page reload', () => {
    const { getMessageEvents, search } = props;
    instance.handleFirstPage();
    const { perPage } = wrapper.state();
    expect(getMessageEvents).toHaveBeenCalledWith({ ...search, perPage });
  });

  it('should only render loading component while loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the empty message when 0 results are returned', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('getRowData', () => {
    let event;
    beforeEach(() => {
      event = {
        formattedDate: 'formatted',
        type: 'injection',
        friendly_from: 'mean@friendly',
        rcpt_to: 'tom.haverford@pawnee.state.in.us',
        message_id: '123abc',
        event_id: '456xyz',
      };
    });

    it('renders correctly', () => {
      expect(instance.getRowData(event)).toMatchSnapshot();
    });
  });

  it('should trigger guide when location state has triggerGuide set to true', () => {
    wrapper = render(
      <TestApp>
        <MessageEventsPage {...props} />
      </TestApp>,
    );

    expect(mockshow).toHaveBeenCalledWith(GUIDE_IDS.CHECKOUT_EVENTS);
  });
});
