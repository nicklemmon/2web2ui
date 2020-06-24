import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { refreshBounceReport } from 'src/actions/bounceReport';
import { LongTextContainer, Percent, TableCollection } from 'src/components';
import { mapStateToProps } from 'src/selectors/bounceReport';
import { Tag } from 'src/components/matchbox';
import { safeRate } from 'src/helpers/math';
import {
  EmptyWrapper,
  FilterBoxWrapper,
  LoadingWrapper,
  TableCollectionBody,
  TableWrapper,
} from './Wrappers';

const filterBoxConfig = {
  show: true,
  keyMap: {
    category: 'bounce_category_name',
    classification: 'bounce_class_name',
  },
  itemToStringKeys: ['bounce_category_name', 'bounce_class_name', 'domain', 'reason'],
  exampleModifiers: ['domain', 'category', 'classification'],
  matchThreshold: 5,
  label: 'Filter',
  wrapper: FilterBoxWrapper,
};

const columns = [
  { label: 'Count %', sortKey: 'count_bounce' },
  { label: 'Classification', sortKey: 'classification_id' },
  { label: 'Category', sortKey: 'bounce_category_name' },
  { label: 'Reason', width: '45%', sortKey: 'reason' },
  { label: 'Domain', sortKey: 'domain' },
];

export function BounceReasonsTable(props) {
  const { aggregates, reasons, refreshBounceReport, reportOptions, tableLoading } = props;

  useEffect(() => {
    if (reportOptions.to && reportOptions.from) {
      refreshBounceReport(reportOptions);
    }
  }, [refreshBounceReport, reportOptions]);

  const getRowData = useCallback(
    item => {
      const { reason, domain, bounce_category_name, bounce_class_name, count_bounce } = item;
      let numerator = count_bounce;
      let denominator = aggregates.countBounce;

      return [
        <Percent value={safeRate(numerator, denominator)} />,
        bounce_class_name,
        <Tag>{bounce_category_name}</Tag>,
        <LongTextContainer text={reason} />,
        domain,
      ];
    },
    [aggregates],
  );

  if (tableLoading) {
    return <LoadingWrapper />;
  }

  if (!reasons.length) {
    return <EmptyWrapper message="No bounce reasons to report" />;
  }

  return (
    <TableCollection
      columns={columns}
      rows={reasons}
      getRowData={getRowData}
      defaultSortColumn="count_bounce"
      defaultSortDirection="desc"
      wrapperComponent={TableWrapper}
      pagination
      filterBox={filterBoxConfig}
    >
      {props => <TableCollectionBody {...props} />}
    </TableCollection>
  );
}

const mapDispatchToProps = {
  refreshBounceReport,
};

export default connect(mapStateToProps, mapDispatchToProps)(BounceReasonsTable);
