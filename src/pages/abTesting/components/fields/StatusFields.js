import React from 'react';
import { Field } from 'redux-form';
import { Panel } from 'src/components/matchbox';
import { OGOnlyWrapper } from 'src/components/hibana';
import { AccessTime } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper, DatePickerWrapper } from 'src/components/reduxFormWrappers';
import {
  required,
  maxLength,
  minLength,
  abTestDuration,
  startTimeBeforeEndTime,
} from 'src/helpers/validation';

const StatusFields = ({ disabled }) => (
  <>
    <OGOnlyWrapper as={Panel.LEGACY}>
      <Panel.LEGACY.Section>
        <Field
          name="name"
          component={TextFieldWrapper}
          label="Test Name"
          disabled={disabled}
          validate={[required, minLength(1), maxLength(64)]}
        />
      </Panel.LEGACY.Section>
    </OGOnlyWrapper>
    <OGOnlyWrapper as={Panel.LEGACY}>
      <Panel.LEGACY.Section>
        <Field
          component={DatePickerWrapper}
          disabled={disabled}
          name="dates"
          left
          showPresets={false}
          roundToPrecision={false}
          preventFuture={false}
          fromSelectsNextHour={true}
          validate={[abTestDuration, startTimeBeforeEndTime]}
          textFieldProps={{
            helpText: 'A test may run for a maximum of 30 days',
            label: 'When should we run this test?',
            prefix: <AccessTime />,
          }}
          datePickerProps={{
            disabledDays: { before: new Date() },
            initialMonth: new Date(),
            toMonth: null,
            fromMonth: new Date(),
          }}
        />
      </Panel.LEGACY.Section>
    </OGOnlyWrapper>
  </>
);

export default StatusFields;
