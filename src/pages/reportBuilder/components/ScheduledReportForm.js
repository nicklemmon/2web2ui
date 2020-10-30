import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Inline,
  Layout,
  Panel,
  Radio,
  Select,
  TextField,
} from 'src/components/matchbox';
import { Definition, Uppercase } from 'src/components/text';
import { getLocalTimezone } from 'src/helpers/date';
import { ButtonWrapper, RadioButtonGroup } from 'src/components';
import { ComboBoxTypeaheadWrapper } from 'src/components/reactHookFormWrapper';
import { TimezoneTypeahead } from 'src/components/typeahead/TimezoneTypeahead';
import { listUsers } from 'src/actions/users';
import { selectUsers } from 'src/selectors/users';

const DAY_OF_WEEK_OPTIONS = [
  { label: `Sunday`, value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

const hasAtLeastOneRecipient = recipientList => recipientList.length > 0;

export const formatFormValues = formValues => {
  const { name, description = 'NA', subject, period, ...rest } = formValues;
  const recipients = rest.recipients.map(({ username }) => username);
  const [hour, minute] = rest.time.split(':');
  const day_of_week = rest.day || '*';
  const schedule = {
    day_of_week,
    month: '*',
    day_of_month: '*',
    hour: period === 'AM' ? parseInt(hour) % 12 : (parseInt(hour) % 12) + 12,
    minute: parseInt(minute),
    second: 0,
  };
  return {
    name,
    description,
    subject,
    recipients,
    schedule,
  };
};

export const ScheduledReportForm = ({
  report,
  handleSubmit: parentHandleSubmit,
  listUsers,
  loading,
  users,
  usersLoading,
}) => {
  const { control, handleSubmit, errors, register, setValue, watch } = useForm({
    defaultValues: {
      timing: 'daily',
      recipients: [],
      period: 'AM',
    },
  });
  const [timezone, setTimezone] = useState(getLocalTimezone());
  const history = useHistory();

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  const Typeahead = (
    <ComboBoxTypeaheadWrapper
      disabled={loading || usersLoading}
      error={errors.recipients && 'At least 1 recipient must be selected'}
      id="to-address"
      itemToString={item => (item ? `Name: ${item.name} ---- Email: ${item.email}` : '')}
      label="Send To"
      name="recipients"
      results={users}
      setValue={setValue}
    />
  );

  const onSubmit = formValues => {
    parentHandleSubmit(formatFormValues({ ...formValues, timezone }));
  };

  const timingFormValue = watch('timing');
  const periodFormValue = watch('period');

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="newScheduledReportForm">
      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle>Details</Layout.SectionTitle>
        </Layout.Section>
        <Layout.Section>
          <Panel>
            <Panel.Section>
              <TextField
                ref={register({ required: 'Required' })}
                disabled={loading}
                label="Scheduled Report Name"
                name="name"
                helpText="Title for the scheduling of this report"
                id="scheduled-report-name"
                error={errors.name?.message}
              />
            </Panel.Section>
            <Panel.Section>
              <Inline space="800">
                <div>
                  <Definition>
                    <Definition.Label>Report</Definition.Label>
                    <Definition.Value>{report.name}</Definition.Value>
                  </Definition>
                </div>
                <div>
                  <Definition>
                    <Definition.Label> From Address</Definition.Label>
                    <Definition.Value>reports@sparkpost.com</Definition.Value>
                  </Definition>
                </div>
              </Inline>
            </Panel.Section>
            <Panel.Section>
              <TextField
                ref={register({ required: 'Required' })}
                disabled={loading}
                label="Email Subject"
                name="subject"
                helpText="Text which will appear as subject line in report email"
                id="email-subject"
                error={errors.subject?.message}
              />
            </Panel.Section>
            <Panel.Section>
              <Controller
                control={control}
                as={Typeahead}
                name="recipients"
                rules={{ validate: hasAtLeastOneRecipient }}
              />
            </Panel.Section>
          </Panel>
        </Layout.Section>
      </Layout>

      <Layout>
        <Layout.Section annotated>
          <Layout.SectionTitle>Send Timing</Layout.SectionTitle>
        </Layout.Section>
        <Layout.Section>
          <Panel>
            <Panel.Section>
              <Radio.Group label="Send Report">
                <Radio
                  id="daily"
                  disabled={loading}
                  ref={register}
                  label="Daily"
                  value="daily"
                  name="timing"
                />
                <Radio
                  id="weekly"
                  disabled={loading}
                  ref={register}
                  label="Weekly"
                  value="weekly"
                  name="timing"
                />
                <Radio
                  id="monthly"
                  disabled={loading}
                  ref={register}
                  label="Monthly"
                  value="monthly"
                  name="timing"
                />
              </Radio.Group>
            </Panel.Section>
            <Panel.Section>
              <Inline>
                <Select
                  id="week"
                  ref={register}
                  label="Week"
                  name="week"
                  options={[`First`, 'Second', 'Third', 'Fourth']}
                  disabled={timingFormValue === 'weekly' || timingFormValue === 'daily' || loading}
                />
                <Select
                  id="day"
                  ref={register}
                  label="Day"
                  name="day"
                  options={DAY_OF_WEEK_OPTIONS}
                  disabled={timingFormValue === 'daily' || loading}
                />
                <TextField
                  disabled={loading}
                  ref={register({
                    required: 'Required',
                    pattern: {
                      value: /^(1[0-2]|0?[1-9]):[0-5][0-9]$/,
                      message: 'Invalid time format, should be hh:mm 12 hour format',
                    },
                  })}
                  label="Time"
                  name="time"
                  id="time"
                  error={errors.time?.message}
                  maxWidth="12rem"
                  placeholder="hh:mm"
                  connectRight={
                    <RadioButtonGroup id="period" label="Grouping Type">
                      <RadioButtonGroup.Button
                        id="am"
                        disabled={loading}
                        name="period"
                        checked={periodFormValue === 'AM'}
                        onChange={() => setValue('period', 'AM')}
                        ref={register}
                        value="AM"
                      >
                        <Uppercase>AM</Uppercase>
                      </RadioButtonGroup.Button>
                      <RadioButtonGroup.Button
                        id="pm"
                        disabled={loading}
                        name="period"
                        checked={periodFormValue === 'PM'}
                        onChange={() => setValue('period', 'PM')}
                        ref={register}
                        value="PM"
                      >
                        <Uppercase>PM</Uppercase>
                      </RadioButtonGroup.Button>
                    </RadioButtonGroup>
                  }
                />
                <Box minWidth="19rem">
                  <TimezoneTypeahead
                    disabled={loading}
                    initialValue={timezone}
                    onChange={setTimezone}
                  />
                </Box>
              </Inline>
            </Panel.Section>
          </Panel>
          <ButtonWrapper>
            <Button type="submit" variant="primary" disabled={loading}>
              Schedule Report
            </Button>
            <Button
              variant="secondary"
              onClick={() => history.push('/signals/analytics')}
              disabled={loading}
            >
              Cancel
            </Button>
          </ButtonWrapper>
        </Layout.Section>
      </Layout>
    </form>
  );
};
const mapStateToProps = state => ({
  users: selectUsers(state),
  usersLoading: state.users.loading,
  loading: state.reports.saveScheduledReportStatus === 'loading',
});

export default connect(mapStateToProps, { listUsers })(ScheduledReportForm);
