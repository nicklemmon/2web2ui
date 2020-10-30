import React from 'react';
import { connect } from 'react-redux';
import {
  Box,
  Button,
  Checkbox,
  Inline,
  Modal,
  Stack,
  Tag,
  TextField,
} from 'src/components/matchbox';
import { useForm, Controller } from 'react-hook-form';
import { CheckboxWrapper } from 'src/components/reactHookFormWrapper';
import { Loading } from 'src/components';
import { Heading } from 'src/components/text';
import useRouter from 'src/hooks/useRouter';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';
import { selectCondition } from 'src/selectors/accessConditionState';
import { createReport, updateReport, getReports } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';
import { getMetricsFromKeys } from 'src/helpers/metrics';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';
import { ActiveFilters, ActiveFiltersV2 } from '../ActiveFilters';

import { formatDateTime, relativeDateOptionsIndexed } from 'src/helpers/date';

const DateRange = ({ to, from, relativeRange }) => {
  if (relativeRange === 'custom') {
    return (
      <div>
        From {formatDateTime(from)} to {formatDateTime(to)}
      </div>
    );
  }

  return <div>{relativeDateOptionsIndexed[relativeRange]}</div>;
};

const ActiveMetrics = ({ metrics }) => {
  const processedMetrics = getMetricsFromKeys(metrics);
  return (
    <Box>
      <Inline>
        {processedMetrics.map(metric => {
          return (
            <Tag key={metric.name} data-id="metric-tag">
              {metric.label}
            </Tag>
          );
        })}
      </Inline>
    </Box>
  );
};

export function SaveReportModal(props) {
  const {
    report,
    open,
    onCancel,
    createReport,
    getReports,
    loading,
    showAlert,
    isOwner,
    updateReport,
    create,
    saveQuery,
    setReport,
    isComparatorsEnabled,
  } = props;
  const { handleSubmit, control, errors, setValue, reset } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_editable: false,
    },
  });
  const {
    location: { search = '' },
  } = useRouter();

  const { state: reportOptions } = useReportBuilderContext();

  React.useEffect(() => {
    if (!report) return;
    const { name = '', description = '', is_editable = false } = report;
    reset({ name, description, is_editable });
  }, [report, reset]);

  const onSubmit = data => {
    const query_string = search.charAt(0) === '?' ? search.substring(1) : search;

    if (saveQuery || create) {
      data.query_string = query_string;
    }

    const saveAction = create ? createReport : updateReport;
    return saveAction({ ...data, id: report?.id }).then(response => {
      showAlert({ type: 'success', message: `You have successfully saved ${data.name}` });
      onCancel();
      if (report) {
        setReport({ ...report, ...data });
        getReports();
      } else {
        getReports().then(reports => {
          setReport(reports.find(({ id }) => id === response?.id));
        });
      }
    });
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    //TODO look into use ref={register}, Matchbox can forward refs after 4.2.1
    return (
      <form onSubmit={handleSubmit(onSubmit)} id="newReportForm">
        <Stack>
          <Controller
            as={TextField}
            label="Name"
            name="name"
            id="saved-reports-name"
            control={control}
            rules={{ required: true }}
            error={errors.name && 'Required'}
          />
          {saveQuery && (
            <Stack>
              <Box>
                <Heading as="h6">Metrics</Heading>

                <ActiveMetrics metrics={reportOptions.metrics} />
              </Box>

              {Boolean(reportOptions.filters.length) && (
                <Box>
                  <Heading as="h6">Filters</Heading>

                  {isComparatorsEnabled ? (
                    <ActiveFiltersV2 filters={reportOptions.filters} />
                  ) : (
                    <ActiveFilters filters={reportOptions.filters} />
                  )}
                </Box>
              )}

              <Box>
                <Heading as="h6">Date Range</Heading>

                <DateRange
                  to={reportOptions.to}
                  from={reportOptions.from}
                  relativeRange={reportOptions.relativeRange}
                />
              </Box>
            </Stack>
          )}
          <Controller
            as={TextField}
            multiline
            rows="5"
            label="Description"
            name="description"
            id="saved-reports-description"
            control={control}
            placeholder="Enter short description for your report"
            rules={{ required: true }}
            error={errors.description && 'Required'}
          />
          {(isOwner || create) && (
            <Checkbox.Group label="Editable">
              <Controller
                as={CheckboxWrapper}
                label="Allow others to edit report"
                id="saved-reports-allow-others-to-edit"
                name="is_editable"
                setValue={setValue}
                control={control}
              />
            </Checkbox.Group>
          )}
        </Stack>
      </form>
    );
  };

  return (
    <Modal open={open} onClose={onCancel}>
      <Modal.Header showCloseButton>
        {create ? 'Save New Report' : saveQuery ? 'Save Report Changes' : 'Edit Report'}
      </Modal.Header>
      <Modal.Content>{renderContent()}</Modal.Content>
      {!loading && (
        <Modal.Footer>
          <Button type="submit" form="newReportForm" variant="primary">
            Save Report
          </Button>
          <Button onClick={onCancel} variant="secondary">
            Cancel
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
const mapStateToProps = state => ({
  loading: state.reports.saveStatus === 'loading',
  isComparatorsEnabled: selectCondition(isAccountUiOptionSet('allow_report_filters_v2'))(state),
});
const mapDispatchToProps = { createReport, getReports, updateReport, showAlert };

export default connect(mapStateToProps, mapDispatchToProps)(SaveReportModal);
