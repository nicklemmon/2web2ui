import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import useRouter from 'src/hooks/useRouter';
import { getReport, createScheduledReport } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Page } from 'src/components/matchbox';
import ScheduledReportForm from './components/ScheduledReportForm';

const ScheduledReportCreatePage = props => {
  const {
    requestParams: { reportId },
  } = useRouter();

  const { createScheduledReport, getReport, report, showAlert } = props;

  useEffect(() => {
    getReport(reportId);
  }, [getReport, reportId]);

  const handleSubmit = values => {
    createScheduledReport(reportId, values).then(() =>
      showAlert({
        type: 'success',
        message: `Scheduled ${values.name} for report: ${report.name}`,
      }),
    );
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
const mapDispatchToProps = { createScheduledReport, getReport, showAlert };

export default connect(mapStateToProps, mapDispatchToProps)(ScheduledReportCreatePage);
