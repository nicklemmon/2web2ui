import React, { useMemo } from 'react';
import { Check, ViewModule } from '@sparkpost/matchbox-icons';
import { Box, Button, Panel, Stack } from 'src/components/matchbox';
import { PLAN_TIERS } from 'src/constants';
import PlanPrice from 'src/components/billing/PlanPrice';
import FeatureComparisonModal from './FeatureComparisonModal';
import _ from 'lodash';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import OGStyles from './PlanSelect.module.scss';
import HibanaStyles from './PlanSelectHibana.module.scss';
import { useState } from 'react';
import PromoCodeNew from 'src/components/billing/PromoCodeNew';

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);
  function toggle() {
    setIsShowing(!isShowing);
  }
  return {
    isShowing,
    toggle,
  };
};

export function SelectedPlan({ bundle, onChange, promoCodeObj, handlePromoCode }) {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  const { messaging: plan, tier } = bundle;
  const { price } = plan;
  const { isShowing, toggle } = useModal(false);
  const { selectedPromo } = promoCodeObj;
  const planTier = PLAN_TIERS[tier];

  return (
    <Panel.LEGACY
      title="Your New Plan"
      actions={[
        {
          content: (
            <span>
              Compare Features <ViewModule />
            </span>
          ),
          onClick: toggle,
          color: 'orange',
        },
      ]}
    >
      <FeatureComparisonModal open={isShowing} handleClose={toggle} />
      <Panel.LEGACY.Section>
        <div className={styles.SelectedPlan}>
          <div className={styles.tierLabel}>{planTier}</div>
          <div className={styles.PlanRow}>
            <div>
              <PlanPrice showOverage showIp showCsm plan={plan} selectedPromo={selectedPromo} />
            </div>
            <div>
              <Button onClick={() => onChange()} size="small" flat color="orange">
                Change
              </Button>
            </div>
          </div>
        </div>
      </Panel.LEGACY.Section>
      {price > 0 && (
        <Panel.LEGACY.Section>
          <div className={styles.PlanRow}>
            <PromoCodeNew
              key={selectedPromo.promoCode || 'promocode'}
              promoCodeObj={promoCodeObj}
              handlePromoCode={handlePromoCode}
            />
          </div>
        </Panel.LEGACY.Section>
      )}
    </Panel.LEGACY>
  );
}

export default function PlanSelectSection({ bundles, currentPlan, onSelect }) {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);
  const publicBundlesByTier = useMemo(
    () =>
      _.groupBy(
        bundles.filter(x => x.status !== 'secret'),
        'tier',
      ),
    [bundles],
  );
  const { isShowing, toggle } = useModal(false);

  const planList = _.map(
    PLAN_TIERS,
    (label, key) =>
      publicBundlesByTier[key] && (
        <Panel.LEGACY.Section key={`tier_section_${key}`}>
          <Stack space="200">
            <div className={styles.tierLabel}>{label}</div>
            <div className={styles.tierPlans}>
              {/* eslint-disable-next-line */}
              {_.orderBy(publicBundlesByTier[key], [bundle => bundle.bundle.toLowerCase()]).map(
                (bundle, bundleIndex) => {
                  const { messaging, bundle: bundleCode } = bundle;
                  const isCurrentPlan = currentPlan.code === bundleCode;
                  const isGreen = bundleCode.includes('green');
                  const hasTopBorder = !isGreen && bundleIndex > 0;

                  return (
                    <Box
                      key={`plan_row_${bundleCode}`}
                      padding="400"
                      display="flex"
                      justifyContent="space-between"
                      borderTop={hasTopBorder ? '400' : null}
                    >
                      <Box>
                        {isCurrentPlan && (
                          <Box as={Check} color="blue.600" className={styles.CheckIcon} />
                        )}

                        <PlanPrice
                          showOverage
                          showIp
                          showCsm
                          isCurrentPlan={isCurrentPlan}
                          plan={messaging}
                        />
                      </Box>

                      <div>
                        <Button
                          className={styles.selectButton}
                          disabled={isCurrentPlan}
                          onClick={() => onSelect(bundleCode)}
                          data-id={`select-plan-${bundleCode}`}
                          size="small"
                          variant="monochrome-secondary"
                        >
                          Select
                        </Button>
                      </div>
                    </Box>
                  );
                },
              )}
            </div>
          </Stack>
        </Panel.LEGACY.Section>
      ),
  );

  return (
    <Panel.LEGACY
      title="Select a Plan"
      actions={[
        {
          content: (
            <span>
              Compare Features <ViewModule />
            </span>
          ),
          onClick: toggle,
          color: 'orange',
        },
      ]}
    >
      <FeatureComparisonModal open={isShowing} handleClose={toggle} />
      {planList}
    </Panel.LEGACY>
  );
}
