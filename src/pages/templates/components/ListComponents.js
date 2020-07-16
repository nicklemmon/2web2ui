import React from 'react';
import { formatDateTime } from 'src/helpers/date';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import useUniqueId from 'src/hooks/useUniqueId';
import { PageLink } from 'src/components/links';
import { Tag, Tooltip } from 'src/components/matchbox';
import OGStyles from './ListComponents.module.scss';
import hibanaStyles from './ListComponentsHibana.module.scss';
import { routeNamespace } from '../constants/routes';

export const Name = ({ list_name: name, id, subaccount_id, ...rowData }) => {
  const version = rowData.list_status === 'draft' ? 'draft' : 'published';

  return (
    <PageLink
      to={`/${routeNamespace}/edit/${id}/${version}/content${setSubaccountQuery(subaccount_id)}`}
    >
      {name}
    </PageLink>
  );
};

export const Status = rowData => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const id = useUniqueId('templates-status');
  const { list_status } = rowData;

  if (list_status === 'published') {
    return (
      <Tag color="green" className={styles.published}>
        Published
      </Tag>
    );
  }

  if (list_status === 'published_with_draft') {
    return (
      <Tooltip id={id} dark content="Contains unpublished changes">
        <Tag color="green" className={styles.PublishedWithChanges}>
          Published
        </Tag>
      </Tooltip>
    );
  }

  return <Tag>Draft</Tag>;
};

export const LastUpdated = ({ last_update_time }) => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  return <p className={styles.LastUpdated}>{formatDateTime(last_update_time)}</p>;
};
