import React, { useCallback, useState, useMemo } from 'react';
import { ComboBoxTypeahead } from 'src/components/typeahead/AsyncComboBoxTypeahead';
import { METRICS_API_LIMIT } from 'src/constants';
import sortMatch from 'src/helpers/sortMatch';

function Typeahead(props) {
  const { dispatch, index, lookaheadRequest, reportOptions, value, results = [], ...rest } = props;

  const [omitResults, setOmitResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const onFilterChange = useCallback(
    newValue => {
      dispatch({ type: 'ADD_FILTER', index, value: newValue });
    },
    [index, dispatch],
  );

  const updateLookahead = useCallback(
    pattern => {
      setInputValue(pattern);
      if (!lookaheadRequest) return;

      if (!pattern || pattern.length <= 2) {
        setLoading(false);
        setOmitResults(true);
        return;
      }

      setOmitResults(false);
      setLoading(true);
      const options = {
        ...reportOptions,
        match: pattern,
        limit: METRICS_API_LIMIT,
      };
      lookaheadRequest(options).then(() => {
        setLoading(false);
      });
    },
    [setLoading, setOmitResults, lookaheadRequest, reportOptions, setInputValue],
  );

  const filteredResults = useMemo(() => {
    return sortMatch(results, inputValue, a => a.value);
  }, [inputValue, results]);

  return (
    <ComboBoxTypeahead
      onChange={onFilterChange}
      onInputChange={updateLookahead}
      itemToString={item => (item ? item.value : '')}
      value={value}
      results={omitResults ? [] : filteredResults}
      loading={loading}
      {...rest}
    />
  );
}

export default Typeahead;
