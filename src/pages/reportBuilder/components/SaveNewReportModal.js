import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, TextField, Checkbox, Stack } from 'src/components/matchbox';
import { useForm, Controller } from 'react-hook-form';
import { CheckboxWrapper } from 'src/components/reactHookFormWrapper';
import { Loading } from 'src/components';
import useRouter from 'src/hooks/useRouter';
import { createReport } from 'src/actions/reports';
import { showAlert } from 'src/actions/globalAlert';

export function SaveNewReportModal(props) {
  const { open, onCancel, createReport, loading, showAlert } = props;
  const { handleSubmit, control, errors, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      is_editable: false,
    },
  });
  const {
    location: { search = '' },
  } = useRouter();

  const onSubmit = data => {
    const query_string = search.charAt(0) === '?' ? search.substring(1) : search;
    return createReport({ ...data, query_string }).then(() => {
      showAlert({ type: 'success', message: `You have successfully saved ${data.name}` });
      onCancel();
    });
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }
    return (
      <form onSubmit={handleSubmit(onSubmit)} id="newReportForm">
        <Stack>
          <Controller
            as={TextField}
            label="Name"
            name="name"
            control={control}
            rules={{ required: true }}
            error={errors.name && 'Required'}
          />
          <Controller
            as={TextField}
            multiline
            rows="5"
            label="Description"
            name="description"
            control={control}
            placeholder="Enter short description for your report"
            rules={{ required: true }}
            error={errors.description && 'Required'}
          />
          <Checkbox.Group label="Editable">
            <Controller
              as={CheckboxWrapper}
              label="Allow others to edit report"
              name="is_editable"
              setValue={setValue}
              control={control}
            />
          </Checkbox.Group>
        </Stack>
      </form>
    );
  };

  return (
    <Modal open={open} onClose={onCancel}>
      <Modal.Header showCloseButton>Save New Report</Modal.Header>
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
  loading: state.reports.createPending,
});
export default connect(mapStateToProps, { createReport, showAlert })(SaveNewReportModal);
