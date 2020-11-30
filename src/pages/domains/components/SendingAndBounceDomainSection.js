import React from 'react';
import { Layout, Stack, Text } from 'src/components/matchbox';
import { Button, Checkbox, Panel } from 'src/components/matchbox';
import { useForm } from 'react-hook-form';
import LineBreak from 'src/components/lineBreak';
import { Bold, SubduedText } from 'src/components/text';
import { resolveReadyFor } from 'src/helpers/domains';
import getConfig from 'src/helpers/getConfig';
import useDomains from '../hooks/useDomains';
import { ExternalLink, SubduedLink } from 'src/components/links';
import { CopyField } from 'src/components';
import { Send } from '@sparkpost/matchbox-icons';
import styled from 'styled-components';
import { EXTERNAL_LINKS } from '../constants';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

export default function SendingAndBounceDomainSection({ domain, isSectionVisible }) {
  const { id, status, subaccount_id } = domain;
  const {
    verifyDkim,
    verify,
    showAlert,
    userName,
    isByoipAccount,
    verifyDkimLoading,
    verifyBounceLoading,
  } = useDomains();
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { errors, watch, register, handleSubmit } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);

  const readyFor = resolveReadyFor(domain.status);

  const onSubmit = () => {
    if (!readyFor.bounce) {
      const type = watchVerificationType.toLowerCase();

      verify({ id, subaccount: subaccount_id, type }).then(result => {
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

    if (!readyFor.dkim) {
      const { id, subaccount_id: subaccount } = domain;

      verifyDkim({ id, subaccount }).then(results => {
        const readyFor = resolveReadyFor(results);

        if (readyFor.dkim) {
          showAlert({
            type: 'success',
            message: `You have successfully verified DKIM record of ${id}`,
          });
        } else {
          showAlert({
            type: 'error',
            message: `Unable to verify DKIM record of ${id}. ${results.dns.dkim_error}`,
          });
        }
      });
    }
  };

  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">
          {readyFor.dkim ? 'Sending and Bounce' : 'DNS Verification'}
        </Layout.SectionTitle>
        {(!readyFor.dkim || !readyFor.bounce) && (
          <Stack>
            <SubduedText fontSize="200">
              Strict alignment is when the sending and bounce domain being the same value (e.g.
              sending domain = sparkpost.com, and bounce domain = sparkpost.com)
            </SubduedText>
            <SubduedLink
              as={ExternalLink}
              to={EXTERNAL_LINKS.SENDING_DOMAINS_DOCUMENTATION}
              fontSize="200"
            >
              Domain Documentation
            </SubduedLink>
          </Stack>
        )}
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <form onSubmit={handleSubmit(onSubmit)} id="sendingbounceForm">
            {!readyFor.dkim || !readyFor.bounce ? (
              <Panel.Section>
                Add the <Bold>TXT</Bold> and <Bold>{watchVerificationType} </Bold>
                records, Hostnames and Values for this domain in the settings section of your DNS
                Provider
                <Panel.Action>
                  <ExternalLink
                    to={`mailto:?subject=Assistance%20Requested%20Verifying%20a%20Sending/Bounce%20Domain%20on%20SparkPost&body=${userName}%20has%20requested%20your%20assistance%20verifying%20a%20sending/bounce%20domain%20with%20SparkPost.%20Follow%20the%20link%20below%20to%20find%20the%20values%20you%E2%80%99ll%20need%20to%20add%20to%20the%20settings%20of%20your%20DNS%20provider.%0D%0A%5BGo%20to%20SparkPost%5D(${window.location})%0D%0A`}
                    icon={PlaneIcon}
                  >
                    Forward to Colleague
                  </ExternalLink>
                </Panel.Action>
              </Panel.Section>
            ) : (
              <Panel.Section>
                Below is the records for this domain at your DNS provider
              </Panel.Section>
            )}

            <Panel.Section>
              <Stack>
                <Text as="span" fontSize="300" fontWeight="semibold" role="heading">
                  {!readyFor.dkim ? 'Add DKIM Record' : 'TXT record for DKIM'}
                </Text>

                {!readyFor.dkim && (
                  <>
                    <Text as="label" fontWeight="500" fontSize="200">
                      Type
                    </Text>
                    <Text as="p">TXT</Text>
                  </>
                )}
                <CopyField label="Hostname" value={domain.dkimHostname} hideCopy={readyFor.dkim} />
                <CopyField label="Value" value={domain.dkimValue} hideCopy={readyFor.dkim} />
              </Stack>
            </Panel.Section>
            <Panel.Section>
              <Stack>
                <Text as="span" fontSize="300" fontWeight="semibold" role="heading">
                  {!readyFor.bounce
                    ? 'Add Bounce Record'
                    : `${initVerificationType} record for Bounce`}
                </Text>

                {watchVerificationType === 'MX' ? (
                  <Stack space="200">
                    <CopyField label="Hostname" value={id} />
                    <CopyField label="Value" value={bounceDomainsConfig.mxValue} />
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
                  <Stack>
                    {!readyFor.bounce && (
                      <>
                        <Text as="label" fontWeight="500" fontSize="200">
                          Type
                        </Text>
                        <Text as="p">CNAME</Text>
                      </>
                    )}
                    <CopyField label="Hostname" value={id} hideCopy={readyFor.bounce} />
                    <CopyField
                      label="Value"
                      value={bounceDomainsConfig.cnameValue}
                      hideCopy={readyFor.bounce}
                    />
                  </Stack>
                )}
              </Stack>
            </Panel.Section>
            {(!readyFor.bounce || !readyFor.dkim) && (
              <Panel.Section>
                <Checkbox
                  ref={register({ required: true })}
                  name="addToDns"
                  label="The TXT and CNAME records have been added to the DNS provider"
                  error={errors.addToDns && 'Adding TXT and CNAME is required'}
                  disabled={verifyBounceLoading || verifyDkimLoading}
                />
              </Panel.Section>
            )}
            {(!readyFor.bounce || !readyFor.dkim) && (
              <Panel.Section>
                <Button
                  variant="primary"
                  type="submit"
                  name="sendingBounceForm"
                  loading={verifyBounceLoading || verifyDkimLoading}
                  disabled={!watch('addToDns')}
                >
                  Authenticate Domain
                </Button>
              </Panel.Section>
            )}
          </form>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
