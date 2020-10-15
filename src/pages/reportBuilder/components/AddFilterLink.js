import React, { useState } from 'react';
import useRouter from 'src/hooks/useRouter';
import qs from 'qs';
import { ButtonLink } from 'src/components/links';
import { ScreenReaderOnly } from 'src/components/matchbox';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { stringifyTypeaheadfilter } from 'src/helpers/string';

export const AddFilterLink = ({ newFilter }) => {
  const [isNewTabKeyPressed, setNewTabKeyPressed] = useState(false);
  const { actions, selectors } = useReportBuilderContext();
  const { addFilters } = actions;
  const { selectSummaryChartSearchOptions: currentSearchOptions } = selectors;
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
      addFilters(newFilter);
      // eslint-disable-next-line no-unused-expressions
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
    <ButtonLink onMouseUp={handleMouseUp} onClick={handleClick} to={fullLink}>
      {newFilter.value}

      <ScreenReaderOnly>(Applies a filter to the report)</ScreenReaderOnly>
    </ButtonLink>
  );
};

export default AddFilterLink;
