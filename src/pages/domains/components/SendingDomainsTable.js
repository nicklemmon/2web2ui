import React, { useEffect } from 'react';
import config from 'src/config';
import { ApiErrorBanner, Empty, PanelLoading, Subaccount, TableCollection } from 'src/components';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import { Panel, ScreenReaderOnly, Stack } from 'src/components/matchbox';
import { formatDate } from 'src/helpers/date';
import useDomains from '../hooks/useDomains';
import { DETAILS_BASE_URL, API_ERROR_MESSAGE } from '../constants';
import { SendingDomainStatusCell as StatusCell } from './SendingDomainStatusCell';

export default function SendingDomainsTable({ renderBounceOnly = false }) {
  const {
    listSendingDomains,
    sendingDomains,
    bounceDomains,
    sendingDomainsListError,
    hasSubaccounts,
    listSubaccounts,
    subaccounts,
    pending,
  } = useDomains();
  const domains = renderBounceOnly ? bounceDomains : sendingDomains;
  const isEmpty = domains.length === 0;

  useEffect(() => {
    listSendingDomains();

    if (hasSubaccounts && subaccounts.length === 0) {
      listSubaccounts();
    }
    // eslint-disable-next-line
  }, []);

  if (pending) return <PanelLoading />;

  if (sendingDomainsListError) {
    return (
      <ApiErrorBanner
        errorDetails={sendingDomainsListError.message}
        message={API_ERROR_MESSAGE}
        reload={() => listSendingDomains()}
      />
    );
  }

  if (isEmpty) {
    return (
      <Panel.LEGACY>
        <Empty message="There is no data to display" />
      </Panel.LEGACY>
    );
  }

  return (
    <TableCollection
      columns={[
        { label: 'Domains', key: 'sending_domains_domain' },
        { label: <ScreenReaderOnly>Status</ScreenReaderOnly>, key: 'sending_domains_status' },
      ]}
      rows={domains}
      getRowData={getRowData}
      pagination={true}
    />
  );
}

function getRowData(domain) {
  return [<MainCell domain={domain} />, <StatusCell domain={domain} />];
}

function MainCell({ domain }) {
  const {
    domain: domainName,
    creation_time,
    shared_with_subaccounts,
    subaccount_id,
    subaccount_name,
  } = domain;

  return (
    <Stack space="100">
      <PageLink to={`${DETAILS_BASE_URL}/${domainName}`}>{domainName}</PageLink>

      {subaccount_id ? (
        <div>
          <TranslatableText>Assignment: </TranslatableText>
          <Subaccount all={shared_with_subaccounts} id={subaccount_id} name={subaccount_name} />
        </div>
      ) : null}

      {creation_time ? (
        <div>
          <TranslatableText>Added: </TranslatableText>

          {formatDate(creation_time, config.dateFormatWithComma)}
        </div>
      ) : null}
    </Stack>
  );
}
