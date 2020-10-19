import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import useRouter from 'src/hooks/useRouter';
import { getReport } from 'src/actions/reports';

const ScheduledReportCreatePage = props => {
  const {
    requestParams: { reportId },
  } = useRouter();
  const { getReport, report } = props;

  useEffect(() => {
    getReport(reportId);
  }, [getReport, reportId]);

  return <div>{report.name}</div>;
};

const mapStateToProps = state => ({
  report: state.reports.report,
  loading: state.reports.getReportPending,
});

export default connect(mapStateToProps, { getReport })(ScheduledReportCreatePage);
