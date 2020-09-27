import React from 'react';
import { Box, Layout, Stack, Text, TextField } from 'src/components/matchbox';
import { Panel } from 'src/components/matchbox';
import { useForm } from 'react-hook-form';
import LineBreak from 'src/components/lineBreak';
import getConfig from 'src/helpers/getConfig';

export default function SendingAndBounceDomainSection({
  domain,
  isByoipAccount,
  isSectionVisible,
}) {
  const { id, status } = domain;
  const initVerificationType = isByoipAccount && status.mx_status === 'valid' ? 'MX' : 'CNAME';
  const bounceDomainsConfig = getConfig('bounceDomains');
  const { watch } = useForm();
  const watchVerificationType = watch('verificationType', initVerificationType);
  if (!isSectionVisible) {
    return null;
  }
  return (
    <Layout>
      <Layout.Section annotated>
        <Layout.SectionTitle as="h2">Sending and Bounce</Layout.SectionTitle>
      </Layout.Section>
      <Layout.Section>
        <Panel>
          <Panel.Section>Below is the records for this domain at your DNS provider</Panel.Section>
          <Panel.Section>
            <Stack>
              <Box>
                <Text as="span" fontSize="300" fontWeight="semibold">
                  TXT record for DKIM
                </Text>
              </Box>
              <TextField label="Hostname" value={domain.dkimHostname} readOnly />
              <TextField label="Value" value={domain.dkimValue} readOnly />
            </Stack>
          </Panel.Section>
          <Panel.Section>
            <Stack>
              <Box>
                <Text as="span" fontSize="300" fontWeight="semibold">
                  {`${initVerificationType} record for Bounce`}
                </Text>
              </Box>
              {watchVerificationType === 'MX' ? (
                <Stack space="200">
                  <TextField label="Hostname" value={id} readOnly />
                  <TextField label="Value" value={bounceDomainsConfig.mxValue} readOnly />
                  <LineBreak text="AND" />
                  <>
                    <Text as="label" fontWeight="500" fontSize="200">
                      Type
                    </Text>
                    <Text as="p">{initVerificationType}</Text>
                  </>
                  <TextField label="Hostname" value={id} readOnly />

                  <TextField
                    label="Value"
                    value={"v=spf1 ip4:{'<YOUR-IP-ADDRESS>'}/20 ~all"}
                    readOnly
                  />
                </Stack>
              ) : (
                <Stack space="200">
                  <TextField label="Hostname" value={id} readOnly />
                  <TextField label="Value" value={bounceDomainsConfig.cnameValue} readOnly />
                </Stack>
              )}
            </Stack>
          </Panel.Section>
          <Panel.Section>
            <Stack>
              <Box>
                <Text as="span" fontSize="300" fontWeight="semibold">
                  TXT record for SPF
                </Text>
              </Box>
              <TextField label="Hostname" value={id} readOnly></TextField>
              <TextField label="Value" value="v=spf1 mx  a    ~all" readOnly></TextField>
            </Stack>
          </Panel.Section>
        </Panel>
      </Layout.Section>
    </Layout>
  );
}
