import React, { useState } from 'react';
import { Button, Layout, Text } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';
import { DeleteModal } from 'src/components/modals';
import _ from 'lodash';

export default function DeleteDomainSection({ domain, isTracking, id, history }) {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { deleteDomain, deleteTrackingDomain, showAlert, trackingDomains } = useDomains();
  const handleDeleteDomain = () => {
    if (isTracking) {
      let trackingDomain = _.find(trackingDomains, ['domainName', id.toLowerCase()]);

      return deleteTrackingDomain({
        domain: id,
        subaccount: trackingDomain.subaccountId,
      }).then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${id} deleted.`,
        });
        history.push('/domains/list/tracking');
      });
    } else {
      const { id, subaccount_id: subaccount } = domain;

      return deleteDomain({ id, subaccount }).then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${id} deleted.`,
        });
        history.push('/domains/list/sending');
      });
    }
  };
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Delete Domain</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel accent="red">
          <Panel.Section>
            Deleting a domain is permanent and cannot be undone.{' '}
            <Text as="span" fontWeight="semibold">
              Deletion of the domain affects any transmission that uses this domain.{' '}
            </Text>
          </Panel.Section>

          <Panel.Section>
            <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
              Delete Domain
            </Button>

            <DeleteModal
              title="Are you sure you want to delete this domain?"
              open={isDeleteModalOpen}
              content={
                isTracking ? (
                  <p>Any future transmission that uses this tracking domain will be rejected.</p>
                ) : (
                  <p>Any future transmission that uses this domain will be rejected.</p>
                )
              }
              onConfirm={handleDeleteDomain}
              onCancel={() => setDeleteModalOpen(false)}
            />
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
