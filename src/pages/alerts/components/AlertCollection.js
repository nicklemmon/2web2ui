import React, { Component } from 'react';
import { Delete } from '@sparkpost/matchbox-icons';
import { Button, ScreenReaderOnly, Tag } from 'src/components/matchbox';
import { TableCollection, DisplayDate } from 'src/components';
import { PageLink } from 'src/components/links';
import AlertToggle from './AlertToggle';
import { METRICS } from '../constants/formConstants';
import OGStyles from './AlertCollection.module.scss';
import hibanaStyles from './AlertCollectionHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride/useHibanaOverride';

export class AlertCollectionComponent extends Component {
  getDetailsLink = ({ id }) => `/alerts/details/${id}`;

  getColumns() {
    const columns = [
      { label: 'Alert Name', sortKey: 'name', width: '35%' },
      { label: 'Metric', sortKey: 'metric' },
      { label: 'Last Triggered', sortKey: 'last_triggered_timestamp' },
      { label: 'Mute', sortKey: 'muted' },
      { label: <ScreenReaderOnly>Actions</ScreenReaderOnly> },
    ];

    return columns;
  }

  getRowData = ({
    metric,
    muted,
    id,
    name,
    last_triggered_timestamp,
    last_triggered_formatted,
  }) => {
    const { styles } = this.props;
    const deleteFn = () => this.props.handleDelete({ id, name });
    return [
      <PageLink to={this.getDetailsLink({ id })}>{name}</PageLink>,
      <Tag>{METRICS[metric]}</Tag>,
      <DisplayDate
        timestamp={last_triggered_timestamp}
        formattedDate={last_triggered_formatted || 'Never Triggered'}
      />,
      <AlertToggle muted={muted} id={id} />,
      <Button variant="minimal" onClick={deleteFn}>
        <span>Delete</span>
        <Delete className={styles.Icon} />
      </Button>,
    ];
  };

  render() {
    const { alerts, filterBoxConfig } = this.props;

    return (
      <TableCollection
        columns={this.getColumns()}
        rows={alerts}
        getRowData={this.getRowData}
        pagination={true}
        filterBox={filterBoxConfig}
        defaultSortColumn="last_triggered_timestamp"
        defaultSortDirection="desc"
      />
    );
  }
}

export default function AlertCollection(props) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);
  const filterBoxConfig = {
    show: true,
    exampleModifiers: ['name'],
    itemToStringKeys: ['name'],
  };

  return <AlertCollectionComponent styles={styles} filterBoxConfig={filterBoxConfig} {...props} />;
}
