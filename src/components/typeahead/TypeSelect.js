import React, { useEffect, useState } from 'react';
import Downshift from 'downshift';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
import { tokens } from '@sparkpost/design-tokens-hibana';
import { KeyboardArrowDown, KeyboardArrowUp } from '@sparkpost/matchbox-icons';
import { ActionList, Box, TextField } from 'src/components/matchbox';
import sortMatch from 'src/helpers/sortMatch';
import { LoadingSVG } from 'src/components';

const Loading = () => <LoadingSVG size="XSmall" />;

const PopoverActionList = styled(ActionList)`
  background: ${tokens.color_white};
  border: 1px solid ${tokens.color_gray_400};
  box-shadow: ${tokens.boxShadow_200};
  left: 0;
  margin-top: 3px;
  max-height: 20rem;
  opacity: ${props => (props.open ? 1 : 0)};
  overflow-y: scroll;
  pointer-events: ${props => (props.open ? 'auto' : 'none')};
  position: absolute;
  right: 0;
  top: 100%;
  transform: ${props => (props.open ? 'scale(1)' : 'scale(0.97)')};
  transition: 0.1s ease-out;
  z-index: ${tokens.zIndex_overlay + 1};
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
  maxNumberOfResults,
  maxWidth,
  onChange,
  placeholder,
  renderItem,
  results,
  selectedItem,
  onInputChange,
  loading,
  suffix,
}) {
  const [matches, setMatches] = useState([]);
  // Controlled input so that we can change the value after selecting dropdown.
  const [inputValue, setInputValue] = useState(selectedItem ? itemToString(selectedItem) : '');
  // note, sorting large result lists can be expensive
  const [updateMatches] = useDebouncedCallback(value => {
    const matches = value ? sortMatch(results, value, itemToString) : results;
    const nextMatches = matches.slice(0, maxNumberOfResults);
    setMatches(nextMatches);
  }, 300);

  useEffect(() => {
    if (onInputChange) {
      //External trigger for filtering
      return onInputChange(inputValue);
    }
    return updateMatches(inputValue);
  }, [updateMatches, onInputChange, inputValue]);

  useEffect(() => {
    setMatches(results);
  }, [results]);

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
    openMenu,
  }) => {
    const textFieldConfig = {
      disabled,
      label,
      placeholder,
      helpText,
      onBlur: () => {
        setInputValue(itemToString(selectedItem));
      },
      onFocus: event => {
        event.target.select();
        setMatches(results);
        openMenu();
      },
    };

    const textFieldProps = getInputProps(textFieldConfig);
    textFieldProps['data-lpignore'] = true;

    const SuffixIcon = isOpen ? KeyboardArrowUp : KeyboardArrowDown;

    return (
      <div>
        <TypeaheadWrapper>
          <Box maxWidth={maxWidth} position="relative">
            {/* hack, can't apply getMenuProps to ActionList because ref prop is not supported */}
            <div {...getMenuProps()}>
              <PopoverActionList open={isOpen} maxHeight={maxHeight}>
                {loading && (
                  <Box ml="200">
                    <Loading />
                  </Box>
                )}
                {matches.map((item, index) => (
                  <ActionList.Action
                    {...getItemProps({
                      highlighted: highlightedIndex === index,
                      index,
                      item,
                      key: item.key,
                    })}
                  >
                    {renderItem ? renderItem(item) : <TypeaheadItem label={itemToString(item)} />}
                  </ActionList.Action>
                ))}
              </PopoverActionList>
            </div>
            <TextField
              {...textFieldProps}
              suffix={suffix ? suffix : <SuffixIcon color={tokens.color_blue_700} size={25} />}
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
  color: ${tokens.color_grey_1000};
  flex-grow: 1;
  flex-shrink: 1;
  font-size: ${tokens.fontSize_200};
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const ItemMetaText = styled.span`
  color: ${tokens.color_grey_700};
  flex-shrink: 0;
  font-size: ${tokens.fontSize_100};
  margin-left: ${tokens.spacing_300};
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

export default TypeSelect;
