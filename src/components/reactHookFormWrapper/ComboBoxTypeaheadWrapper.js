import React, { useState } from 'react';
import { ComboBoxTypeahead } from 'src/components/typeahead/ComboBoxTypeahead';

export default function CheckboxWrapper(props) {
  const { name, setValue, value, ...rest } = props;
  const [componentValue, setComponentValue] = useState(value);
  const handleChange = e => {
    setComponentValue(e);
    setValue(name, componentValue);
  };

  return <ComboBoxTypeahead {...rest} name={name} onChange={handleChange} value={componentValue} />;
}
