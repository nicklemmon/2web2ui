import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import usePageFilters from 'src/hooks/usePageFilters';
import { useHistory } from 'react-router-dom';
import { getReport, createScheduledReport } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';
import { Page } from 'src/components/matchbox';
import {
  ScheduledReportDetailsForm,
  ScheduledReportTimingForm,
} from './components/ScheduledReportForm';
import { Loading } from 'src/components/loading';
import { selectUsers } from 'src/selectors/users';
import { listUsers } from 'src/actions/users';
import { getLocalTimezone } from 'src/helpers/date';
import { useForm } from 'react-hook-form';
import { formatFormValues } from './helpers/scheduledReports';

const initFilters = { reportId: {} };
export default function ScheduledReportCreatePage() {
  const {
    filters: { reportId },
  } = usePageFilters(initFilters);
  const history = useHistory();
  const { report, loading } = useSelector(state => state.reports);
  const users = useSelector(state => selectUsers(state));
  const usersLoading = useSelector(state => state.users.loading);
  const isPendingCreate = useSelector(
    ({ reports }) => reports.saveScheduledReportStatus === 'loading',
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getReport(reportId));
  }, [dispatch, reportId]);

  const { ...formControls } = useForm({
    defaultValues: {
      timing: 'daily',
      recipients: [],
      period: 'AM',
      timezone: getLocalTimezone(),
    },
    mode: 'onBlur',
  });

  const onSubmit = values => {
    const formattedValues = formatFormValues(values);
    dispatch(createScheduledReport(reportId, formattedValues)).then(() => {
      dispatch(
        showAlert({
          type: 'success',
          message: `Successfully scheduled ${values.name} for report: ${report.name}`,
        }),
      );
      history.push('/signals/analytics');
    });
  };

  if (loading || usersLoading) {
    return <Loading />;
  }
  return (
    <Page title="Schedule Report">
      <form onSubmit={formControls.handleSubmit(onSubmit)} id="scheduledReportForm">
        <ScheduledReportDetailsForm
          formControls={formControls}
          disabled={isPendingCreate || formControls.formState.isSubmitting}
          report={report}
          users={users}
        />
        <ScheduledReportTimingForm formControls={formControls} disabled={isPendingCreate} />
      </form>
    </Page>
  );
}
