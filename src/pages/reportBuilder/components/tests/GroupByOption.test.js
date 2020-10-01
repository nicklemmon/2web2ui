import React from 'react';
import { GroupByOption } from '../GroupByOption';
import { shallow } from 'enzyme';

jest.mock('../../context/ReportBuilderContext', () => ({
  useReportBuilderContext: jest.fn(() => ({ state: { foo: 'bar' } })),
}));

describe('Group By Option', () => {
  let wrapper;

  const props = {
    _getTableData: jest.fn(),
    groupBy: 'watched-domain',
    tableLoading: false,
    hasSubaccounts: false,
  };

  beforeEach(() => {
    wrapper = shallow(<GroupByOption {...props} />);
  });

  it('should render correctly with both selector and checkbox', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with selector only and not the checkbox', () => {
    wrapper.setProps({ groupBy: 'campaign' });
    expect(wrapper.find('Checkbox')).not.toExist();
    expect(wrapper.find('Select')).toExist();
  });

  it('should render subaccount option', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find('Select').prop('options')).toContainEqual({
      label: 'Subaccount',
      value: 'subaccount',
    });
  });

  it('should handle select change', () => {
    wrapper.find('Select').simulate('change', { target: { value: 'campaign' } });
    expect(props._getTableData).toHaveBeenCalledWith({
      groupBy: 'campaign',
      reportOptions: { foo: 'bar' },
    });
  });
  it('should handle select change when its just a placeholder value', () => {
    wrapper.find('Select').simulate('change', { target: { value: 'placeholder' } });
    expect(props._getTableData).not.toHaveBeenCalled();
  });

  it('should correctly show watched domain in the select options when "Only Top Domains" is checked', () => {
    expect(wrapper.find('Checkbox')).toBeChecked();
    expect(wrapper.find('Select').prop('options')).toContainEqual({
      label: 'Recipient Domain',
      value: 'watched-domain',
    });
  });

  it('should correctly show domain in the select options when "Only Top Domains" is not checked', () => {
    expect(wrapper.find('Checkbox')).toBeChecked();
    wrapper.find('Checkbox').simulate('change');
    expect(wrapper.find('Checkbox')).not.toBeChecked();
    expect(wrapper.find('Select').prop('options')).toContainEqual({
      label: 'Recipient Domain',
      value: 'domain',
    });
  });

  it('should make new domain api call when unchecking the "Only Top Domains" checkbox', () => {
    expect(wrapper.find('Checkbox')).toBeChecked();
    wrapper.find('Checkbox').simulate('change');
    expect(props._getTableData).toHaveBeenCalledWith({
      groupBy: 'domain',
      reportOptions: { foo: 'bar' },
    });
    expect(wrapper.find('Checkbox')).not.toBeChecked();
  });

  it('should make new watched-domain api call when checking the "Only Top Domains" checkbox', () => {
    expect(wrapper.find('Checkbox')).toBeChecked();
    wrapper.find('Checkbox').simulate('change');
    expect(wrapper.find('Checkbox')).not.toBeChecked();
    wrapper.find('Checkbox').simulate('change');
    expect(props._getTableData).toHaveBeenCalledTimes(2);
    expect(props._getTableData).toHaveBeenCalledWith({
      groupBy: 'watched-domain',
      reportOptions: { foo: 'bar' },
    });
    expect(wrapper.find('Checkbox')).toBeChecked();
  });
});
