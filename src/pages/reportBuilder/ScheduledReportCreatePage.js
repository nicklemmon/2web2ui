import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import useRouter from 'src/hooks/useRouter';
import { getReport } from 'src/actions/reports';
import { Page } from 'src/components/matchbox';
import ScheduledReportForm from './components/ScheduledReportForm';

const ScheduledReportCreatePage = props => {
  const {
    requestParams: { reportId },
  } = useRouter();

  const { getReport, report } = props;

  useEffect(() => {
    getReport(reportId);
  }, [getReport, reportId]);

  const handleSubmit = values => {
    /* eslint-disable-next-line no-console */
    console.log(values);
  };
  return (
    <Page title="Schedule Report">
      <ScheduledReportForm report={report} handleSubmit={handleSubmit} />
    </Page>
  );
};

const mapStateToProps = state => ({
  report: state.reports.report,
  loading: state.reports.getReportPending,
});

export default connect(mapStateToProps, { getReport })(ScheduledReportCreatePage);
