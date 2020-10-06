import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, ScreenReaderOnly } from 'src/components/matchbox';

const RadioButtonGroup = ({ label, children }) => {
  return (
    <Box border="0" padding="0" as="fieldset">
      <ScreenReaderOnly as="legend">{label}</ScreenReaderOnly>

      <Button.Group>{children}</Button.Group>
    </Box>
  );
};

const RadioButton = forwardRef((props, ref) => {
  const { id, name, value, children, checked, onChange, className } = props;

  function handleClick(e) {
    e.preventDefault();

    onChange(value);
  }

  return (
    <Button
      variant={checked ? 'primary' : 'connected'}
      onClick={handleClick}
      className={className}
      role="presentation"
    >
      {/* Content within the button, only renders visually but not for screen reader users */}
      <span aria-hidden="true">{children}</span>

      {/* Radio button available to screen reader users, but not sighted users - and removed from the tab order via `tabIndex="-1"` */}
      <ScreenReaderOnly as="span">
        <label htmlFor={id}>{children}</label>

        <input
          type="radio"
          ref={ref}
          value={value}
          name={name}
          id={id}
          readOnly
          checked={checked}
          tabIndex="-1"
        />
      </ScreenReaderOnly>
    </Button>
  );
});

RadioButton.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.element]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

RadioButton.defaultProps = {
  checked: false,
};

RadioButtonGroup.displayName = 'RadioButtonGroup';
RadioButton.displayName = 'RadioButtonGroup.Button';
RadioButtonGroup.Button = RadioButton;

export default RadioButtonGroup;
