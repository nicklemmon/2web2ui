import React from 'react';
import PropTypes from 'prop-types';
import { Button as OGButton } from '@sparkpost/matchbox';
import { Button as HibanaButton } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

function Button({ variant, ...props }) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return (
      <OGButton
        disabled={props.loading}
        {...getVariantProps({ variant, isHibanaEnabled })}
        {...omitSystemProps(props, ['size', 'color', 'variant'])}
      />
    );
  }

  return <HibanaButton {...getVariantProps({ variant, isHibanaEnabled })} {...props} />;
}

function Group(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) {
    return <OGButton.Group {...omitSystemProps(props)} />;
  }

  return <HibanaButton.Group {...props} />;
}

function Icon(props) {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (!isHibanaEnabled) throw new Error('Button.Icon can only be used with Hibana enabled.');

  return <HibanaButton.Icon {...props} />;
}

// TODO:
// 1. Remove `isHibanaEnabled` argument when the old theme is removed from the app
// 2. Remove separate `switch` statement when the old theme is removed
function getVariantProps({ variant, isHibanaEnabled }) {
  if (isHibanaEnabled) {
    switch (variant) {
      case 'primary':
        return {
          color: 'blue',
          variant: 'filled',
        };
      case 'secondary':
        return {
          color: 'blue',
          variant: 'outline',
        };
      case 'tertiary':
        return {
          color: 'blue',
          variant: 'text',
        };
      case 'minimal':
        return {
          color: 'gray',
          flat: true,
        };
      case 'monochrome':
        return {
          color: 'gray',
        };
      case 'monochrome-secondary':
        return {
          color: 'gray',
          outlineBorder: true,
        };
      case 'destructive':
        return {
          color: 'red',
          variant: 'filled',
        };
      // use when connecting a button to a TextField
      case 'connected':
        return {
          color: 'blue',
          outline: true,
        };
      default:
        return {
          color: 'blue',
          flat: true,
        };
    }
  }

  switch (variant) {
    case 'primary':
      return {
        color: 'orange',
      };
    case 'destructive':
      return {
        destructive: true,
      };
    case 'minimal':
      return {
        flat: true,
      };
    case 'secondary':
    case 'tertiary':
    case 'monochrome':
    case 'monochrome-secondary':
    case 'connected':
    default:
      return undefined;
  }
}

Button.displayName = 'Button';
Group.displayName = 'Button.Group';
Icon.displayName = Icon;
Button.Group = Group;
Button.Icon = Icon;

Button.propTypes = {
  variant: PropTypes.string,
};

export default Button;
