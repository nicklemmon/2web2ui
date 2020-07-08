import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import { RemoveCircle } from '@sparkpost/matchbox-icons';
import { Grid, Box, Button, Panel } from 'src/components/matchbox';
import { OGOnlyWrapper } from 'src/components/hibana';
import { Add } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { TemplateTypeaheadWrapper } from 'src/components/reduxFormWrappers';
import {
  required,
  integer,
  minNumber,
  maxNumber,
  abTestDistribution,
} from 'src/helpers/validation';

import OGStyles from './VariantsFields.module.scss';
import HibanaStyles from './VariantsFieldsHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

export const PercentField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.percent`}
    label="Percent of total"
    type="number"
    suffix="%"
    validate={[required, minNumber(1), maxNumber(100), abTestDistribution]}
    component={TextFieldWrapper}
    {...props}
  />
);

export const SampleSizeField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.sample_size`}
    label="Number of Recipients"
    type="number"
    validate={[required, integer, minNumber(1)]}
    component={TextFieldWrapper}
    {...props}
  />
);

/*
  If you're looking at this, refer to https://redux-form.com/7.4.2/examples/fieldarrays/
 */
export const RenderVariants = ({ fields, formValues, disabled, subaccountId }) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  return (
    <OGOnlyWrapper as={Panel}>
      {fields.map((variant, i) => {
        const CountField =
          formValues.audience_selection === 'sample_size' ? SampleSizeField : PercentField;
        return (
          <Panel.Section key={i}>
            <div className={styles.RemoveWrapper}>
              <Button
                flat
                color="orange"
                size="small"
                onClick={() => fields.remove(i)}
                disabled={fields.length === 1}
              >
                <span>Remove Variant</span>
                <RemoveCircle style={{ marginLeft: '2px' }} />
              </Button>
            </div>
            <h6 className={styles.SmallHeader}>Variant {i + 1}</h6>
            <Grid>
              <Grid.Column>
                <Field
                  name={`${variant}.template_object`}
                  component={TemplateTypeaheadWrapper}
                  label="Select a published template"
                  placeholder="Type to search"
                  validate={required}
                  disabled={disabled}
                  subaccountId={subaccountId}
                />
              </Grid.Column>
              <Grid.Column>
                <CountField namespace={variant} disabled={disabled} />
              </Grid.Column>
            </Grid>
          </Panel.Section>
        );
      })}
      <Panel.Section>
        <Button flat color="orange" onClick={() => fields.push()} disabled={fields.length >= 20}>
          <Add /> Add Another Variant
        </Button>
      </Panel.Section>
    </OGOnlyWrapper>
  );
};

const VariantsFields = ({ disabled, formValues, subaccountId }) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  const CountField =
    formValues.audience_selection === 'sample_size' ? SampleSizeField : PercentField;
  return (
    <Fragment>
      <Box as={Panel} mt="400">
        <OGOnlyWrapper as={Panel}>
          <Panel.Section>
            <h6 className={styles.SmallHeader}>Default Template</h6>
            <Grid>
              <Grid.Column>
                <Field
                  name="default_template.template_object"
                  component={TemplateTypeaheadWrapper}
                  label="Select a published template"
                  placeholder="Type to search"
                  validate={required}
                  disabled={disabled}
                  subaccountId={subaccountId}
                />
              </Grid.Column>
              <Grid.Column>
                <CountField namespace="default_template" disabled={disabled} />
              </Grid.Column>
            </Grid>
          </Panel.Section>
        </OGOnlyWrapper>

        <FieldArray
          name="variants"
          component={RenderVariants}
          formValues={formValues}
          disabled={disabled}
          subaccountId={subaccountId}
        />
      </Box>
    </Fragment>
  );
};

VariantsFields.defaultProps = {
  formValues: {},
};

export default VariantsFields;
