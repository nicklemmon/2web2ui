import React from 'react';
import { Panel, Box, Inline, ListBox } from '@sparkpost/matchbox-hibana';

export function getFriendlyFilterLabel(filters) {
  switch (filters.precision) {
    case '1':
      return 'Daily Active Users';
    case '7':
      return 'Weekly Active Users';
    case '30':
      return 'Monthly Active Users';
    default:
      return '';
  }
}

export function useFilters() {
  const [precision, setPrecision] = React.useState('7');
  const [dimension, setDimension] = React.useState('engagement');
  const [graphType, setGraphType] = React.useState('stacked_area');

  function handlePrecision(e) {
    setPrecision(e?.currentTarget?.value);
  }

  function handleDimension(e) {
    setDimension(e?.currentTarget?.value);
  }

  function handleGraphType(e) {
    setGraphType(e?.currentTarget?.value);
  }

  return [
    {
      precision,
      dimension,
      graphType,
    },
    {
      handleDimension,
      handlePrecision,
      handleGraphType,
    },
  ];
}

export function Filters(props) {
  return (
    <Panel>
      <Panel.Section>
        <Box display="flex" justifyContent="space-between">
          <Inline>
            <Box width="150px">
              <ListBox defaultValue="weeks">
                <ListBox.Option value="weeks">Last 14 days</ListBox.Option>
                <ListBox.Option value="month">Last 30 days</ListBox.Option>
                <ListBox.Option value="3_months">Last 90 days</ListBox.Option>
              </ListBox>
            </Box>
            <Box width="100px">
              <ListBox value={props.values.precision} onChange={props.handlers.handlePrecision}>
                <ListBox.Option value="1">DAU</ListBox.Option>
                <ListBox.Option value="7">WAU</ListBox.Option>
                <ListBox.Option value="30">MAU</ListBox.Option>
              </ListBox>
            </Box>
            <Box width="180px">
              <ListBox value={props.values.dimension} onChange={props.handlers.handleDimension}>
                <ListBox.Option value="engagement">By Engagement</ListBox.Option>
                <ListBox.Option value="open">By Opens</ListBox.Option>
                <ListBox.Option value="click">By Clicks</ListBox.Option>
              </ListBox>
            </Box>
          </Inline>

          <Box width="200px">
            <ListBox value={props.values.graphType} onChange={props.handlers.handleGraphType}>
              <ListBox.Option value="stacked_area">Stacked Area</ListBox.Option>
              <ListBox.Option value="bar">Bar</ListBox.Option>
            </ListBox>
          </Box>
        </Box>
      </Panel.Section>
    </Panel>
  );
}
