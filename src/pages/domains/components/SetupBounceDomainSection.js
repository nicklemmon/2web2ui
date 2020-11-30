import React from 'react';
import { Button, Layout, Stack, Select, Text } from 'src/components/matchbox';
import { Checkbox, Panel } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { Send } from '@sparkpost/matchbox-icons';
import { resolveReadyFor } from 'src/helpers/domains';
import { ExternalLink, PageLink, SubduedLink } from 'src/components/links';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import LineBreak from 'src/components/lineBreak';
import getConfig from 'src/helpers/getConfig';
import { CopyField } from 'src/components';
import useDomains from '../hooks/useDomains';
import { EXTERNAL_LINKS } from '../constants';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

export default function SetupBounceDomainSection({ domain, isSectionVisible, title }) {
  const { id, status, subaccount_id } = domain;
  const { verify, showAlert, userName, isByoipAccount, verifyBounceLoading } = useDomains();
  const readyFor = resolveReadyFor(status);
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { control, handleSubmit, watch, register } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);

  const onSubmit = () => {
    const type = watchVerificationType.toLowerCase();

    return verify({ id, subaccount: subaccount_id, type }).then(result => {
      if (result[`${type}_status`] === 'valid') {
        showAlert({
          type: 'success',
          message: `You have successfully verified ${type} record of ${id}`,
        });
      } else {
        showAlert({
          type: 'error',
          message: `Unable to verify ${type} record of ${id}`,
          details: result.dns[`${type}_error`],
        });
      }
    });
  };
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">{title || 'Bounce'}</Layout.SectionTitle>
        <Stack>
          {!readyFor.bounce && (
            <SubduedText fontSize="200">
              Adding the CNAME record in your DNS provider settings will set this domain up for
              Bounce as well resulting in SPF (sender policy framework) authentication which is a
              sending best practice.
            </SubduedText>
          )}
          {!readyFor.bounce && (
            <SubduedText fontSize="200">
              SPF is an email authentication method used to determine if a bounce domain is allowed
              to be used with a given sending IP. SPF failures can cause mail to be rejected at some
              providers, so SparkPost requires our CNAME record to be published in DNS for all
              bounce domains to ensure that they pass SPF checks.
            </SubduedText>
          )}

          <SubduedLink
            as={ExternalLink}
            to={EXTERNAL_LINKS.BOUNCE_DOMAIN_DOCUMENTATION}
            fontSize="200"
          >
            Bounce Domain Documentation
          </SubduedLink>
          <PageLink to="/domains/create" fontSize="200">
            Create a seperate bounce subdomain
          </PageLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          {!readyFor.bounce ? (
            <Panel.Section>
              Add the{' '}
              <Text as="span" fontWeight="semibold">
                CNAME
              </Text>{' '}
              record, Hostname and Value for this domain in the settings section of your DNS
              provider.
              <Panel.Action>
                <ExternalLink
                  to={`mailto:?subject=Assistance%20Requested%20Verifying%20a%20Bounce%20Domain%20on%20SparkPost&body=${userName}%20has%20requested%20your%20assistance%20verifying%20a%20bounce%20domain%20with%20SparkPost.%20Follow%20the%20link%20below%20to%20find%20the%20values%20you%E2%80%99ll%20need%20to%20add%20to%20the%20settings%20of%20your%20DNS%20provider.%0D%0A%5BGo%20to%20SparkPost%5D(${window.location})%0D%0A`}
                  icon={PlaneIcon}
                >
                  Forward to Colleague
                </ExternalLink>
              </Panel.Action>
            </Panel.Section>
          ) : (
            <Panel.Section>
              Below is the{' '}
              <Text as="span" fontWeight="semibold">
                CNAME{' '}
              </Text>
              record for the Hostname and Value for this domain at your DNS provider
            </Panel.Section>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <Panel.Section>
              <Stack>
                {!readyFor.bounce && (
                  <>
                    {isByoipAccount ? (
                      <Controller
                        name="verificationType"
                        render={({ value, onChange }) => (
                          <Select
                            onChange={onChange}
                            options={['CNAME', 'MX']}
                            value={value || initVerificationType}
                            label="Type"
                          />
                        )}
                        control={control}
                      />
                    ) : (
                      <>
                        <Text as="label" fontWeight="500" fontSize="200">
                          Type
                        </Text>
                        <Text as="p">{initVerificationType}</Text>
                      </>
                    )}
                  </>
                )}
                {watchVerificationType === 'MX' ? (
                  <Stack space="200">
                    <CopyField label="Hostname" value={id} hideCopy={readyFor.bounce} />
                    <CopyField
                      label="Value"
                      value={bounceDomainsConfig.mxValue}
                      hideCopy={readyFor.bounce}
                    />
                    <LineBreak text="AND" />
                    <>
                      <Text as="label" fontWeight="500" fontSize="200">
                        Type
                      </Text>
                      <Text as="p">{initVerificationType}</Text>
                    </>
                    <CopyField label="Hostname" value={id} hideCopy={readyFor.bounce} />
                    <CopyField
                      label="Value"
                      value={"v=spf1 ip4:{'<YOUR-IP-ADDRESS>'}/20 ~all"}
                      hideCopy={readyFor.bounce}
                    />
                  </Stack>
                ) : (
                  <Stack space="200">
                    <CopyField label="Hostname" value={id} hideCopy={readyFor.bounce} />
                    <CopyField
                      label="Value"
                      value={bounceDomainsConfig.cnameValue}
                      hideCopy={readyFor.bounce}
                    />
                  </Stack>
                )}

                {/*API doesn't support it; Do we want to store this in ui option*/}
              </Stack>
            </Panel.Section>
            {!readyFor.bounce && (
              <Panel.Section>
                <Checkbox
                  name="ack-checkbox-bounce"
                  label={`The ${watchVerificationType} record has been added to the DNS provider`}
                  disabled={verifyBounceLoading}
                  ref={register({ required: true })}
                />
              </Panel.Section>
            )}

            {!readyFor.bounce && (
              <Panel.Section>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!Boolean(watch('ack-checkbox-bounce'))}
                  loading={verifyBounceLoading}
                >
                  Authenticate for Bounce
                </Button>
              </Panel.Section>
            )}
          </form>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
