import React from 'react';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';
// import { Typeahead, TypeaheadItem } from 'src/components/typeahead/Typeahead';
import { Select } from 'src/components/matchbox';

const options = PRESET_REPORT_CONFIGS.map(report => {
  return { label: report.name, value: report.key };
});

const SavedReportsTypeahead = props => {
  return (
    <>
      <Select
        placeholder="Select a Report"
        data-id="report-select"
        label="Report"
        options={options}
        defaultValue={props.selectedItem}
        onChange={e => props.handleReportChange(e.target.value)}
      />
    </>
  );

  // TODO: refactor typeahead to be able to have new behavior
  // return (
  //   <Typeahead
  //     renderItem={item => <TypeaheadItem label={item.name} />}
  //     canChange
  //     label="Report"
  //     itemToString={report => (report ? report.name : '')}
  //     name="ReportTypeahead"
  //     placeholder="Select a Report"
  //     onChange={props.handleReportChange}
  //     selectedItem={props.selectedItem}
  //     results={PRESET_REPORT_CONFIGS}
  //   />
  // );
};

export default SavedReportsTypeahead;
