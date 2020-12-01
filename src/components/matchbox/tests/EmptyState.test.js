import React from 'react';
import { shallow } from 'enzyme';
import { useHibana } from 'src/context/HibanaContext';
import EmptyState from '../EmptyState';

jest.mock('src/context/HibanaContext');

describe('EmptyState', () => {
  it('throws an error when Hibana is disabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const subject = () => shallow(<EmptyState />);

    expect(subject).toThrowError();
  });

  it('renders EmptyState.LEGACY', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: false }]);
    const wrapper = shallow(<EmptyState.LEGACY />);

    expect(wrapper).toHaveDisplayName('EmptyState');
  });

  it('renders with passed in props when Hibana is enabled', () => {
    useHibana.mockImplementationOnce(() => [{ isHibanaEnabled: true }]);
    const wrapper = shallow(
      <EmptyState>
        <EmptyState.Header>Manage your email templates</EmptyState.Header>
        <EmptyState.Content>
          <p>Build, test, preview and send your transmissions.</p>
          <EmptyState.List>
            <li>One</li>
            <li>Two</li>
            <li>Three</li>
          </EmptyState.List>
        </EmptyState.Content>
        <EmptyState.Image src="/static/Accounts-b83e28a81ccd9b2a23a493724a09cf35.jpg" />
        <EmptyState.Action>Create Template</EmptyState.Action>
        <EmptyState.Action variant="outline">Learn More</EmptyState.Action>
      </EmptyState>,
    );

    expect(wrapper).toHaveTextContent('Manage your email templates');
    expect(wrapper).toHaveTextContent('Build, test, preview and send your transmissions.');
    expect(wrapper).toHaveTextContent('One');
    expect(wrapper).toHaveTextContent('Two');
    expect(wrapper).toHaveTextContent('Three');
    expect(wrapper).toHaveTextContent('Create Template');
    expect(wrapper).toHaveTextContent('Learn More');
  });
});
