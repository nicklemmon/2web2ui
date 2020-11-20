import React from 'react';
import { shallow } from 'enzyme';
import { SendingDomainsTab, getRowData } from '../SendingDomainsTab';
import { HibanaStateContext } from 'src/context/HibanaContext';

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
      .find(HibanaStateContext.Consumer)
      .renderProp('children')(mockConsumer());
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
      .find(HibanaStateContext.Consumer)
      .renderProp('children')(mockConsumer());

    expect(wrapper).toHaveTextContent(
      'This subaccount has no sending domains assigned to it. You can assign an existing one, or create a new one.',
    );
    expect(wrapper.find('PageLink')).toHaveProp('to', '/account/sending-domains');
  });

  it('should show a link to /domains/list/sending when hibana is enabled', () => {
    mockConsumer.mockReturnValue({ isHibanaEnabled: true });
    const wrapper = subject({ domains: [] }).renderProp('children')(mockConsumer());
    expect(wrapper.find('PageLink')).toHaveProp('to', '/domains/list/sending');
  });

  it('snapshots getRowData without hibana', () => {
    expect(getRowData({ domain: 'foo.com' }, false)).toMatchSnapshot();
  });

  it('snapshots getRowData with hibana', () => {
    expect(getRowData({ domain: 'foo.com' }, true)).toMatchSnapshot();
  });
});
