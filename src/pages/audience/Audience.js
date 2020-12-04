import React from 'react';
import { data } from './data';
import { Page, Panel, Text, Stack } from '@sparkpost/matchbox-hibana';
import { useFilters, Filters, getFriendlyFilterLabel } from './Filters';
import Area from './Area';
import Collapsed from './Collapsed';
import BigNumbers from './BigNumbers';
import { useSparkPostQuery } from 'src/hooks';
import { getAudience } from 'src/helpers/api';

function Audience() {
  const [filters, filterHandlers] = useFilters();
  const { data: audience } = useSparkPostQuery(getAudience);
  

  if ( audience === undefined) {
    return (
      <Page title="Audience">
      <Stack>
        <Filters values={filters} handlers={filterHandlers} />
        <Panel>
          <Panel.Section>
            <Text color="gray.700">{getFriendlyFilterLabel(filters)}</Text>
          </Panel.Section>
        </Panel>
        <Panel>
          <Panel.Section>
            <Text color="gray.700">Collapsed</Text>
          </Panel.Section>
        </Panel>
      </Stack>
    </Page>
    )
  }

  audience.reverse();

  return (
    <Page title="Audience">
      <Stack>
        <Filters values={filters} handlers={filterHandlers} />
        <Panel>
          <Panel.Section>
            <Text color="gray.700">{getFriendlyFilterLabel(filters)}</Text>
            <Area data={audience} filters={filters} />
          </Panel.Section>
        </Panel>
        <BigNumbers data={audience} filters={filters} />
        <Panel>
          <Panel.Section>
            <Text color="gray.700">Segment Breakdown</Text>
            <Collapsed data={audience} filters={filters} />
          </Panel.Section>
        </Panel>
      </Stack>
    </Page>
  );
}

export default Audience;
