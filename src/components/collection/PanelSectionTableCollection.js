import React from 'react';
import { Box, Panel, Table } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import TableCollection from './TableCollection';

const PanelSectionTableCollection = props => {
  const [{ isHibanaEnabled }] = useHibana();

  if (!isHibanaEnabled) {
    return <TableCollection {...props} />;
  }

  return (
    <TableCollection {...props} wrapperComponent={Table}>
      {({ collection, filterBox, heading, pagination }) => (
        <>
          {heading && <Panel.LEGACY.Section>{heading}</Panel.LEGACY.Section>}
          {filterBox && <Panel.LEGACY.Section>{filterBox}</Panel.LEGACY.Section>}
          <Box borderBottom="400">{collection}</Box>
          {pagination && <Panel.LEGACY.Section>{pagination}</Panel.LEGACY.Section>}
        </>
      )}
    </TableCollection>
  );
};

export default PanelSectionTableCollection;
