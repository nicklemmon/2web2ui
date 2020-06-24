import React from 'react';
import { useHibana } from 'src/context/HibanaContext';
import { DatePicker as DatePickerComponent } from '@sparkpost/matchbox-hibana';

function DatePicker(props) {
  const [{ isHibanaEnabled }] = useHibana();
  if (!isHibanaEnabled) {
    throw new Error(
      'DatePicker component not available in original matchbox. Please remove or restrict to Hibana',
    );
  }
  return <DatePickerComponent {...props} />;
}

export default DatePicker;
