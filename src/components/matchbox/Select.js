import React, { forwardRef } from 'react';
import { Select as OGSelect } from '@sparkpost/matchbox';
import { Select as HibanaSelect } from '@sparkpost/matchbox-hibana';
import { Box } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

const Select = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (isHibanaEnabled) {
    const { maxWidth, ...rest } = props;

    return (
      <Box maxWidth={maxWidth ? maxWidth : '1200'}>
        <HibanaSelect ref={ref} {...rest} />
      </Box>
    );
  }

  return <OGSelect ref={ref} {...omitSystemProps(props)} />;
});

Select.displayName = 'Select';
HibanaSelect.displayName = 'HibanaSelect';

export default Select;
