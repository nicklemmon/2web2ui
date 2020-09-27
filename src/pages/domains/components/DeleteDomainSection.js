import React from 'react';
import { Button, Layout, Text } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';
import _ from 'lodash';

export default function DeleteDomainSection(props) {
  const { deleteDomain, deleteTrackingDomain, showAlert, trackingDomains } = useDomains();
  const handleDeleteDomain = () => {
    if (props.isTracking) {
      let trackingDomain = _.find(trackingDomains, ['domainName', props.id]);

      return deleteTrackingDomain({
        domain: props.id,
        subaccount: trackingDomain.subaccountId,
      }).then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${props.id} deleted.`,
        });
        props.history.push('/domains/list/tracking');
      });
    } else {
      const {
        domain: { id, subaccount_id: subaccount },
      } = props;

      return deleteDomain({ id, subaccount }).then(() => {
        showAlert({
          type: 'success',
          message: `Domain ${id} deleted.`,
        });
        props.history.push('/domains/list/sending');
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
            <Button variant="destructive" onClick={handleDeleteDomain}>
              Delete Domain
            </Button>
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
