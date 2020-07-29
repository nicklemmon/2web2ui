import { shallow } from 'enzyme';
import React from 'react';
import moment from 'moment';
import { tests } from './mockTests';
import useRouter from 'src/hooks/useRouter';

import { TestListPage } from '../TestListPage';

jest.mock('src/hooks/useHibanaOverride', () => styles => styles);
jest.mock('src/hooks/useRouter');

describe('Page: Test List', () => {
  const now = moment.utc(new Date('2019-08-10T12:30:00-04:00'));
  Date.now = jest.fn(() => now);
  const subject = props => {
    const from = moment(now).subtract(30, 'd');
    const to = now;
    useRouter.mockReturnValue({
      requestParams: {
        from,
        to,
      },
      updateRoute: jest.fn(),
    });
    const defaults = {
      testsError: false,
      testsPending: false,
      tests: [],
      listTests: jest.fn(),
      filters: {
        dateRange: {
          from,
          to,
        },
        tags: {},
      },
    };

    return shallow(<TestListPage {...defaults} {...props} />);
  };

  it('renders page correctly with defaults', () => {
    const wrapper = subject();

    expect(wrapper).toMatchSnapshot();
  });

  it('renders page with tests', () => {
    const wrapper = subject({ tests });
    expect(wrapper.find('Page')).toMatchSnapshot();
  });

  it('renders empty landing page when there are no tests', () => {
    const wrapper = subject({ tests: [] });
    expect(wrapper.find('Page').prop('empty')).toHaveProperty('show', true);
  });

  it('renders loading', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper.find('Loading')).toExist();
  });

  it('renders error message', () => {
    const wrapper = subject({ error: true });
    expect(wrapper.find('ApiErrorBanner')).toExist();
  });

  describe('Test Name:', () => {
    const renderFirstColumn = props => {
      const wrapper = subject();
      const Rows = wrapper.find('FilterSortCollection').prop('rowComponent');
      const Row = () => shallow(<Rows {...tests[0]} {...props} />).prop('rowData');

      return shallow(<Row />);
    };

    it('render test name and divider if test name exists', () => {
      const wrapper = renderFirstColumn();
      expect(wrapper).toHaveTextContent(tests[0].test_name);
    });

    it('doest not render test name and divider if test name does not exist', () => {
      const wrapper = renderFirstColumn({ test_name: undefined });
      expect(wrapper.at(0)).not.toIncludeText('|');
    });
  });
});
