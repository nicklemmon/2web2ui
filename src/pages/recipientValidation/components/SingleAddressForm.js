import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Field } from 'redux-form';
import classNames from 'classnames';
import { Label, ScreenReaderOnly } from 'src/components/matchbox';
import { TextFieldWrapper } from 'src/components';
import { Heading } from 'src/components/text';
import { required, email, maxLength } from 'src/helpers/validation';
import { singleAddress } from 'src/actions/recipientValidation';

import OGStyles from './SingleAddressForm.module.scss';
import hibanaStyles from './SingleAddressFormHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

export class SingleAddressFormClass extends Component {
  singleAddressForm = values =>
    this.props.history.push(`/recipient-validation/single/${values.address}`);

  render() {
    const { styles } = this.props;

    return (
      <>
        <Heading as="h3" looksLike="h5" className={styles.Header}>
          Validate a Single Address
        </Heading>

        <p className={classNames(styles.Subheader)}>
          Enter the email address below you would like to validate.
        </p>

        <div className={classNames(styles.Field)}>
          <ScreenReaderOnly>
            <Label id="email-address-field" label="Email Address" />
          </ScreenReaderOnly>

          <Field
            id="email-address-field"
            name="address"
            component={TextFieldWrapper}
            placeholder="harry.potter@hogwarts.edu"
            validate={[required, email, maxLength(254)]}
            normalize={(value = '') => value.trim()}
          />
        </div>
      </>
    );
  }
}

function SingleAddressForm(props) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  return <SingleAddressFormClass styles={styles} {...props}></SingleAddressFormClass>;
}

export const SingleAddressTab = withRouter(connect(null, { singleAddress })(SingleAddressForm));
