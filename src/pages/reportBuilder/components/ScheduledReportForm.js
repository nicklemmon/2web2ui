import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  { label: 'Sunday', value: 'sun' },
  { label: 'Monday', value: 'mon' },
  { label: 'Tuesday', value: 'tue' },
  { label: 'Wednesday', value: 'wed' },
  { label: 'Thursday', value: 'thu' },
  { label: 'Friday', value: 'fri' },
  { label: 'Saturday', value: 'sun' },
];

const WEEK_OPTIONS = [
  { label: 'First', value: '#1' },
  { label: 'Second', value: '#2' },
  { label: 'Third', value: '#3' },
  { label: 'Fourth', value: '#4' },
  { label: 'Fifth', value: '#5' },
  { label: 'Last', value: 'l' },
];

const hasAtLeastOneRecipient = recipientList => recipientList.length > 0;

export const formatFormValues = formValues => {
  const { name, subject, period, timing, timezone, ...rest } = formValues;
  const recipients = rest.recipients.map(({ username }) => username);
  const [hour, minute] = rest.time.split(':');

  /*
  Monthly timing will be formatted like fri#2 for second friday of the month. Or monl for the last monday of the month.
  For weekly timing, use the given day, EX: 'fri'
  For daily reports, the day selector field is disabled meaning resulting in day = undefined. So in this case, we set it to '*'
  */
  const day_of_week = timing === 'monthly' ? `${rest.day}${rest.week}` : rest.day || '*';

  const schedule = {
    day_of_week,
    month: '*',
    day_of_month: '?',
    hour: period === 'AM' ? parseInt(hour) % 12 : (parseInt(hour) % 12) + 12,
    minute: parseInt(minute),
    second: 0,
  };

  return {
    name,
    subject,
    recipients,
    schedule,
    schedule_type: timing,
    timezone,
  };
};

export const ScheduledReportForm = ({ report, handleSubmit: parentHandleSubmit }) => {
  const { control, handleSubmit, errors, register, setValue, watch } = useForm({
    defaultValues: {
      timing: 'daily',
      recipients: [],
      period: 'AM',
    },
  });
  const [timezone, setTimezone] = useState(getLocalTimezone());
  const history = useHistory();
  const users = useSelector(state => selectUsers(state));
  const usersLoading = useSelector(state => state.users.loading);
  const loading = useSelector(state => state.reports.saveScheduledReportStatus === 'loading');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch]);

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
                  options={WEEK_OPTIONS}
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

export default ScheduledReportForm;
