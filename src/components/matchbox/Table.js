import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Table as OGTable } from '@sparkpost/matchbox';
import { Table as HibanaTable } from '@sparkpost/matchbox-hibana';
import { ArrowDropDown, ArrowDropUp } from '@sparkpost/matchbox-icons';
import { ScreenReaderOnly } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

const SortIcon = styled.span`
  display: inline-flex;
  height: ${props => props.theme.space['400']};
  width: ${props => props.theme.space['400']};
  margin-left: ${props => props.theme.space['200']};
  border-radius: ${props => props.theme.radii['100']};
  color: ${props => (props.sortDirection ? '#fff' : props.theme.colors.gray['700'])};
  background-color: ${props =>
    props.sortDirection ? props.theme.colors.blue['700'] : 'transparent'};
  transition-property: background-color, color;
`;

// TODO: Incorporate styles.buttonReset from Matchbox when FE-1162 is merged
const StyledSortButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* stylelint-disable selector-type-no-unknown */
  &:hover ${SortIcon}, &:focus ${SortIcon} {
    background-color: ${props =>
      props.sortDirection ? props.theme.colors.blue['700'] : props.theme.colors.blue['200']};
    color: ${props => (props.sortDirection ? '#fff' : props.theme.colors.blue['700'])};
  }
  /* stylelint-enable selector-type-no-unknown */
`;

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

function SortButton({ onClick, children, sortDirection }) {
  const SORT_ICON_SIZE = 22;
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled)
    throw new Error('The `SortButton` can only be used when Hibana is enabled.');

  return (
    <StyledSortButton onClick={onClick} sortDirection={sortDirection}>
      {children}

      {sortDirection === 'asc' && (
        <>
          <SortIcon sortDirection={sortDirection} size={SORT_ICON_SIZE} as={ArrowDropUp} />
          <ScreenReaderOnly> Ascending</ScreenReaderOnly>
        </>
      )}

      {sortDirection === 'desc' && (
        <>
          <SortIcon sortDirection={sortDirection} size={SORT_ICON_SIZE} as={ArrowDropDown} />
          <ScreenReaderOnly> Descending</ScreenReaderOnly>
        </>
      )}

      {!sortDirection && (
        <SortIcon sortDirection={sortDirection} size={SORT_ICON_SIZE} as={ArrowDropDown} />
      )}
    </StyledSortButton>
  );
}

SortButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc', undefined]),
};

Cell.displayName = 'Table.Cell';
HeaderCell.displayName = 'Table.HeaderCell';
Row.displayName = 'Table.Row';
TotalsRow.displayName = 'Table.TotalsRow';
SortButton.displayName = 'Table.SortButton';

Table.Cell = Cell;
Table.HeaderCell = HeaderCell;
Table.Row = Row;
Table.TotalsRow = TotalsRow;
Table.SortButton = SortButton;

export default Table;
