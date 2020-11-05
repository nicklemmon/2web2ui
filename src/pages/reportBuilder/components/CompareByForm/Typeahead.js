import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { METRICS_API_LIMIT } from 'src/constants';
import sortMatch from 'src/helpers/sortMatch';
import { useDebouncedCallback } from 'use-debounce';

import Downshift from 'downshift';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { KeyboardArrowDown, KeyboardArrowUp } from '@sparkpost/matchbox-icons';
import { ActionList, Box, TextField } from 'src/components/matchbox';
import { LoadingSVG } from 'src/components';

const Loading = () => <LoadingSVG size="XSmall" />;

const PopoverActionList = styled(ActionList)`
  background: ${props => props.theme.colors.white};
  border: 1px solid ${props => props.theme.colors.gray['400']};
  box-shadow: ${props => props.theme.shadows['200']};
  left: 0;
  margin-top: 3px;
  max-height: 20rem;
  opacity: ${props => (props.open ? 1 : 0)};
  overflow-y: scroll;
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  visibility: ${props => (props.open ? 'visible' : 'hidden')};
  position: absolute;
  right: 0;
  top: 100%;
  transform: ${props => (props.open ? 'scale(1)' : 'scale(0.97)')};
  transition: 0.1s ease-out;
  z-index: ${props => props.theme.zIndices['overlay'] + 1};
`;

const TypeaheadWrapper = styled.div`
  margin: 0 0 1rem;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
`;

function TypeSelect({
  disabled,
  helpText,
  id,
  itemToString,
  label,
  maxHeight,
  maxWidth,
  onChange,
  placeholder,
  renderItem,
  results,
  selectedItem,
  onInputChange,
  loading,
  suffix,
  labelHidden,
}) {
  const [matches, setMatches] = useState([]);
  // Controlled input so that we can change the value after selecting dropdown.
  const [inputValue, setInputValue] = useState(selectedItem ? itemToString(selectedItem) : '');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [debounceInputChange] = useDebouncedCallback(setDebouncedValue, 300);

  useEffect(() => {
    onInputChange(debouncedValue);
  }, [onInputChange, debouncedValue]);

  useEffect(() => {
    setMatches(results);
  }, [results]);

  useEffect(() => {
    debounceInputChange(inputValue);
  }, [debounceInputChange, inputValue]);

  const handleStateChange = (changes, downshift) => {
    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      const selectedValue = itemToString(selectedItem);
      if (selectedValue !== inputValue) {
        setInputValue(selectedValue);
      }
    } else if (selectedItem === null) {
      setInputValue('');
    }
    // eslint-disable-next-line
  }, [selectedItem]);

  const typeaheadFn = ({
    getInputProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    isOpen,
    selectedItem,
  }) => {
    const textFieldConfig = {
      disabled,
      label,
      labelHidden,
      placeholder,
      helpText,
      onBlur: () => {
        setInputValue(itemToString(selectedItem));
      },
      onFocus: event => {
        event.target.select();
      },
    };

    const isMenuOpen = isOpen && Boolean(debouncedValue);
    const textFieldProps = getInputProps(textFieldConfig);
    textFieldProps['data-lpignore'] = true;

    const SuffixIcon = isOpen ? KeyboardArrowUp : KeyboardArrowDown;

    return (
      <div>
        <TypeaheadWrapper>
          <Box maxWidth={maxWidth} position="relative">
            {/* hack, can't apply getMenuProps to ActionList because ref prop is not supported */}
            <div {...getMenuProps()}>
              <PopoverActionList open={isMenuOpen} maxHeight={maxHeight}>
                {loading ? (
                  <Box ml="200">
                    <Loading />
                  </Box>
                ) : (
                  <>
                    {matches.map((item, index) => (
                      <ActionList.Action
                        {...getItemProps({
                          highlighted: highlightedIndex === index,
                          index,
                          item,
                          key: item.key,
                        })}
                      >
                        {renderItem ? (
                          renderItem(item)
                        ) : (
                          <TypeaheadItem label={itemToString(item)} />
                        )}
                      </ActionList.Action>
                    ))}
                  </>
                )}
              </PopoverActionList>
            </div>
            <TextField
              suffix={suffix !== undefined ? suffix : <SuffixIcon color="blue.700" size={25} />}
              {...textFieldProps}
            />
          </Box>
        </TypeaheadWrapper>
      </div>
    );
  };

  return (
    <Downshift
      id={id}
      inputValue={inputValue}
      itemToString={itemToString}
      onChange={onChange}
      onInputValueChange={setInputValue}
      onStateChange={handleStateChange}
      selectedItem={selectedItem}
    >
      {typeaheadFn}
    </Downshift>
  );
}

TypeSelect.propTypes = {
  disabled: PropTypes.bool,
  id: PropTypes.string.isRequired,
  itemToString: PropTypes.func,
  label: PropTypes.string,
  maxHeight: PropTypes.number,
  maxNumberOfResults: PropTypes.number,
  maxWidth: PropTypes.number,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  renderItem: PropTypes.func,
  results: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
    }),
  ),
};

TypeSelect.defaultProps = {
  disabled: false,
  itemToString: item => item,
  maxHeight: 300,
  maxNumberOfResults: 100,
  maxWidth: 1200,
  placeholder: 'Type to search',
  results: [],
};

// todo, prefer to use Matchbox either Columns or Inline, but they both use <div>'s and this is rendered inside <a>'s
// see, https://css-tricks.com/flexbox-truncated-text/
const ItemContainer = styled.span`
  display: flex;
  min-width: 0;
`;

const ItemText = styled.span`
  color: ${props => props.theme.colors.gray['1000']};
  flex-grow: 1;
  flex-shrink: 1;
  font-size: ${props => props.theme.fontSizes['200']};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ItemMetaText = styled.span`
  color: ${props => props.theme.colors.gray['700']};
  flex-shrink: 0;
  font-size: ${props => props.theme.fontSizes['100']};
  margin-left: ${props => props.theme.space['300']};
`;

function TypeaheadItem({ label, meta }) {
  return (
    <ItemContainer>
      <ItemText>{label}</ItemText>
      {meta && <ItemMetaText>{meta}</ItemMetaText>}
    </ItemContainer>
  );
}

TypeaheadItem.propTypes = {
  label: PropTypes.string.isRequired,
  meta: PropTypes.string,
};

TypeSelect.Item = TypeaheadItem;

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

  const filteredResults = useMemo(() => {
    return sortMatch(results, inputValue, a => a.value);
  }, [inputValue, results]);

  return (
    <TypeSelect
      id={id}
      onChange={onChange}
      onInputChange={updateLookahead}
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
