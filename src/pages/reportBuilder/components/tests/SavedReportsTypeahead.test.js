import { shallow } from 'enzyme';
import React from 'react';
import SavedReportsTypeahead from '../SavedReportsTypeahead';

describe('Saved Reports Typeahead', () => {
  const defaultProps = {
    handleReportChange: jest.fn(),
    selectedReport: {
      key: 'report',
      name: 'Cool Report',
      query_string: 'range=day&metric=count_sent',
    },
  };

  const subject = ({ ...props }) => {
    return shallow(<SavedReportsTypeahead {...defaultProps} {...props} />);
  };

  it('updates reportOptions when a new report is selected', () => {
    const wrapper = subject();
    const onChange = wrapper.find('Typeahead').prop('onChange');
    onChange({ name: 'Preset Report', query_string: 'range=day&metric=count_accepted' });
    expect(defaultProps.handleReportChange).toHaveBeenCalled();
  });

  it('updates reportOptions when the report selection is cleared', () => {
    const wrapper = subject();
    const onChange = wrapper.find('Typeahead').prop('onChange');
    onChange(null);
    expect(defaultProps.handleReportChange).toHaveBeenCalled();
  });
});
