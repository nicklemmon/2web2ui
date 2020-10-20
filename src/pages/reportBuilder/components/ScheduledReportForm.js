import React, { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button, Inline, Panel, Text, TextField } from 'src/components/matchbox';
import { Heading } from 'src/components/text';
import { ComboBoxTypeaheadWrapper } from 'src/components/reactHookFormWrapper';

const ScheduledReportForm = ({ report, handleSubmit: onSubmit }) => {
  const { control, handleSubmit, errors, register, setValue } = useForm();
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
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="newScheduledReportForm">
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
      <Button type="submit" variant="primary">
        SUBMIT
      </Button>
    </form>
  );
};

export default ScheduledReportForm;
