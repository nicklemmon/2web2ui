import { shallow } from 'enzyme';
import React from 'react';
import { SavedReportsTypeahead } from '../SavedReportsTypeahead';

describe('Saved Reports Typeahead', () => {
  const mockRefreshReportOptions = jest.fn();
  const mockAddFilters = jest.fn();
  const subject = ({ ...props }) => {
    const defaults = { refreshReportOptions: mockRefreshReportOptions, addFilters: mockAddFilters };

    return shallow(<SavedReportsTypeahead {...defaults} {...props} />);
  };

  it('updates reportOptions when a new report is selected', () => {
    const wrapper = subject();
    const onChange = wrapper.find('Typeahead').prop('onChange');
    onChange({ name: 'Preset Report', query_string: 'range=day&metric=count_accepted' });
    expect(mockAddFilters).toHaveBeenCalled();
    expect(mockRefreshReportOptions).toHaveBeenCalled();
  });

  it('does not update reportOptions when the report selection is cleared', () => {
    const wrapper = subject();
    const onChange = wrapper.find('Typeahead').prop('onChange');
    onChange(null);
    expect(mockAddFilters).not.toHaveBeenCalled();
    expect(mockRefreshReportOptions).not.toHaveBeenCalled();
  });
});
