import React from 'react';
import { shallow } from 'enzyme';
import Subaccount from '../Subaccount';

describe('Component: Subaccount', () => {
  const subject = props => shallow(<Subaccount {...props} />);

  it('should render subaccount name and id in Name(id) format', () => {
    expect(subject({ id: 12, name: 'ABCName' }).text()).toEqual('ABCName (12)');
  });

  it('should render a non-default assigned subaccount', () => {
    expect(subject({ id: 12 }).text()).toEqual('Subaccount 12');
    expect(subject({ id: '13' }).text()).toEqual('Subaccount 13');
  });

  it('should render a default assigned subaccount', () => {
    expect(subject({ id: 12, isDefault: true }).text()).toEqual('Subaccount 12 (Default)');
  });

  it('should render a shared with all tag', () => {
    expect(subject({ all: true }).text()).toEqual('Shared with all');
  });

  it('should render a master account tag', () => {
    expect(subject({ master: true }).text()).toEqual('Primary Account');
  });
});
