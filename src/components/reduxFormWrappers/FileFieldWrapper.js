import _ from 'lodash';
import React from 'react';
import Dropzone from 'react-dropzone';
import { Error, Label, Box, Text, ScreenReaderOnly } from 'src/components/matchbox';
import useHibanaToggle from 'src/hooks/useHibanaToggle';
import { FileUpload } from '@sparkpost/matchbox-icons';
import { shrinkToFit } from 'src/helpers/string';
import styles from './FileFieldWrapper.module.scss';

const getSharedHandlers = input => {
  const handleCancel = () => {
    input.onBlur(); // run validation
  };

  // Always set value to dropped file even if rejected for validate functions to set error
  const handleDrop = (acceptedFiles, rejectedFiles) => {
    const files = [...acceptedFiles, ...rejectedFiles];
    input.onChange(files[0]);
    input.onBlur(); // run validation
  };

  return { handleDrop, handleCancel };
};

// TODO: Integrate in Matchbox if Dropzone isn't too big of a dependency
// TODO: Need a clear button
export function OGFileFieldWrapper({
  disabled,
  fileType,
  fileTypes = [],
  helpText,
  input,
  label,
  meta,
  required,
  style = {},
  labelHidden,
  placeholder = 'Drag a file here, or click to browse',
}) {
  const filename = _.get(input, 'value.name');
  let acceptedTypes = fileType ? `.${fileType}` : '';
  if (fileTypes.length) {
    acceptedTypes = fileTypes;
  }

  const { handleCancel, handleDrop } = getSharedHandlers(input);

  return (
    <fieldset className={styles.Field}>
      <Label id={input.id}>
        {!labelHidden && label}
        {!labelHidden && required && ' *'}
        {meta.touched && meta.error ? (
          <span>
            {' '}
            <Error error={meta.error} wrapper="span" />
          </span>
        ) : null}
      </Label>
      <div className={styles.InputWrapper}>
        <Dropzone
          accept={acceptedTypes}
          activeClassName={styles.DropzoneActive}
          className={styles.Dropzone}
          style={style}
          disabledClassName={styles.DropzoneDisabled}
          disabled={disabled}
          id={input.id}
          multiple={false}
          name={input.name}
          onDrop={handleDrop}
          onFileDialogCancel={handleCancel}
        >
          {filename && !meta.error ? (
            <span>{shrinkToFit(filename, 50)}</span>
          ) : (
            <span className={styles.Placeholder}>
              <FileUpload />
              <span>{placeholder}</span>
            </span>
          )}
        </Dropzone>
      </div>
      {helpText ? <div className={styles.Help}>{helpText}</div> : null}
    </fieldset>
  );
}

export function HibanaFileFieldWrapper({
  disabled,
  fileType,
  fileTypes = [],
  helpText,
  input,
  label,
  meta,
  required,
  style = {},
  labelHidden,
  placeholder,
}) {
  const filename = _.get(input, 'value.name');
  let acceptedTypes = fileType ? `.${fileType}` : '';
  if (fileTypes.length) {
    acceptedTypes = fileTypes;
  }

  const { handleCancel, handleDrop } = getSharedHandlers(input);

  const getLabel = () => {
    let l = label;

    if (required) {
      l = (
        <span>
          {l}
          <span aria-hidden="true"> *</span>
        </span>
      );
    }

    if (meta.touched && meta.error) {
      l = (
        <span>
          {l} <Error error={meta.error} wrapper="span" />
        </span>
      );
    }

    if (labelHidden) {
      l = <ScreenReaderOnly>{l}</ScreenReaderOnly>;
    }
    return l;
  };

  return (
    <Box>
      <Label id={input.id} label={getLabel()}></Label>
      <Box display="flex" justifyContent="space-between">
        <Dropzone
          accept={acceptedTypes}
          activeClassName={styles.DropzoneActive}
          className={styles.Dropzone}
          style={style}
          disabledClassName={styles.DropzoneDisabled}
          disabled={disabled}
          id={input.id}
          multiple={false}
          name={input.name}
          onDrop={handleDrop}
          onFileDialogCancel={handleCancel}
        >
          <Box py="500">
            {filename && !meta.error ? (
              <Text>{shrinkToFit(filename, 50)}</Text>
            ) : (
              <Box as="span" display="flex" justifyContent="center">
                {placeholder || (
                  <Text>
                    <Text as="span" fontWeight="medium" children="Drag and drop" />
                    <Text as="span" children=" a file, or " />
                    <Text
                      as="a"
                      role="presentation"
                      fontWeight="medium"
                      color="blue.700"
                      children="select a file"
                    />
                    <Text as="span" children=" to upload" />
                  </Text>
                )}
              </Box>
            )}
          </Box>
        </Dropzone>
      </Box>
      {helpText && (
        <Text pt="200" lineHeight="100" fontSize="200" color="gray.700">
          {helpText}
        </Text>
      )}
    </Box>
  );
}

export default function FileFieldWrapper(props) {
  return useHibanaToggle(OGFileFieldWrapper, HibanaFileFieldWrapper)(props);
}
