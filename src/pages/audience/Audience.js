import React from 'react';
import { data } from './data';
import { Page, Panel, Box, Stack } from '@sparkpost/matchbox-hibana';
import { useFilters, Filters } from './Filters';
import Area from './Area';

function Audience() {
  const [filters, filterHandlers] = useFilters();

  return (
    <Page title="Audience">
      <Stack>
        <Filters values={filters} handlers={filterHandlers} />
        <Panel>
          {filters.graphType === 'stacked_area' && (
            <Panel.Section>
              <Area data={data} filters={filters} />
            </Panel.Section>
          )}
          {filters.graphType === 'bar' && <Panel.Section>bar</Panel.Section>}
        </Panel>
      </Stack>
    </Page>
  );
}

export default Audience;
