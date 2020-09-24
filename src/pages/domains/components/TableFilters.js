import React, { useState } from 'react';
import { Search } from '@sparkpost/matchbox-icons';
import {
  Box,
  Button,
  Checkbox,
  Popover,
  TextField,
  ScreenReaderOnly,
  Select,
} from 'src/components/matchbox';
import { useUniqueId } from 'src/hooks';
import Divider from 'src/components/divider';
import {
  StyledFilterFields,
  StyledLabelSpacer,
  StatusPopoverContent,
  StyledGridCell,
} from './styles';

export function reducer(state, action) {
  switch (action.type) {
    case 'DOMAIN_FILTER_CHANGE': {
      return {
        ...state,
        domainNameFilter: action.value,
      };
    }

    case 'TOGGLE': {
      const isChecked = state.checkboxes.find(filter => filter.name === action.name).isChecked;

      return {
        ...state,
        // Return the relevant checked box and update its checked state,
        // otherwise, return any other checkbox.
        checkboxes: state.checkboxes.map(filter => {
          if (filter.name === action.name) {
            return {
              ...filter,
              isChecked: !isChecked,
            };
          }

          return filter;
        }),
      };
    }

    default:
      throw new Error(`${action.type} is not supported.`);
  }
}

function DomainField({ onChange, value, disabled }) {
  const uniqueId = useUniqueId('domains-name-filter');

  return (
    <TextField
      id={uniqueId}
      label="Filter Domains"
      prefix={<Search />}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
}

function SortSelect({ options, onChange, disabled }) {
  const uniqueId = useUniqueId('domains-sort-select');

  return (
    <Select
      id={uniqueId}
      label="Sort By"
      options={options}
      onChange={onChange}
      disabled={disabled}
    />
  );
}

function StatusPopover({ checkboxes, onCheckboxChange, disabled }) {
  const uniqueId = useUniqueId('domains-status-filter');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const checkedCheckboxes = checkboxes.filter(checkbox => checkbox.isChecked);
  const hasCheckedCheckboxes = checkedCheckboxes?.length > 0;

  return (
    <StyledGridCell>
      <StyledLabelSpacer />

      <Popover
        left
        id={uniqueId}
        open={isPopoverOpen}
        onClose={() => setIsPopoverOpen(false)}
        trigger={
          <Button
            variant="secondary"
            aria-expanded={isPopoverOpen}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            disabled={disabled}
          >
            {/* This content is purely visual and is not exposed to screen readers, rather, "Domain Status" is always exposed for those users */}
            <StatusPopoverContent aria-hidden="true">
              {/* Render the checked filters that visually replace the button's content */}
              {hasCheckedCheckboxes ? (
                checkedCheckboxes.map((checkbox, index) => (
                  <span key={`${checkbox.name}-${index}`}>{checkbox.label}&nbsp;</span>
                ))
              ) : (
                <span>Domain Status</span>
              )}
            </StatusPopoverContent>

            <ScreenReaderOnly>Domain Status</ScreenReaderOnly>
          </Button>
        }
      >
        <Box padding="300">
          <Checkbox.Group label="Status Filters" labelHidden>
            {checkboxes.map((filter, index) => (
              <Checkbox
                key={`${filter.name}-${index}`}
                label={filter.label}
                id={filter.name}
                name={filter.name}
                onChange={onCheckboxChange}
                checked={filter.isChecked}
              />
            ))}
          </Checkbox.Group>
        </Box>

        <Divider />

        <Box padding="300" display="flex" justifyContent="flex-end">
          <Button variant="primary" size="small" onClick={() => setIsPopoverOpen(false)}>
            Apply
          </Button>
        </Box>
      </Popover>
    </StyledGridCell>
  );
}

function TableFilters({ children }) {
  return <StyledFilterFields>{children}</StyledFilterFields>;
}

DomainField.dispayName = 'TableFilters.DomainField';
SortSelect.displayName = 'TableFilters.SortSelect';
StatusPopover.displayName = 'TableFilters.StatusPopover';
TableFilters.DomainField = DomainField;
TableFilters.SortSelect = SortSelect;
TableFilters.StatusPopover = StatusPopover;

export default TableFilters;
