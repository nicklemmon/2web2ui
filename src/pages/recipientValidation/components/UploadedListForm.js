import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getUsage } from 'src/actions/account';
import { LoadingSVG } from 'src/components/loading/Loading';
import { Grid } from 'src/components/matchbox';
import { ButtonLink } from 'src/components/links';
import { selectMonthlyRecipientValidationUsage } from 'src/selectors/accountBillingInfo';
import { calculateNewCost } from 'src/helpers/recipientValidation';

import OGStyles from './UploadedListForm.module.scss';
import hibanaStyles from './UploadedListFormHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

import { formatFullNumber } from 'src/helpers/units';
import RVPriceModal from './RVPriceModal';

export function UploadedListForm({
  getUsage,
  currentUsage,
  job: { addressCount, filename },
  loading,
}) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  const [isModalOpen, setModalisOpen] = useState(false);
  useEffect(() => {
    getUsage();
  }, [getUsage]);

  return (
    <div className={styles.FormContainer}>
      <h2 className={styles.Header}>{filename}</h2>
      <p className={styles.DescriptionParagraph}>
        <span>Your list has been uploaded successfully and the cost to validate is below. </span>
        <span>Would you like to proceed?</span>
      </p>
      <Grid>
        <Grid.Column xs={12} md={4}>
          <div className={styles.SubHeader}>Your list has</div>
          <div className={styles.CountBox}>
            <span className={styles.Number} data-id="recipient-list-address-count">
              {formatFullNumber(addressCount)}
            </span>
            &nbsp; emails
          </div>
        </Grid.Column>
        <Grid.Column xs={12} mdOffset={1} md={7}>
          <div className={styles.SubHeader}>and will cost</div>
          {loading ? (
            <div className={styles.LoadingCostContainer}>
              <LoadingSVG size="Small" />
            </div>
          ) : (
            <>
              <div className={styles.Cost}>{calculateNewCost(currentUsage, addressCount)}</div>
              <ButtonLink onClick={() => setModalisOpen(true)}>How was this calculated?</ButtonLink>
            </>
          )}
        </Grid.Column>
      </Grid>

      <RVPriceModal isOpen={isModalOpen} handleOpen={setModalisOpen} />
    </div>
  );
}

const mapStateToProps = state => ({
  currentUsage: selectMonthlyRecipientValidationUsage(state),
  loading: state.account.usageLoading,
});

export default connect(mapStateToProps, { getUsage })(UploadedListForm);
