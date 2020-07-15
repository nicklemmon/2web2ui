import React from 'react';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';
import { Typeahead, TypeaheadItem } from 'src/components/typeahead/Typeahead';

const SavedReportsTypeahead = props => {
  return (
    <Typeahead
      renderItem={item => <TypeaheadItem label={item.name} />}
      canChange
      label="Report"
      itemToString={report => (report ? report.name : '')}
      name="ReportTypeahead"
      placeholder="Select a Report"
      onChange={props.handleReportChange}
      selectedItem={props.selectedItem}
      results={PRESET_REPORT_CONFIGS}
    />
  );
};

export default SavedReportsTypeahead;
