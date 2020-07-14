import React from 'react';
import { parseSearch } from 'src/helpers/reports';
import { PRESET_REPORT_CONFIGS } from '../constants/presetReport';
import { Typeahead, TypeaheadItem } from 'src/components/typeahead/Typeahead';
import { addFilters, refreshReportOptions } from 'src/actions/reportOptions';
import { connect } from 'react-redux';

export const SavedReportsTypeahead = props => {
  const changeReportHandler = report => {
    //Report ony refreshes when a new report is selected and not when it is cleared.
    if (report) {
      const { options, filters = [] } = parseSearch(report.query_string);
      props.addFilters(filters);
      props.refreshReportOptions(options);
    }
  };

  return (
    <Typeahead
      renderItem={item => <TypeaheadItem label={item.name} />}
      canChange
      label="Report"
      itemToString={report => (report ? report.name : '')}
      name="ReportTypeahead"
      placeholder="Select a Report"
      onChange={changeReportHandler}
      results={PRESET_REPORT_CONFIGS}
    />
  );
};
const mapDispatchToProps = {
  addFilters,
  refreshReportOptions,
};
export default connect(undefined, mapDispatchToProps)(SavedReportsTypeahead);
