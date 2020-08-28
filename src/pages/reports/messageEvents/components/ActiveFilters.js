import React from 'react';
import { connect } from 'react-redux';
import {
  getMessageEvents,
  removeFilter,
  updateMessageEventsSearchOptions,
} from 'src/actions/messageEvents';
import { removeEmptyFilters, getFiltersAsArray } from '../helpers/transformData.js';
import { snakeToFriendly } from 'src/helpers/string';
import { ALL_EVENTS_FILTERS } from 'src/constants';
import { Panel, Tag } from 'src/components/matchbox';
import OGStyles from './ActiveFilters.module.scss';
import hibanaStyles from './ActiveFiltersHibana.module.scss';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import _ from 'lodash';

const filterTypes = [...getFiltersAsArray(ALL_EVENTS_FILTERS)];

export function ActiveFilters(props) {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  const renderTags = () => {
    const { search } = props;
    const nonEmptyFilters = removeEmptyFilters(search);
    const nonEmptyFilterTypes = filterTypes.filter(filterType => nonEmptyFilters[filterType.value]);
    const activeFilters = _.flatMap(nonEmptyFilterTypes, ({ value, label }, typeIndex) =>
      nonEmptyFilters[value].map((item, valueIndex) => (
        <Tag
          onRemove={() => handleRemove({ key: value, item })}
          key={`${typeIndex}-${valueIndex}`}
          className={styles.TagWrapper}
        >
          {label}: {value === 'events' ? snakeToFriendly(item) : item}
        </Tag>
      )),
    );
    return activeFilters;
  };

  const handleRemove = filter => {
    props.removeFilter(filter);
  };

  const handleRemoveAll = () => {
    const { dateOptions, ...filters } = props.search;
    const clearedFilters = _.mapValues(filters, () => []);
    props.updateMessageEventsSearchOptions({ dateOptions, ...clearedFilters });
  };

  const isEmpty = () => {
    const { dateOptions, ...rest } = props.search;
    // eslint-disable-next-line lodash/matches-prop-shorthand
    return _.every(rest, arr => arr.length === 0);
  };

  if (isEmpty()) {
    return null;
  }

  return (
    <Panel.LEGACY.Section
      actions={[{ content: 'Clear All Filters', onClick: handleRemoveAll, color: 'blue' }]}
    >
      <small>Filters: </small>
      {renderTags()}
    </Panel.LEGACY.Section>
  );
}

const mapStateToProps = state => ({
  search: state.messageEvents.search,
});

export default connect(mapStateToProps, {
  removeFilter,
  getMessageEvents,
  updateMessageEventsSearchOptions,
})(ActiveFilters);
