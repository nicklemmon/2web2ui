import React from 'react';
import { AddFilterLink } from '../AddFilterLink';
import { shallow } from 'enzyme';
jest.mock('src/hooks/useRouter', () =>
  jest.fn().mockReturnValue({
    location: { pathname: '/report' },
  }),
);

describe('Add Filter Link', () => {
  const filters = ['Campaign: shinynewfilter'];
  const baseProps = {
    newFilter: { id: 10, type: 'Subaccount', value: 'submarine' },
    addFilters: jest.fn(),
    currentSearchOptions: {
      filters,
      metrics: ['count_something'],
    },
  };

  function subject(props) {
    return shallow(<AddFilterLink {...baseProps} {...props} />);
  }

  it('should handle click correctly', () => {
    const wrapper = subject();
    const linkComponent = wrapper.find('PageLink');
    linkComponent.simulate('mouseUp', {});
    linkComponent.simulate('click');

    expect(linkComponent).toHaveProp(
      'to',
      '/report?filters=Campaign%3A%20shinynewfilter&filters=Subaccount%3Asubmarine%3A10&metrics=count_something',
    );
    expect(baseProps.addFilters).toHaveBeenCalledWith([
      { id: 10, type: 'Subaccount', value: 'submarine' },
    ]);
  });

  it('should handle click while holding down meta(cmd) key correctly', () => {
    const wrapper = subject();
    wrapper.find('PageLink').simulate('mouseUp', { metaKey: true });
    wrapper.find('PageLink').simulate('click');
    expect(baseProps.addFilters).not.toHaveBeenCalled();
  });

  it('should handle click while holding down control key correctly', () => {
    const wrapper = subject();
    wrapper.find('PageLink').simulate('mouseUp', { ctrlKey: true });
    wrapper.find('PageLink').simulate('click');
    expect(baseProps.addFilters).not.toHaveBeenCalled();
  });
});
