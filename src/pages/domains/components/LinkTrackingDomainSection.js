import React from 'react';
import { Button, Layout, Stack } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { ExternalLink, SubduedLink } from 'src/components/links';
import { useForm, Controller } from 'react-hook-form';
import { Select } from 'src/components/matchbox';
import useDomains from '../hooks/useDomains';
import { EXTERNAL_LINKS } from '../constants';

export default function LinkTrackingDomainSection({ domain, isSectionVisible }) {
  const { control, handleSubmit } = useForm();

  const { trackingDomainOptions, updateSendingDomain, showAlert } = useDomains();

  const onSubmit = ({ trackingDomain }) => {
    const { id, subaccount_id: subaccount } = domain;
    updateSendingDomain({ id, subaccount, tracking_domain: trackingDomain })
      .then(() =>
        showAlert({
          type: 'success',
          message: 'Tracking domain assignment updated.',
        }),
      )
      .catch(err =>
        showAlert({
          type: 'error',
          message: 'Could not update tracking domain assignment.',
          details: err.message,
        }),
      );
  };
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Link Tracking Domain</Layout.SectionTitle>
        <Stack>
          <SubduedText>Assign a tracking domain?</SubduedText>
          <SubduedLink as={ExternalLink} to={EXTERNAL_LINKS.TRACKING_DOMAIN_DOCUMENTATION}>
            Tracking Domain Documentation
          </SubduedLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Panel>
            <Panel.Section>
              <Controller
                name="trackingDomain"
                render={({ value, onChange }) => (
                  <Select
                    onChange={onChange}
                    value={value || domain.tracking_domain}
                    options={trackingDomainOptions || []}
                    label="Linked Tracking Domain"
                    helpText="Domains must be verified to be linked to a sending domain."
                  />
                )}
                control={control}
              />
            </Panel.Section>
            <Panel.Section>
              <Button variant="primary" type="submit">
                Update Tracking Domain
              </Button>
              {/* Functionality not available */}
            </Panel.Section>
          </Panel>
        </form>
      </Layout.Section>
    </Layout>
  );
}
