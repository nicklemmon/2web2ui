import React from 'react';
import { Bookmark } from '@sparkpost/matchbox-icons';
import { Subaccount } from 'src/components';
import { Box, Inline, ScreenReaderOnly, Stack, Table, Tag, Tooltip } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import useUniqueId from 'src/hooks/useUniqueId';
import { DETAILS_BASE_URL } from '../constants';

export default function TrackingDomainsTable({ rows }) {
  return (
    <Table title="Tracking Domains">
      <ScreenReaderOnly as="thead">
        <Table.Row>
          <Table.HeaderCell>Domain</Table.HeaderCell>

          <Table.HeaderCell>Status</Table.HeaderCell>
        </Table.Row>
      </ScreenReaderOnly>

      <tbody>
        {rows?.map((domain, index) => {
          return (
            <Table.Row key={`table-row-${index}`}>
              <Table.Cell>
                <MainCell row={domain} />
              </Table.Cell>

              <Table.Cell>
                <StatusCell row={domain} />
              </Table.Cell>
            </Table.Row>
          );
        })}
      </tbody>
    </Table>
  );
}

function MainCell({ row }) {
  const { domainName, subaccountId, sharedWithSubaccounts, subaccountName } = row;

  return (
    <Stack space="100">
      <PageLink to={`${DETAILS_BASE_URL}/${domainName}`}>{domainName}</PageLink>

      {subaccountId && (
        <div>
          <TranslatableText>Assignment: </TranslatableText>
          <Subaccount all={sharedWithSubaccounts} id={subaccountId} name={subaccountName} />
        </div>
      )}
    </Stack>
  );
}

function StatusCell({ row }) {
  const { defaultTrackingDomain, unverified, blocked } = row;
  const tooltipId = useUniqueId('default-tracking-domain');

  if (blocked) return <Tag color="red">Blocked</Tag>;

  if (unverified) return <Tag color="yellow">Unverified</Tag>;

  return (
    <Inline space="100">
      <Tag>
        <Inline space="100">
          <TranslatableText>Tracking</TranslatableText>

          {defaultTrackingDomain && (
            <Box color="green.700">
              <Tooltip content="Default Tracking Domain" id={tooltipId}>
                <div tabIndex="0" data-id="default-tracking-domain-tooltip">
                  <Bookmark />
                </div>
              </Tooltip>
            </Box>
          )}
        </Inline>
      </Tag>
    </Inline>
  );
}
