import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Inline,
  Layout,
  Panel,
  Radio,
  Select,
  Text,
  TextField,
} from 'src/components/matchbox';
import { Heading, Uppercase } from 'src/components/text';
import { getLocalTimezone } from 'src/helpers/date';
import { RadioButtonGroup } from 'src/components';
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

export const ScheduledReportForm = ({
  report,
  handleSubmit: parentHandleSubmit,
  listUsers,
  loading,
  users,
}) => {
  const { control, handleSubmit, errors, register, setValue, watch } = useForm();
  const [period, setPeriod] = useState('AM');
  const [timezone, setTimezone] = useState(getLocalTimezone());

  useEffect(() => {
    listUsers();
  }, [listUsers]);

  const Typeahead = (
    <ComboBoxTypeaheadWrapper
      disabled={loading}
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
    const { name, description = 'NA', subject, ...rest } = formValues;
    const recipients = rest.recipients.map(({ username }) => username);
    const [hour, minute] = rest.time.split(':');
    const day_of_week = rest.day || '*';
    const schedule = {
      day_of_week,
      month: '*',
      day_of_month: '*',
      hour: period === 'AM' ? parseInt(hour) % 12 : (parseInt(hour) % 12) + 12,
      minute,
      second: 0,
    };
    parentHandleSubmit({
      name,
      description,
      subject,
      recipients,
      schedule,
    });
  };

  const currentTiming = watch('timing');

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
                  <Heading as="h3" looksLike="h5">
                    Report
                  </Heading>
                  <Text as="p">{report.name}</Text>
                </div>
                <div>
                  <Heading as="h3" looksLike="h5">
                    From Address
                  </Heading>
                  <Text as="p">reports@sparkpost.com</Text>
                </div>
              </Inline>
            </Panel.Section>
            <Panel.Section>
              <TextField
                ref={register({ required: 'Required' })}
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
                defaultValue={[]}
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
                <Radio ref={register} label="Daily" value="daily" name="timing" />
                <Radio ref={register} label="Weekly" value="weekly" name="timing" />
                <Radio ref={register} label="Monthly" value="monthly" name="timing" />
              </Radio.Group>
            </Panel.Section>
            <Panel.Section>
              <Inline>
                <Select
                  ref={register}
                  label="Week"
                  name="week"
                  options={[`First`, 'Second', 'Third', 'Fourth']}
                  disabled={currentTiming === 'weekly' || currentTiming === 'daily'}
                />
                <Select
                  ref={register}
                  label="Day"
                  name="day"
                  options={DAY_OF_WEEK_OPTIONS}
                  disabled={currentTiming === 'daily'}
                />
                <TextField
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
                        checked={period === 'AM'}
                        onChange={() => {
                          setPeriod('AM');
                        }}
                      >
                        <Uppercase>AM</Uppercase>
                      </RadioButtonGroup.Button>
                      <RadioButtonGroup.Button
                        id="pm"
                        checked={period === 'PM'}
                        onChange={() => {
                          setPeriod('PM');
                        }}
                      >
                        <Uppercase>PM</Uppercase>
                      </RadioButtonGroup.Button>
                    </RadioButtonGroup>
                  }
                />
                <Box minWidth="19rem">
                  <TimezoneTypeahead initialValue={timezone} onChange={setTimezone} />
                </Box>
              </Inline>
            </Panel.Section>
          </Panel>
          <Inline>
            <Button type="submit" variant="primary">
              Schedule Report
            </Button>
            <Button variant="secondary">Cancel</Button>
          </Inline>
        </Layout.Section>
      </Layout>
    </form>
  );
};
const mapStateToProps = state => ({
  users: selectUsers(state),
  loading: state.users.loading,
});

export default connect(mapStateToProps, { listUsers })(ScheduledReportForm);
