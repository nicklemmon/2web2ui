import React from 'react';
import _ from 'lodash';
import { Box, Inline, Stack, Tag, Text } from 'src/components/matchbox';
import { Comparison, Emphasized } from 'src/components/text';
import { getIterableFormattedGroupings, getGroupingFields } from '../helpers';
import styles from './ReportOptions.module.scss';

export function ActiveFilters({ filters, handleFilterRemove }) {
  const filtersWithIndex = filters.map((value, index) => ({ ...value, index }));
  const groupedFilters = _.groupBy(filtersWithIndex, 'type');

  return (
    <Stack>
      {Object.keys(groupedFilters).map(key => (
        <Inline key={`filter_group_${key}`}>
          <div>{key}</div>
          <div>
            <strong className={styles.Conditional}>equals</strong>
            {groupedFilters[key].map(({ value, index }) => (
              <Tag
                className={styles.TagWrapper}
                key={`tag_${index}`}
                onRemove={handleFilterRemove ? () => handleFilterRemove(index) : undefined}
              >
                {value}
              </Tag>
            ))}
          </div>
        </Inline>
      ))}
    </Stack>
  );
}

export function ActiveFiltersV2({ filters, handleFilterRemove }) {
  const groupings = getGroupingFields(getIterableFormattedGroupings(filters));

  // TODO: Once `Inline` supports the `data-id` prop, extra <div> elements with `data-id` will no longer needed.
  // Matchbox issue: https://github.com/SparkPost/matchbox/issues/661
  return (
    <div data-id="active-filter-tags">
      <Inline space="200">
        {groupings.map((grouping, groupingIndex) => {
          return (
            <div data-id="active-filter-group">
              <Inline
                key={`grouping-${groupingIndex}`}
                as="span"
                display="inline-flex"
                paddingY="100"
                paddingX="200"
                backgroundColor="gray.100"
                space="0"
              >
                {grouping.filters.map((filter, filterIndex) => {
                  return (
                    <Box
                      key={`filter-${groupingIndex}-${filterIndex}`}
                      paddingY="100"
                      paddingX="200"
                      backgroundColor="gray.100"
                      data-id="active-filter"
                    >
                      <Inline as="span" space="200">
                        <Text fontSize="200" as="span">
                          {filter.label}
                        </Text>

                        <Text fontWeight="500" as="span" fontSize="200">
                          <Emphasized>{getCompareByText(filter.compareBy)}</Emphasized>
                        </Text>

                        {filter.values.map((rawValue, valueIndex) => {
                          const value = typeof rawValue === 'object' ? rawValue.value : rawValue;
                          const onRemoveFn = handleFilterRemove
                            ? () => handleFilterRemove({ groupingIndex, filterIndex, valueIndex })
                            : undefined;

                          return (
                            <Tag
                              key={`tag-${groupingIndex}-${filterIndex}-${valueIndex}`}
                              onRemove={onRemoveFn}
                            >
                              {value}
                            </Tag>
                          );
                        })}

                        {filter.hasComparisonBetweenFilters ? (
                          <Box marginX="200">
                            <Comparison>{grouping.type}</Comparison>
                          </Box>
                        ) : null}
                      </Inline>
                    </Box>
                  );
                })}

                {grouping.hasAndBetweenGroups ? (
                  <Box marginX="200">
                    <Comparison>And</Comparison>
                  </Box>
                ) : null}
              </Inline>
            </div>
          );
        })}
      </Inline>
    </div>
  );
}

function getCompareByText(compareByVal) {
  switch (compareByVal) {
    case 'eq':
      return 'is equal to';
    case 'notEq':
      return 'is not equal to';
    case 'like':
      return 'contains';
    case 'notLike':
      return 'does not contain';
    default:
      throw new Error(`${compareByVal} is not a valid comparison value.`);
  }
}
