import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Add, Close } from '@sparkpost/matchbox-icons';
import { Button, ScreenReaderOnly, Select, Text } from 'src/components/matchbox';
import { Emphasized, Uppercase } from 'src/components/text';
import { useMultiEntry } from 'src/hooks';

const COMPARE_BY_OPTIONS = [
  {
    label: 'is equal to',
    value: 'eq',
  },
  {
    label: 'is not equal to',
    value: 'notEq',
  },
  {
    label: 'contains',
    value: 'like',
  },
  {
    label: 'does not contain',
    value: 'notLike',
  },
];

const StyledRemoveButton = styled(Button)`
  position: absolute;
  top: 0;
  right: 0;
`;

export function TypeSelect({ id, onChange, options, value }) {
  return (
    <Select
      placeholder="Select Resource"
      placeholderValue="Select Resource"
      id={id}
      label="Type"
      onChange={onChange}
      options={options}
      value={value ? value : 'Select Resource'}
    />
  );
}

export function CompareBySelect({ id, hasLikeOptions, onChange, value }) {
  const options = hasLikeOptions
    ? COMPARE_BY_OPTIONS
    : COMPARE_BY_OPTIONS.filter(option => option.value === 'eq' || option.value === 'notEq');

  return (
    <Select
      label={<ScreenReaderOnly>Compare By</ScreenReaderOnly>}
      id={id}
      onChange={onChange}
      options={options}
      value={value ? value : options[0].value}
    />
  );
}

export function ComparisonText({ children }) {
  return (
    <Text fontWeight="500">
      <Uppercase>
        <Emphasized>{children}</Emphasized>
      </Uppercase>
    </Text>
  );
}

export function MultiEntryController({
  id,
  initialValueList,
  render,
  setFilterValues,
  filterIndex,
  groupingIndex,
}) {
  // Using custom hook within the groupings .map callback wasn't making the linter very happy.
  // Using render props to get around the problem.
  const {
    value,
    valueList,
    handleKeyDown,
    handleChange,
    handleBlur,
    handleRemove,
  } = useMultiEntry({ valueList: initialValueList });

  useEffect(() => {
    setFilterValues({
      values: valueList,
      filterIndex,
      groupingIndex,
    });
  }, [setFilterValues, valueList, filterIndex, groupingIndex]);

  return render({
    id,
    value,
    valueList,
    handleKeyDown,
    handleChange,
    handleBlur,
    handleRemove,
  });
}

export function AddButton({ children, onClick }) {
  return (
    <Button onClick={onClick} size="small">
      {children}
      <Button.Icon as={Add} />
    </Button>
  );
}

export function RemoveButton({ onClick }) {
  return (
    <StyledRemoveButton padding="200" variant="minimal" onClick={onClick} size="small">
      <ScreenReaderOnly>Remove Filter</ScreenReaderOnly>
      <Button.Icon as={Close} />
    </StyledRemoveButton>
  );
}
