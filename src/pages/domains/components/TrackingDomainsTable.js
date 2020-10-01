import React from 'react';
import { Subaccount } from 'src/components';
import { ScreenReaderOnly, Stack, Table } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import { DETAILS_BASE_URL } from '../constants';
import TrackingDomainStatusCell from './TrackingDomainStatusCell';

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
                <TrackingDomainStatusCell row={domain} />
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
