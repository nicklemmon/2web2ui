import React, { useState } from 'react';
import {
  Banner,
  Box,
  Button,
  Layout,
  Stack,
  Select,
  Tag,
  Text,
  TextField,
} from 'src/components/matchbox';
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

const Field = ({ verified, label, value }) => {
  if (!verified) return <CopyField label={label} value={value} />;
  return <TextField label={label} value={value} readOnly />;
};

export default function SetupBounceDomainSection({ domain, isByoipAccount, isSectionVisible }) {
  const { id, status, subaccount_id } = domain;
  const readyFor = resolveReadyFor(status);
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { control, handleSubmit, watch } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);
  const { getDomain, verify, showAlert } = useDomains();
  const [warningBanner, toggleBanner] = useState(true);

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
        <Layout.SectionTitle as="h2">Bounce</Layout.SectionTitle>
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
                  to="mailto:abc@example.com?subject=todo-get-subject&body=todo-get-message"
                  icon={PlaneIcon}
                >
                  Forward to Collegue
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
                    <Field label="Hostname" value={id} verified={readyFor.bounce} />
                    <Field
                      label="Value"
                      value={bounceDomainsConfig.mxValue}
                      verified={readyFor.bounce}
                    />
                    <LineBreak text="AND" />
                    <>
                      <Text as="label" fontWeight="500" fontSize="200">
                        Type
                      </Text>
                      <Text as="p">{initVerificationType}</Text>
                    </>
                    <Field label="Hostname" value={id} verified={readyFor.bounce} />

                    <Field
                      label="Value"
                      value={"v=spf1 ip4:{'<YOUR-IP-ADDRESS>'}/20 ~all"}
                      verified={readyFor.bounce}
                    />
                  </Stack>
                ) : (
                  <Stack space="200">
                    <Field label="Hostname" value={id} verified={readyFor.bounce} />
                    <Field
                      label="Value"
                      value={bounceDomainsConfig.cnameValue}
                      verified={readyFor.bounce}
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
                <Field
                  label="Hostname"
                  value={id}
                  verified={domain.status.spf_status === 'valid'}
                ></Field>
                <Field
                  label="Value"
                  value="v=spf1 mx  a    ~all"
                  verified={domain.status.spf_status === 'valid'}
                ></Field>
              </Stack>
            </Panel.Section>
            {(!readyFor.bounce || domain.status.spf_status !== 'valid') && (
              <Panel.Section>
                {readyFor.bounce && domain.status.spf_status !== 'valid' ? (
                  <Checkbox
                    id="add-txt-to-godaddy"
                    label="The TXT record has been added to the DNS provider"
                  />
                ) : (
                  <Checkbox
                    id="add-txt-to-godaddy"
                    label={`The ${watchVerificationType} record has been added to the DNS provider`}
                  />
                )}
              </Panel.Section>
            )}
            {readyFor.bounce && domain.status.spf_status !== 'valid' && (
              <Panel.Section>
                <Button variant="primary" type="submit">
                  Authenticate for SPF
                </Button>
              </Panel.Section>
            )}
            {!readyFor.bounce && (
              <Panel.Section>
                <Button variant="primary" type="submit">
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
