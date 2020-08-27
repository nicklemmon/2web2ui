import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';
import { AlertForm } from '../AlertForm';
import { DEFAULT_FORM_VALUES } from '../../constants/formConstants';
import * as alertFormHelper from '../../helpers/alertForm';
import SubaccountField from '../../components/fields/SubaccountsField';
import FilterFields from '../../components/fields/FilterFields';
import EvaluatorFields from '../../components/fields/EvaluatorFields';
jest.mock('src/context/HibanaContext', () => ({
  useHibana: jest.fn().mockReturnValue([{ isHibanaEnabled: false }]),
}));

describe('Alert Form Component', () => {
  let props;
  let wrapper;
  const mockChange = jest.fn();

  beforeEach(() => {
    props = {
      ...DEFAULT_FORM_VALUES,
      handleSubmit: jest.fn(),
      submitting: false,
      hasSubaccounts: true,
      name: 'shortname',
      pristine: true,
      invalid: false,
      metric: 'health_score',
      change: mockChange,
      formMeta: {},
      formErrors: {},
      isNewAlert: true,
      initialValues: {},
      featureFlaggedAlerts: {
        injection_count: false,
      },
    };

    wrapper = shallow(<AlertForm {...props} />);
  });

  it('should render the alert form component correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle submit', () => {
    wrapper.find('Form').simulate('submit');
    expect(props.handleSubmit).toHaveBeenCalled();
  });

  it('should reset form values when changing metric', () => {
    wrapper.find({ name: 'metric' }).simulate('change', { target: { value: 'block_bounce_rate' } });
    expect(mockChange).toHaveBeenCalledTimes(7); //4 filters + 3 default values ;
  });

  it('should show filters when metric has filters', () => {
    jest.spyOn(alertFormHelper, 'getFormSpec').mockImplementationOnce(() => ({ hasFilters: true }));
    wrapper = shallow(<AlertForm {...props} />);
    expect(wrapper.find(SubaccountField)).toExist();
    expect(wrapper.find(FilterFields)).toExist();
  });

  it('should not show filters when metric has no filters', () => {
    jest
      .spyOn(alertFormHelper, 'getFormSpec')
      .mockImplementationOnce(() => ({ hasFilters: false }));
    wrapper = shallow(<AlertForm {...props} />);
    expect(wrapper.find(SubaccountField)).not.toExist();
    expect(wrapper.find(FilterFields)).not.toExist();
  });

  it('should not show subaccounts when user has no subaccounts', () => {
    jest.spyOn(alertFormHelper, 'getFormSpec').mockImplementationOnce(() => ({ hasFilters: true }));
    wrapper = shallow(<AlertForm {...props} hasSubaccounts={false} />);
    expect(wrapper.find(SubaccountField)).not.toExist();
    expect(wrapper.find(FilterFields)).toExist();
  });

  it('should show evaluator Fields when metric selected', () => {
    wrapper.setProps({ metric: 'health_score' });
    expect(wrapper.find(EvaluatorFields)).toExist();
  });

  it('should not show evaluator Fields when metric is the default "Select Metric" option', () => {
    wrapper.setProps({ metric: '' });
    expect(wrapper.find(EvaluatorFields)).not.toExist();
  });

  it('should show error when every notification channel is empty', () => {
    const formMeta = { emails: { touched: true } };
    const formErrors = { emails: 'At least one notification channel must not be empty' };
    wrapper.setProps({ formMeta, formErrors });
    expect(wrapper.find('Error')).toExist();
  });

  it('should hide evaluator for blocklist metric', () => {
    wrapper.setProps({ metric: 'blocklist' });
    expect(wrapper.find('.Evaluator')).not.toExist();
  });

  it('should hide subaccount field for blocklist metric', () => {
    wrapper.setProps({ metric: 'blocklist' });
    expect(wrapper.find('Connect(SubaccountsField)')).not.toExist();
  });

  cases(
    'metric options',
    ({ name, ...props }) => {
      wrapper.setProps(props);
      let assertion = expect(wrapper.find('Field[name="metric"]').prop('options'));

      if (/should hide/.test(name)) {
        assertion = assertion.not;
      }

      assertion.toContainEqual({ label: 'Health Score', value: 'health_score' });
    },
    {
      'should show unflagged metric': {
        featureFlaggedAlerts: {},
      },
      'should hide metric on create form when flag is disabled': {
        featureFlaggedAlerts: { health_score: false },
        isDuplicate: false,
        isNewAlert: true,
      },
      'should show metric on create form when flag is enabled': {
        featureFlaggedAlerts: { health_score: true },
        isDuplicate: false,
        isNewAlert: true,
      },
      'should hide metric on edit form when flag is disabled and editing unflagged metric': {
        featureFlaggedAlerts: { health_score: false },
        initialValues: { metric: 'something_else' },
        isNewAlert: false,
      },
      'should show metric on edit form when flag is disabled and editing flagged metric': {
        featureFlaggedAlerts: { health_score: false },
        initialValues: { metric: 'health_score' },
        isNewAlert: false,
      },
      'should show metric on edit form when flag is enabled and editing unflagged metric': {
        featureFlaggedAlerts: { health_score: true },
        initialValues: { metric: 'something_else' },
        isNewAlert: false,
      },
      'should show metric on edit form when flag is enabled and editing flagged metric': {
        featureFlaggedAlerts: { health_score: true },
        initialValues: { metric: 'health_score' },
        isNewAlert: false,
      },
    },
  );

  describe('submit button', () => {
    const defaultFormState = {
      pristine: false,
      submitting: false,
      isDuplicate: false,
    };

    it('should disable submit button when form is pristine', () => {
      wrapper.setProps(defaultFormState);
      expect(wrapper.find('Button')).toHaveProp('disabled', false);
      wrapper.setProps({ pristine: true });
      expect(wrapper.find('Button')).toHaveProp('disabled', true);
    });

    it('should disable submit button when form is submitting', () => {
      wrapper.setProps(defaultFormState);
      expect(wrapper.find('Button')).toHaveProp('disabled', false);
      wrapper.setProps({ submitting: true });
      expect(wrapper.find('Button')).toHaveProp('disabled', true);
    });

    it('should enable submit button when form is pristine but it is a duplicate', () => {
      wrapper.setProps(defaultFormState);
      expect(wrapper.find('Button')).toHaveProp('disabled', false);
      wrapper.setProps({ pristine: true, isDuplicate: true });
      expect(wrapper.find('Button')).toHaveProp('disabled', false);
    });

    it('should display Submitting when submitting ', () => {
      wrapper.setProps({ submitting: true });
      expect(wrapper.find('Button').props().children).toEqual('Submitting...');
    });

    it('should display Create Alert when it is new alert', () => {
      wrapper.setProps({ ...defaultFormState, isNewAlert: true });
      expect(wrapper.find('Button').props().children).toEqual('Create Alert');
    });

    it('should display Update Alert when it is editing alert', () => {
      wrapper.setProps({ ...defaultFormState, isNewAlert: false });
      expect(wrapper.find('Button').props().children).toEqual('Update Alert');
    });
  });
});
