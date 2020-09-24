import React, { useEffect } from 'react';
import { Bookmark } from '@sparkpost/matchbox-icons';
import { ApiErrorBanner, Empty, PanelLoading, Subaccount, TableCollection } from 'src/components';
import { Box, Inline, Panel, ScreenReaderOnly, Stack, Tag, Tooltip } from 'src/components/matchbox';
import { PageLink } from 'src/components/links';
import { TranslatableText } from 'src/components/text';
import useUniqueId from 'src/hooks/useUniqueId';
import useDomains from '../hooks/useDomains';
import { DETAILS_BASE_URL, API_ERROR_MESSAGE } from '../constants';

export default function TrackingDomainsTable() {
  const {
    listTrackingDomains,
    listPending,
    hasSubaccounts,
    listSubaccounts,
    subaccounts,
    trackingDomains,
    trackingDomainsListError,
  } = useDomains();
  const isEmpty = trackingDomains.length === 0;

  useEffect(() => {
    listTrackingDomains();

    if (hasSubaccounts && subaccounts.length === 0) {
      listSubaccounts();
    }
    // eslint-disable-next-line
  }, []);

  if (listPending) return <PanelLoading />;

  if (trackingDomainsListError) {
    return (
      <ApiErrorBanner
        errorDetails={trackingDomainsListError.message}
        message={API_ERROR_MESSAGE}
        reload={() => listTrackingDomains()}
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
      rows={trackingDomains}
      getRowData={getRowData}
      pagination={true}
    />
  );
}

function getRowData(trackingDomain) {
  return [
    <MainCell trackingDomain={trackingDomain} />,
    <StatusCell trackingDomain={trackingDomain} />,
  ];
}

function MainCell({ trackingDomain }) {
  const { domain, subaccount_id, shared_with_subaccounts, subaccount_name } = trackingDomain;
  return (
    <Stack space="100">
      <PageLink to={`${DETAILS_BASE_URL}/${domain}`}>{domain}</PageLink>

      {subaccount_id ? (
        <div>
          <TranslatableText>Assignment: </TranslatableText>
          <Subaccount all={shared_with_subaccounts} id={subaccount_id} name={subaccount_name} />
        </div>
      ) : null}
    </Stack>
  );
}

function StatusCell({ trackingDomain }) {
  const tooltipId = useUniqueId('default-tracking-domain');
  const { default: isDefault, status } = trackingDomain;

  return (
    <Inline space="100">
      {status === 'blocked' && <Tag color="red">Blocked</Tag>}

      {status === 'unverified' && <Tag color="yellow">Failed Verification</Tag>}

      {status === 'verified' && (
        <Tag>
          <Inline space="100">
            <TranslatableText>Tracking</TranslatableText>

            {isDefault && (
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
      )}
    </Inline>
  );
}
