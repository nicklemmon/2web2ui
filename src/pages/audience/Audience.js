import React from 'react';
import { data } from './data';
import { Page, Panel, Text, Stack } from '@sparkpost/matchbox-hibana';
import { useFilters, Filters, getFriendlyFilterLabel } from './Filters';
import Area from './Area';
import Collapsed from './Collapsed';
import BigNumbers from './BigNumbers';

function Audience() {
  const [filters, filterHandlers] = useFilters();

  return (
    <Page title="Audience">
      <Stack>
        <Filters values={filters} handlers={filterHandlers} />
        <Panel>
          <Panel.Section>
            <Text color="gray.700">{getFriendlyFilterLabel(filters)}</Text>
            <Area data={data} filters={filters} />
          </Panel.Section>
        </Panel>
        <BigNumbers data={data} filters={filters} />
        <Panel>
          <Panel.Section>
            <Text color="gray.700">Collapsed</Text>
            <Collapsed data={data} filters={filters} />
          </Panel.Section>
        </Panel>
      </Stack>
    </Page>
  );
}

export default Audience;
