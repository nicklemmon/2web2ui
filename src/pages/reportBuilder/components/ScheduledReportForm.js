import React from 'react';
import { useHistory } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { tokens } from '@sparkpost/design-tokens-hibana';
import {
  Box,
  Button,
  Inline,
  LabelValue,
  Layout,
  Panel,
  Radio,
  Select,
  TextField,
} from 'src/components/matchbox';
import { Uppercase } from 'src/components/text';
import { ButtonWrapper, RadioButtonGroup } from 'src/components';
import { hasAtLeastOneRecipient } from '../helpers/scheduledReports';
import { DAY_OF_WEEK_OPTIONS, WEEK_OPTIONS } from '../constants/scheduledReports';
import { ComboBoxTypeaheadWrapper } from 'src/components/reactHookFormWrapper';
import { TimezoneTypeahead } from 'src/components/typeahead/TimezoneTypeahead';

export const ScheduledReportDetailsForm = ({
  formControls,
  isUpdatingScheduledReport,
  disabled,
  report,
  users,
}) => {
  const history = useHistory();

  const { control, errors, formState, register, setValue } = formControls;

  const Typeahead = (
    <ComboBoxTypeaheadWrapper
      disabled={disabled}
      error={errors.recipients && 'At least 1 recipient must be selected'}
      id="to-address"
      itemToString={item => (item ? `Name: ${item.name} ---- Email: ${item.email}` : '')}
      label="Send To"
      name="recipients"
      results={users}
      setValue={setValue}
    />
  );

  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle>Details</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <Panel.Section>
            <TextField
              ref={register({ required: 'Required' })}
              disabled={disabled}
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
                <LabelValue>
                  <LabelValue.Label>Report</LabelValue.Label>
                  <LabelValue.Value>{report.name}</LabelValue.Value>
                </LabelValue>
              </div>
              <div>
                <LabelValue>
                  <LabelValue.Label>From Address</LabelValue.Label>
                  <LabelValue.Value>reports@sparkpost.com</LabelValue.Value>
                </LabelValue>
              </div>
            </Inline>
          </Panel.Section>
          <Panel.Section>
            <TextField
              ref={register({ required: 'Required' })}
              disabled={disabled}
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
          {isUpdatingScheduledReport && (
            <Panel.Section>
              <ButtonWrapper>
                <Button type="submit" variant="primary" disabled={!formState.isDirty || disabled}>
                  Update Details
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => history.push('/signals/analytics')}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </ButtonWrapper>
            </Panel.Section>
          )}
        </Panel>
      </Layout.Section>
    </Layout>
  );
};

export const ScheduledReportTimingForm = ({
  formControls,
  isUpdatingScheduledReport,
  disabled,
}) => {
  const history = useHistory();

  const { errors, formState, register, setValue, watch } = formControls;

  const timingFormValue = watch('timing');
  const periodFormValue = watch('period');
  const timezoneFormValue = watch('timezone');

  return (
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
                disabled={disabled}
                ref={register}
                label="Daily"
                value="daily"
                name="timing"
              />
              <Radio
                id="weekly"
                disabled={disabled}
                ref={register}
                label="Weekly"
                value="weekly"
                name="timing"
              />
              <Radio
                id="monthly"
                disabled={disabled}
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
                disabled={timingFormValue === 'weekly' || timingFormValue === 'daily' || disabled}
              />
              <Select
                id="day"
                ref={register}
                label="Day"
                name="day"
                options={DAY_OF_WEEK_OPTIONS}
                disabled={timingFormValue === 'daily' || disabled}
              />
              <TextField
                disabled={disabled}
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
                      disabled={disabled}
                      name="period"
                      checked={periodFormValue === 'AM'}
                      onChange={() => setValue('period', 'AM', { shouldDirty: true })}
                      ref={register}
                      value="AM"
                    >
                      <Uppercase>AM</Uppercase>
                    </RadioButtonGroup.Button>
                    <RadioButtonGroup.Button
                      id="pm"
                      disabled={disabled}
                      name="period"
                      checked={periodFormValue === 'PM'}
                      onChange={() => setValue('period', 'PM', { shouldDirty: true })}
                      ref={register}
                      value="PM"
                    >
                      <Uppercase>PM</Uppercase>
                    </RadioButtonGroup.Button>
                  </RadioButtonGroup>
                }
              />
              <Box minWidth={tokens.sizing_1000}>
                <input type="hidden" ref={register} name="timezone" />
                <TimezoneTypeahead
                  disabled={disabled}
                  initialValue={timezoneFormValue}
                  onChange={({ value }) => setValue('timezone', value, { shouldDirty: true })}
                />
              </Box>
            </Inline>
          </Panel.Section>
          {isUpdatingScheduledReport && (
            <Panel.Section>
              <ButtonWrapper>
                <Button type="submit" variant="primary" disabled={!formState.isDirty || disabled}>
                  Update Timing
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => history.push('/signals/analytics')}
                  disabled={disabled}
                >
                  Cancel
                </Button>
              </ButtonWrapper>
            </Panel.Section>
          )}
        </Panel>
        {!isUpdatingScheduledReport && (
          <ButtonWrapper>
            <Button type="submit" variant="primary" disabled={!formState.isValid || disabled}>
              Schedule Report
            </Button>
            <Button
              variant="secondary"
              onClick={() => history.push('/signals/analytics')}
              disabled={disabled}
            >
              Cancel
            </Button>
          </ButtonWrapper>
        )}
      </Layout.Section>
    </Layout>
  );
};
