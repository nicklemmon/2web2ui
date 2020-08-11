import React, { useState } from 'react';
import { connect } from 'react-redux';
import useRouter from 'src/hooks/useRouter';
import qs from 'qs';

import { addFilters } from 'src/actions/reportOptions';
import { PageLink } from 'src/components/links';
import { stringifyTypeaheadfilter } from 'src/helpers/string';
import { selectSummaryChartSearchOptions } from 'src/selectors/reportSearchOptions';

export const AddFilterLink = ({
  //From parent
  newFilter,
  //From redux
  currentSearchOptions,
  addFilters,
}) => {
  const [isNewTabKeyPressed, setNewTabKeyPressed] = useState(false);
  const {
    location: { pathname },
  } = useRouter();

  /**
   * Needs to first check if cmd/ctrl key is pressed when mouse is released
   * Then it's saved for use in the onClick handler. We need both because
   * onClick does not have the correct values for metaKey and ctrlKey
   **/
  const handleMouseUp = e => {
    setNewTabKeyPressed(e.metaKey || e.ctrlKey);
  };

  const handleClick = e => {
    if (!isNewTabKeyPressed) {
      addFilters([newFilter]);
      e?.preventDefault();
    }
  };

  const currentFilters = currentSearchOptions.filters || [];
  const mergedFilters = [...currentFilters, stringifyTypeaheadfilter(newFilter)];
  const newSearchOptions = { ...currentSearchOptions, filters: mergedFilters };

  //Use same method to change route from here src/context/RouterContext.js
  const linkParams = qs.stringify(newSearchOptions, { arrayFormat: 'repeat' });
  const fullLink = `${pathname}?${linkParams}`;

  return (
    <PageLink onMouseUp={handleMouseUp} onClick={handleClick} to={fullLink}>
      {newFilter.value}
    </PageLink>
  );
};

const mapStateToProps = state => ({
  currentSearchOptions: selectSummaryChartSearchOptions(state),
});

export default connect(mapStateToProps, { addFilters })(AddFilterLink);
