import React, { useState } from 'react';
import { Banner, Box, Button, Layout, Stack, Select, Tag, Text } from 'src/components/matchbox';
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

const StyledText = styled(Text)`
  float: right;
  color: #c5ced6;
`;

export default function SetupBounceDomainSection({ domain, isSectionVisible, title }) {
  const { id, status, subaccount_id } = domain;
  const {
    getDomain,
    verify,
    showAlert,
    userName,
    isByoipAccount,
    verifyBounceLoading,
  } = useDomains();
  const readyFor = resolveReadyFor(status);
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { control, handleSubmit, watch } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);
  const [warningBanner, toggleBanner] = useState(true);
  const [checked, toggleChecked] = useState(
    readyFor.bounce && domain.status.spf_status !== 'valid',
  );

  const onSubmit = () => {
    if (!readyFor.bounce) {
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
    }
    return getDomain(id).then(result => {
      if (result.status.spf_status === 'valid') {
        showAlert({
          type: 'success',
          message: `You have successfully autheticated SPF`,
        });
      } else {
        showAlert({
          type: 'error',
          message: `SPF autheticated failed`,
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
          <SubduedText>
            <Stack>
              {readyFor.bounce ? (
                ''
              ) : (
                <>
                  Once the CNAME record is added to the DNS provider settings, the domain will also
                  be setup for Bounce, resulting in Strict Alignment.
                </>
              )}
              {domain.status.spf_status !== 'valid' && readyFor.bounce && warningBanner && (
                <Banner status="warning" size="small" onDismiss={() => toggleBanner(false)}>
                  <Text fontWeight="normal" maxWidth="100">
                    This domain is not SPF authenticated.
                  </Text>
                </Banner>
              )}
              {domain.status.spf_status !== 'valid' && (
                <>
                  SPF (Sender Policy Framework) is an email authentication method to determine if a
                  bounce domain is allowed to be used with in given sending IP. SPF failures can
                  cause mail to be rejected at some providers. To ensure they pass all SPF checks,
                  publishing SparkPost CNAME in DNS is required for all bounce domains.
                </>
              )}
            </Stack>
          </SubduedText>

          <SubduedLink as={ExternalLink} to={EXTERNAL_LINKS.BOUNCE_DOMAIN_DOCUMENTATION}>
            Bounce Domain Documentation
          </SubduedLink>
          <PageLink to="/domains/create">Create a seperate bounce subdomain</PageLink>
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
                  to={`mailto:?subject=Assistance%20Requested%20Verifying%20a%20Sending%20Domain%20on%20SparkPost&body=${userName}%20has%20requested%20your%20assistance%20verifying%20a%20sending%20domain%20with%20SparkPost.%20Follow%20the%20link%20below%20to%20find%20the%20values%20you%E2%80%99ll%20need%20to%20add%20to%20the%20settings%20of%20your%20DNS%20provider.%0D%0A%5BGo%20to%20SparkPost%5D(${window.location})%0D%0A`}
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
            <Panel.Section>
              <Stack>
                {domain.status.spf_status !== 'valid' && (
                  <Box>
                    <Text as="span" fontSize="400" fontWeight="semibold">
                      Add SPF Record <Tag color="green">Recommended</Tag>
                    </Text>
                    <StyledText as="span" fontSize="400" color="gray.400">
                      Optional
                    </StyledText>
                  </Box>
                )}
                {domain.status.spf_status !== 'valid' && (
                  <>
                    <Text as="label" fontWeight="500" fontSize="200">
                      Type
                    </Text>
                    <Text as="p">TXT</Text>
                  </>
                )}
                <CopyField
                  label="Hostname"
                  value={id}
                  hideCopy={domain.status.spf_status === 'valid'}
                />
                <CopyField
                  label="Value"
                  value="v=spf1 mx a ~all"
                  hideCopy={domain.status.spf_status === 'valid'}
                />
              </Stack>
            </Panel.Section>
            {(!readyFor.bounce || domain.status.spf_status !== 'valid') && (
              <Panel.Section>
                {readyFor.bounce && domain.status.spf_status !== 'valid' ? (
                  <Checkbox
                    id="add-txt-to-godaddy"
                    label="The TXT record has been added to the DNS provider"
                    disabled={verifyBounceLoading}
                    onChange={() => toggleChecked(!checked)}
                  />
                ) : (
                  <Checkbox
                    id="add-txt-to-godaddy"
                    label={`The ${watchVerificationType} record has been added to the DNS provider`}
                    disabled={verifyBounceLoading}
                    onChange={() => toggleChecked(!checked)}
                  />
                )}
              </Panel.Section>
            )}
            {readyFor.bounce && domain.status.spf_status !== 'valid' && (
              <Panel.Section>
                <Button variant="primary" type="submit" disabled={!checked}>
                  Authenticate for SPF
                </Button>
              </Panel.Section>
            )}
            {!readyFor.bounce && (
              <Panel.Section>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={!checked}
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
