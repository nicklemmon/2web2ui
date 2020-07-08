import React from 'react';
import { RecipientValidationPriceTable } from 'src/components';
import { Panel, Modal } from 'src/components/matchbox';
import OGStyles from './RVPriceModal.module.scss';
import hibanaStyles from './RVPriceModalHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';

export default function RVPriceModal({ isOpen, handleOpen }) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  return (
    <Modal open={isOpen} onClose={() => handleOpen(false)} showCloseButton>
      <Panel title="How was this calculated?">
        <Panel.Section>
          <RecipientValidationPriceTable
            cellProps={{
              className: styles.rvModalCell,
            }}
          />
        </Panel.Section>
      </Panel>
    </Modal>
  );
}
