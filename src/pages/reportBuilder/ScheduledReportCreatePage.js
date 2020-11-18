import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePageFilters from 'src/hooks/usePageFilters';
import { useHistory } from 'react-router-dom';
import { getReport, createScheduledReport } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Page } from 'src/components/matchbox';
import ScheduledReportForm from './components/ScheduledReportForm';
import { Loading } from 'src/components/loading';
const initFilters = { reportId: {} };
export default function ScheduledReportCreatePage() {
  const {
    filters: { reportId },
  } = usePageFilters(initFilters);
  const history = useHistory();
  const { report, loading } = useSelector(state => state.reports);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getReport(reportId));
  }, [dispatch, reportId]);

  const handleSubmit = values => {
    dispatch(createScheduledReport(reportId, values)).then(() => {
      dispatch(
        showAlert({
          type: 'success',
          message: `Successfully scheduled ${values.name} for report: ${report.name}`,
        }),
      );
      history.push('/signals/analytics');
    });
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <Page title="Schedule Report">
      <ScheduledReportForm report={report} handleSubmit={handleSubmit} />
    </Page>
  );
}
