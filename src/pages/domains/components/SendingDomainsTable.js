import React, { useEffect } from 'react';
import { Bookmark } from '@sparkpost/matchbox-icons';
import config from 'src/config';
import { ApiErrorBanner, Empty, PanelLoading, Subaccount, TableCollection } from 'src/components';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import { Box, Inline, Panel, ScreenReaderOnly, Stack, Tag, Tooltip } from 'src/components/matchbox';
import { resolveStatus, resolveReadyFor } from 'src/helpers/domains';
import { formatDate } from 'src/helpers/date';
import useUniqueId from 'src/hooks/useUniqueId';
import useDomains from '../hooks/useDomains';
import { DETAILS_BASE_URL, API_ERROR_MESSAGE } from '../constants';

export default function SendingDomainsTable({ renderBounceOnly = false }) {
  const {
    listSendingDomains,
    sendingDomains,
    bounceDomains,
    sendingDomainsListError,
    hasSubaccounts,
    listSubaccounts,
    subaccounts,
    listPending,
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

  if (listPending) return <PanelLoading />;

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

function StatusCell({ domain }) {
  const tooltipId = useUniqueId('default-bounce-domain');
  const resolvedStatus = resolveStatus(domain.status);
  const readyFor = resolveReadyFor(domain.status);
  const { is_default_bounce_domain, status } = domain;

  if (resolvedStatus === 'blocked') return <Tag color="red">Blocked</Tag>;

  return (
    <Inline space="100">
      {resolvedStatus === 'unverified' && <Tag color="yellow">Failed Verification</Tag>}

      {readyFor?.sending && <Tag>Sending</Tag>}

      {readyFor?.bounce && (
        <Tag>
          <Inline space="100">
            <TranslatableText>Bounce</TranslatableText>

            {is_default_bounce_domain && (
              <Box color="green.700">
                <Tooltip content="Default Bounce Domain" id={tooltipId}>
                  <div tabIndex="0" data-id="default-bounce-domain-tooltip">
                    <Bookmark />
                  </div>
                </Tooltip>
              </Box>
            )}
          </Inline>
        </Tag>
      )}

      {readyFor?.dkim && <Tag color="green">DKIM Signing</Tag>}

      {status?.spf_status === 'valid' && <Tag color="green">SPF Valid</Tag>}
    </Inline>
  );
}
