import { shallow } from 'enzyme';
import React from 'react';
import { AlertDetails } from '../AlertDetails';
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: false }]),
}));

describe('Alert Details Component', () => {
  const alert = {
    name: 'My Alert Name',
    metric: 'health_score',
    channels: {
      emails: ['Myemail@email.com', 'email@ddress.com'],
      slack: { target: 'https://hooks.slack.com/services/X' },
      webhook: { target: 'target.com/200' },
    },
    filters: [{ filter_type: 'mailbox_provider', filter_values: ['gmail'] }],
    threshold_evaluator: { source: 'raw', operator: 'lt', value: 80 },
    subaccounts: [-1],
    any_subaccount: false,
    muted: false,
  };
  const props = {
    alert,
    id: 'alert-id',
    subaccountIdToString: jest.fn(a => a),
    hasSubaccounts: true,
    renderPrimaryAreaComponent: () => <div>My Primary Area</div>,
  };

  it('should show Any Subaccount tag in the subaccounts field if no subaccounts and any_subaccount is true', () => {
    const newAlert = { ...alert, subaccounts: [], any_subaccount: true };
    const wrapper = shallow(<AlertDetails {...props} alert={newAlert} />);
    const filterWrapper = wrapper.find({ label: 'Filtered By:' }).dive();
    expect(filterWrapper.findWhere(node => node.text() === 'Any Subaccount')).toExist();
  });

  it('should prepend change to the operator when source is WOW change', () => {
    const newAlert = {
      ...alert,
      threshold_evaluator: { source: 'week_over_week', operator: 'gt', value: 5 },
    };
    const wrapper = shallow(<AlertDetails {...props} alert={newAlert} />);
    const evaluatorWrapper = wrapper.find({ label: 'Condition:' }).dive();
    expect(evaluatorWrapper.findWhere(node => node.debug() === 'change ')).toExist();
  });

  it('should show % in suffix when source is WOW change', () => {
    const newAlert = {
      ...alert,
      threshold_evaluator: { source: 'week_over_week', operator: 'gt', value: 5 },
    };
    const wrapper = shallow(<AlertDetails {...props} alert={newAlert} />);
    const evaluatorWrapper = wrapper.find({ label: 'Condition:' }).dive();
    expect(evaluatorWrapper.findWhere(node => node.text() === '%')).toExist();
  });

  it('should show only email tags when email is the only channel', () => {
    const newAlert = { ...alert, channels: { emails: ['Myemail@email.com', 'email@ddress.com'] } };
    const wrapper = shallow(<AlertDetails {...props} alert={newAlert} />);
    const notifyWrapper = wrapper.find({ label: 'Notify:' }).dive();
    expect(notifyWrapper.find({ id: 'email' })).toExist();
    expect(notifyWrapper.find('SlackIcon')).not.toExist();
    expect(notifyWrapper.find('WebhookIcon')).not.toExist();
  });

  it('should show other channels even if emails are not present', () => {
    const newAlert = { ...alert, channels: { slack: { target: 'myslackTarget' } } };
    const wrapper = shallow(<AlertDetails {...props} alert={newAlert} />);
    const notifyWrapper = wrapper.find({ label: 'Notify:' }).dive();
    expect(notifyWrapper.find({ id: 'email' })).not.toExist();
    expect(notifyWrapper.find('SlackIcon')).toExist();
  });

  it('should not render evaluator section when empty', () => {
    const wrapper = shallow(
      <AlertDetails {...props} alert={{ ...alert, threshold_evaluator: {} }} />,
    );
    expect(wrapper).not.toHaveTextContent('Condition:');
  });

  it('should not render evaluator section for blocklist alerts', () => {
    const wrapper = shallow(<AlertDetails {...props} alert={{ ...alert, metric: 'blocklist' }} />);
    expect(wrapper).not.toHaveTextContent('Condition:');
  });
});
