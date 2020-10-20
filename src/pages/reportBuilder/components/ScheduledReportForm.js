import React, { useCallback, useState } from 'react';
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

const ScheduledReportForm = ({ report, handleSubmit: onSubmit }) => {
  const { control, handleSubmit, errors, register, setValue, watch } = useForm();
  const [period, setPeriod] = useState('AM');
  const [timezone, setTimezone] = useState(getLocalTimezone());

  const Typeahead = useCallback(
    () => (
      <ComboBoxTypeaheadWrapper
        results={['hello', 'yes']}
        value={[]}
        setValue={setValue}
        label="Send To"
        id="to-address"
        name="toAddresses2"
      />
    ),
    [setValue],
  );

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
              <Controller control={control} as={Typeahead} name="toAddresses2" />
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
                  options={[
                    `Sunday`,
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                  ]}
                  disabled={currentTiming === 'daily'}
                />
                <TextField
                  ref={register({ required: 'Required' })}
                  label="Time"
                  name="time"
                  id="time"
                  error={errors.time?.message}
                  maxWidth="12rem"
                  connectRight={
                    <RadioButtonGroup label="Grouping Type">
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
        </Layout.Section>
      </Layout>
      <Button type="submit" variant="primary">
        SUBMIT
      </Button>
    </form>
  );
};

export default ScheduledReportForm;
