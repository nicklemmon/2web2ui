import React from 'react';
import { shallow } from 'enzyme';
import { SendingDomainsTab, getRowData } from '../SendingDomainsTab';

describe('SendingDomainsTab', () => {
  const defaultProps = {
    domains: [
      {
        domain: 'foo.com',
      },
      {
        domain: 'bar.com',
      },
    ],
    loading: false,
  };

  const subject = props => shallow(<SendingDomainsTab {...defaultProps} {...props} />);

  it('should load domains in tab', () => {
    const wrapper = subject();

    expect(wrapper).toHaveTextContent('Sending Domains assigned to this subaccount.');
    expect(wrapper.find('TableCollection')).toHaveProp('rows', defaultProps.domains);
  });

  it('should show panel loading while loading domains', () => {
    const wrapper = subject({ loading: true });

    expect(wrapper.find('Loading')).toExist();
    expect(wrapper.find('TableCollection')).not.toExist();
  });

  it('should show empty message when 0 domains exist', () => {
    const wrapper = subject({ domains: [] });

    expect(wrapper).toHaveTextContent(
      'This subaccount has no sending domains assigned to it. You can assign an existing one, or create a new one.',
    );
    expect(wrapper.find('PageLink')).toHaveProp('to', '/account/sending-domains');
  });

  it('getRowData', () => {
    expect(getRowData({ domain: 'foo.com' })).toMatchSnapshot();
  });
});
