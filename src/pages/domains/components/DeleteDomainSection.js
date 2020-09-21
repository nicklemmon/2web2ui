import React from 'react';
import { Button, Layout, Text } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';

export default function DeleteDomainSection(props) {
  const { deleteDomain, showAlert } = useDomains();
  const handleDeleteDomain = () => {
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
  };
  return (
    <>
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
    </>
  );
}
