import React from 'react';
import { Table as OGTable } from '@sparkpost/matchbox';
import { Table as HibanaTable } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

HibanaTable.displayName = 'HibanaTable';
HibanaTable.Cell.displayName = 'HibanaTableCell';
HibanaTable.HeaderCell.displayName = 'HibanaTableHeaderCell';
HibanaTable.Row.displayName = 'HibanaTableRow';
OGTable.displayName = 'OGTable';
OGTable.Cell.displayName = 'OGTableCell';
OGTable.HeaderCell.displayName = 'OGTableHeaderCell';
OGTable.Row.displayName = 'OGTableRow';

function Table(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGTable {...omitSystemProps(props)} />;
  }
  return <HibanaTable {...props} />;
}

function Cell(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGTable.Cell {...omitSystemProps(props)} />;
  }
  return <HibanaTable.Cell {...props} />;
}

function HeaderCell(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGTable.HeaderCell {...omitSystemProps(props, ['width'])} />;
  }
  return <HibanaTable.HeaderCell {...props} />;
}

function Row(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGTable.Row {...omitSystemProps(props)} />;
  }
  return <HibanaTable.Row {...props} />;
}

function TotalsRow(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error('Hibana must be enabled to use Table.TotalsRow');

  return <HibanaTable.TotalsRow {...props} />;
}

Cell.displayName = 'Table.Cell';
HeaderCell.displayName = 'Table.HeaderCell';
Row.displayName = 'Table.Row';
TotalsRow.displayName = 'Table.TotalsRow';

Table.Cell = Cell;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.TotalsRow = TotalsRow;

export default Table;
