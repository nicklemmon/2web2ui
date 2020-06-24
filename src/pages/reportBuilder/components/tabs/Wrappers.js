import { Box, Table } from 'src/components/matchbox';
import React from 'react';
import { Empty, Loading } from 'src/components';

export const FilterBoxWrapper = props => (
  <>
    <Box padding="500">{props}</Box>
    <Box borderTop="400" />
  </>
);

export const TableWrapper = props => <Table>{props.children}</Table>;

export const TableCollectionBody = ({ heading, filterBox, collection, pagination }) => (
  <div>
    {heading}
    {filterBox}
    {collection}
    <Box borderTop="400" />
    <Box marginRight="400">{pagination}</Box>
  </div>
);

export const EmptyWrapper = ({ message }) => <Empty message={message} hasPanel={false} />;

export const LoadingWrapper = () => (
  <Box position="relative">
    <Loading />
  </Box>
);
