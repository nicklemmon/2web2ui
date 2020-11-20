import React from 'react';
import { shallow } from 'enzyme';
import { SendingDomainsTab, getRowData } from '../SendingDomainsTab';
import * as HibanaContext from 'src/context/HibanaContext';

const mockConsumer = jest.fn();

describe('SendingDomainsTab', () => {
  beforeEach(() => {
    mockConsumer.mockReset();
  });

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
    mockConsumer.mockReturnValue({ isHibanaEnabled: false });
    const wrapper = subject()
      .find(HibanaContext.HibanaStateContext.Consumer)
      .renderProp('children')();
    expect(wrapper).toHaveTextContent('Sending Domains assigned to this subaccount.');
    expect(wrapper.find('TableCollection')).toHaveProp('rows', defaultProps.domains);
  });

  it('should show panel loading while loading domains', () => {
    mockConsumer.mockReturnValue({ isHibanaEnabled: false });
    const wrapper = subject({ loading: true });
    expect(wrapper.find('Loading')).toExist();
    expect(wrapper.find('TableCollection')).not.toExist();
  });

  it('should show empty message when 0 domains exist', () => {
    mockConsumer.mockReturnValue({ isHibanaEnabled: false });
    const wrapper = subject({ domains: [] })
      .find(HibanaContext.HibanaStateContext.Consumer)
      .renderProp('children')(mockConsumer());

    expect(wrapper).toHaveTextContent(
      'This subaccount has no sending domains assigned to it. You can assign an existing one, or create a new one.',
    );
    expect(wrapper.find('PageLink')).toHaveProp('to', '/account/sending-domains');
  });

  it('should show a link to /domains/list/sending when hibana is enabled', () => {
    mockConsumer.mockReturnValue({ isHibanaEnabled: false });
    const wrapper = subject({ domains: [] }).renderProp('children')(mockConsumer());
    expect(wrapper.find('PageLink')).toHaveProp('to', '/domains/list/sending');
  });

  it('getRowData', () => {
    mockConsumer.mockReturnValue({ isHibanaEnabled: true });
    expect(getRowData({ domain: 'foo.com' })).toMatchSnapshot();
  });
});
