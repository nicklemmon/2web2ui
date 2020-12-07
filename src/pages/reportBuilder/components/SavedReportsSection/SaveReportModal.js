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
import { useForm } from 'react-hook-form';
import { Heading } from 'src/components/text';
import { useLocation } from 'react-router-dom';
import { createReport, updateReport, getReports } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';
import { getMetricsFromKeys } from 'src/helpers/metrics';
import { useReportBuilderContext } from '../../context/ReportBuilderContext';
import { ActiveFilters } from 'src/components/reportBuilder';
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
  } = props;
  const { handleSubmit, errors, setValue, reset, register } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_editable: false,
    },
  });
  const { search = '' } = useLocation();
  const { state: reportOptions } = useReportBuilderContext();
  const hasFilters = Boolean(reportOptions.filters.length);

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
        getReports().then(reports => {
          setReport(reports.find(({ id }) => id === report?.id));
        });
      } else {
        getReports().then(reports => {
          setReport(reports.find(({ id }) => id === response?.id));
        });
      }
    });
  };

  const renderContent = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} id="newReportForm">
        <Stack>
          <TextField
            label="Name"
            name="name"
            id="saved-reports-name"
            ref={register({ required: true })}
            error={errors.name && 'Required'}
          />
          {saveQuery && (
            <Stack>
              <Box>
                <Heading as="h6">Metrics</Heading>

                <ActiveMetrics metrics={reportOptions.metrics} />
              </Box>

              {hasFilters ? (
                <Box>
                  <Heading as="h6">Filters</Heading>

                  <ActiveFilters filters={reportOptions.filters} />
                </Box>
              ) : null}

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
          <TextField
            multiline
            ref={register}
            rows="5"
            label="Description"
            name="description"
            id="saved-reports-description"
            placeholder="Enter short description for your report"
          />
          {(isOwner || create) && (
            <Checkbox.Group label="Editable">
              <Checkbox
                ref={register}
                label="Allow others to edit report"
                id="saved-reports-allow-others-to-edit"
                name="is_editable"
                setValue={setValue}
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

      <Modal.Footer>
        <Button
          type="submit"
          loading={loading}
          disabled={loading}
          form="newReportForm"
          variant="primary"
        >
          Save Report
        </Button>
        <Button onClick={onCancel} disabled={loading} variant="secondary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
const mapStateToProps = state => ({
  loading: state.reports.saveStatus === 'loading',
});
const mapDispatchToProps = { createReport, getReports, updateReport, showAlert };

export default connect(mapStateToProps, mapDispatchToProps)(SaveReportModal);
