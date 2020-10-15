import React from 'react';
import { AddFilterLink } from '../AddFilterLink';
import { shallow } from 'enzyme';
import { useReportBuilderContext } from 'src/pages/reportBuilder/context/ReportBuilderContext';

jest.mock('src/hooks/useRouter', () =>
  jest.fn().mockReturnValue({
    location: { pathname: '/report' },
  }),
);

jest.mock('src/pages/reportBuilder/context/ReportBuilderContext');

describe('Add Filter Link', () => {
  const filters = ['Campaign: shinynewfilter'];
  const addFilters = jest.fn();
  const currentSearchOptions = {
    filters,
    metrics: ['count_something'],
  };
  const baseProps = {
    newFilter: { id: 10, type: 'Subaccount', value: 'submarine' },
  };
  useReportBuilderContext.mockImplementation(() => ({
    actions: { addFilters: addFilters },
    selectors: { selectSummaryChartSearchOptions: currentSearchOptions },
  }));

  function subject(props) {
    return shallow(<AddFilterLink {...baseProps} {...props} />);
  }

  it('should handle click correctly', () => {
    const wrapper = subject();
    const linkComponent = wrapper.find('ButtonLink');
    linkComponent.simulate('mouseUp', {});
    linkComponent.simulate('click');

    expect(linkComponent).toHaveProp(
      'to',
      '/report?filters=Campaign%3A%20shinynewfilter&filters=Subaccount%3Asubmarine%3A10&metrics=count_something',
    );
    expect(addFilters).toHaveBeenCalledWith({ id: 10, type: 'Subaccount', value: 'submarine' });
  });

  it('should handle click while holding down meta(cmd) key correctly', () => {
    const wrapper = subject();
    wrapper.find('ButtonLink').simulate('mouseUp', { metaKey: true });
    wrapper.find('ButtonLink').simulate('click');
    expect(addFilters).not.toHaveBeenCalled();
  });

  it('should handle click while holding down control key correctly', () => {
    const wrapper = subject();
    wrapper.find('ButtonLink').simulate('mouseUp', { ctrlKey: true });
    wrapper.find('ButtonLink').simulate('click');
    expect(addFilters).not.toHaveBeenCalled();
  });
});
