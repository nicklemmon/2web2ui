import React, { forwardRef } from 'react';
import { TextField as OGTextField } from '@sparkpost/matchbox';
import { TextField as HibanaTextField } from '@sparkpost/matchbox-hibana';
import { Box } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { omitSystemProps } from 'src/helpers/hibana';

HibanaTextField.displayName = 'HibanaTextField';

const TextField = forwardRef((props, ref) => {
  const [state] = useHibana();
  const { isHibanaEnabled } = state;

  if (isHibanaEnabled) {
    const { maxWidth, ...rest } = props;

    return (
      <Box maxWidth={maxWidth ? maxWidth : '1200'}>
        <HibanaTextField ref={ref} {...rest} />
      </Box>
    );
  }

  return <OGTextField ref={ref} {...omitSystemProps(props)} />;
});

TextField.displayName = 'TextField';

export default TextField;
