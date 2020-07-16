import React, { Component } from 'react';
import classnames from 'classnames/bind';
import Downshift from 'downshift';
import debounce from 'lodash/debounce';
import { Search } from '@sparkpost/matchbox-icons';
import { ActionList, Box, Button, Text, TextField } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import sortMatch from 'src/helpers/sortMatch';
import styles from './Typeahead.module.scss';

const cx = classnames.bind(styles);

export class Typeahead extends Component {
  static defaultProps = {
    name: 'subaccount',
    results: [],
  };

  state = {
    inputValue: '',
    matches: [],
  };

  componentDidMount() {
    this.updateMatches(this.state.inputValue);
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.results.length && this.props.results.length) {
      this.updateMatches(this.state.inputValue);
    }
  }

  componentWillUnmount() {
    this.updateMatches.cancel();
  }

  // note, sorting large result lists can be expensive
  updateMatches = debounce(inputValue => {
    const { itemToString, maxNumberOfResults = 100, results = [] } = this.props;
    const matches = inputValue ? sortMatch(results, inputValue, itemToString) : results;

    this.setState({ inputValue, matches: matches.slice(0, maxNumberOfResults) });
  }, 300);

  handleStateChange = (changes, downshift) => {
    // Highlights first item in list by default
    if (!downshift.highlightedIndex) {
      downshift.setHighlightedIndex(0);
    }
  };

  typeaheadFn = ({
    clearSelection,
    getInputProps,
    getItemProps,
    highlightedIndex,
    isOpen,
    openMenu,
    selectedItem,
  }) => {
    const {
      disabled,
      error,
      errorInLabel,
      helpText,
      label,
      maxHeight = 300,
      name,
      placeholder = isOpen ? 'Type to search' : 'None',
      renderItem,
      maxWidth,
      canChange,
    } = this.props;
    const { matches } = this.state;
    const items = matches.map((item, index) =>
      getItemProps({
        content: renderItem ? renderItem(item) : <TypeaheadItem label={item} />,
        highlighted: highlightedIndex === index,
        index,
        item,
      }),
    );

    const listClasses = cx('List', {
      open: isOpen && (!selectedItem || canChange) && matches.length,
      hasHelp: !!helpText,
    });

    const textFieldConfig = canChange
      ? {
          disabled,
          id: name,
          label,
          name,
          placeholder,
          helpText,
          error: !isOpen && error ? error : null,
          errorInLabel,
        }
      : {
          connectRight: selectedItem && !disabled ? this.renderClearButton(clearSelection) : null,
          readOnly: !!selectedItem,
          disabled,
          id: name,
          label,
          name,
          placeholder,
          helpText,
          error: !isOpen && error ? error : null,
          errorInLabel,
        };

    const textFieldProps = getInputProps(textFieldConfig);

    textFieldProps['data-lpignore'] = true;

    return (
      <div className={cx('Typeahead')}>
        <Box maxWidth={maxWidth ? maxWidth : '1200'} position="relative">
          <ActionList className={listClasses} actions={items} maxHeight={maxHeight} />

          <TextField {...textFieldProps} onFocus={openMenu} prefix={<Search />} />
        </Box>
      </div>
    );
  };

  renderClearButton(clearSelection) {
    return (
      <Button variant="connected" onClick={clearSelection}>
        Clear
      </Button>
    );
  }

  render() {
    const { itemToString, onChange, selectedItem } = this.props;

    return (
      <Downshift
        itemToString={itemToString}
        onChange={onChange}
        onInputValueChange={this.updateMatches}
        onStateChange={this.handleStateChange}
        selectedItem={selectedItem}
      >
        {this.typeaheadFn}
      </Downshift>
    );
  }
}

function OGTypeaheadItem({ label, id }) {
  return (
    <div className={styles.Item}>
      {label}

      {id && <span className={styles.id}>{id}</span>}
    </div>
  );
}

function HibanaTypeaheadItem({ label, id }) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Text as="span" color="gray.1000" fontSize="200">
        {label}
      </Text>

      {id && (
        <Text color="gray.700" fontSize="100" as="span">
          {id}
        </Text>
      )}
    </Box>
  );
}

export function TypeaheadItem(props) {
  return useHibanaToggle(OGTypeaheadItem, HibanaTypeaheadItem)(props);
}
