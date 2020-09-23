import React from 'react';
import { Button, Layout, Stack, Select, Text } from 'src/components/matchbox';
import { Checkbox, Panel } from 'src/components/matchbox';
import { SubduedText } from 'src/components/text';
import { Send } from '@sparkpost/matchbox-icons';
import { resolveReadyFor } from 'src/helpers/domains';
import { ExternalLink, PageLink } from 'src/components/links';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import LineBreak from 'src/components/lineBreak';
import getConfig from 'src/helpers/getConfig';
import { CopyField } from 'src/components';

const PlaneIcon = styled(Send)`
  transform: translate(0, -25%) rotate(-45deg);
`;

export default function SetupBounceDomainSection({ domain, isByoipAccount }) {
  // const { verifyDkim, showAlert } = useDomains();
  const { id, status } = domain;
  const readyFor = resolveReadyFor(status);
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { control, handleSubmit, watch } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);

  const onSubmit = () => {};
  return (
    <>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Bounce</Layout.SectionTitle>
        <Stack>
          <SubduedText>
            {readyFor.bounce
              ? 'Once the CNAME record is added to the DNS provider settings, the domain will also be setup for Bounce, resulting in Strict Alignment'
              : ''}
          </SubduedText>
          <ExternalLink to="/">Bounce Domain Documentation</ExternalLink>
          <PageLink to="/domains/create">Create a seperate bounce subdomain</PageLink>
        </Stack>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <Panel.Section>
            Add the{' '}
            <Text as="span" fontWeight="semibold">
              CNAME
            </Text>{' '}
            record, Hostname and Value for this domain in the settings section of your DNS provider.
            <Panel.Action>
              Forward to Collegue <PlaneIcon />
            </Panel.Action>
          </Panel.Section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Panel.Section>
              <Stack>
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
                    <CopyField label="Hostname" value={id} />

                    <CopyField label="Value" value={"v=spf1 ip4:{'<YOUR-IP-ADDRESS>'}/20 ~all"} />
                  </Stack>
                ) : (
                  <Stack space="200">
                    <CopyField label="Hostname" value={id} />
                    <CopyField label="Value" value={bounceDomainsConfig.cnameValue} />
                  </Stack>
                )}
                <Checkbox
                  id="add-txt-to-godaddy"
                  label={<>The TXT record has been added to the DNS provider</>}
                />
                {/*API doesn't support it; Do we want to store this in ui option*/}
              </Stack>
            </Panel.Section>
            <Panel.Section>
              <Button variant="primary" type="submit">
                Authenticate for Bounce
              </Button>
              {/* Functionality not available */}
            </Panel.Section>
          </form>
        </Panel>
      </Layout.Section>
    </>
  );
}
