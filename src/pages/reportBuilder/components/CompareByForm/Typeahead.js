import React, { useCallback, useState, useMemo } from 'react';
import TypeSelect from 'src/components/typeahead/TypeSelect';
import { METRICS_API_LIMIT } from 'src/constants';
import sortMatch from 'src/helpers/sortMatch';
import { useDebouncedCallback } from 'use-debounce';

function Typeahead({ id, onChange, lookaheadRequest, results = [], ...rest }) {
  const [omitResults, setOmitResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
        match: pattern,
        limit: METRICS_API_LIMIT,
      };
      lookaheadRequest(options).then(() => {
        setLoading(false);
      });
    },
    [setLoading, setOmitResults, lookaheadRequest, setInputValue],
  );

  const [onInputChange] = useDebouncedCallback(updateLookahead, 300);

  const filteredResults = useMemo(() => {
    return sortMatch(results, inputValue, a => a.value);
  }, [inputValue, results]);

  return (
    <TypeSelect
      id={id}
      onChange={onChange}
      onInputChange={onInputChange}
      results={omitResults ? [] : filteredResults}
      itemToString={item => {
        return item ? item.value : '';
      }}
      loading={loading}
      suffix={null}
      {...rest}
    />
  );
}

export default Typeahead;
