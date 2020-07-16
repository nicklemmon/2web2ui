import React from 'react';
import { Search } from '@sparkpost/matchbox-icons';
import { Label, Panel, TextField, ScreenReaderOnly } from 'src/components/matchbox';
import { getRandomExampleSearch } from './helpers/exampleSearch';
import styles from './FilterBox.module.scss';
import { useHibana } from 'src/context/HibanaContext';

function CollectionFilterBox(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  const {
    initialValue,
    placeholder,
    wrapper,
    onChange,
    onBlur = () => {},
    maxWidth,
    label,
  } = props;
  const placeholderText = placeholder || `Filter results e.g. ${getRandomExampleSearch(props)}`;

  const text = (
    <>
      {!isHibanaEnabled && (
        <Label id="collection-filter-box" className={styles.FilterBoxLabel}>
          <ScreenReaderOnly>Filter By</ScreenReaderOnly>
        </Label>
      )}

      <TextField
        labelHidden={!Boolean(label)}
        label={isHibanaEnabled ? label || 'Filter By' : undefined}
        id="collection-filter-box"
        name="collection-filter-box"
        prefix={<Search />}
        placeholder={placeholderText}
        onChange={e => onChange(e.target.value)}
        onBlur={e => onBlur(e.target.value)}
        defaultValue={initialValue}
        maxWidth={maxWidth}
      />
    </>
  );

  return wrapper ? (
    wrapper(text)
  ) : (
    <Panel mb="0" className={styles.Panel} sectioned>
      {text}
    </Panel>
  );
}

export default CollectionFilterBox;
