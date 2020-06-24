import React from 'react';
import { AccessTime } from '@sparkpost/matchbox-icons';
import { PageLink } from 'src/components/links';
import { Table, Tag, Text } from 'src/components/matchbox';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import OGStyles from './RelatedIncidents.module.scss';
import hibanaStyles from './RelatedIncidentsHibana.module.scss';

export default ({ incidents = [], header = '', type = '' }) => {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  return (
    <Table>
      <tbody>
        <Table.Row>
          <Table.HeaderCell>{header}</Table.HeaderCell>
          {incidents.length > 0 && <Table.HeaderCell>Resolved</Table.HeaderCell>}
        </Table.Row>

        {incidents.map(incident => (
          <Table.Row className={styles.Table} key={incident.id}>
            <Table.Cell>
              <div>
                <PageLink to={`/blocklist/incidents/${incident.id}`}>
                  <strong>
                    <Text as="span" fontWeight="normal">
                      {type === 'blocklist' ? incident.resource : incident.blacklist_name}
                    </Text>
                  </strong>
                </PageLink>
                <div>
                  <AccessTime className={styles.TimeIcon} />
                  <span>{`Listed ${incident.occurred_at_formatted}`}</span>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className={styles.ResolvedCell}>
              <div className={styles.Resolved}>
                {incident.resolved_at_formatted || <Tag color="yellow">Active</Tag>}
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </tbody>
    </Table>
  );
};
