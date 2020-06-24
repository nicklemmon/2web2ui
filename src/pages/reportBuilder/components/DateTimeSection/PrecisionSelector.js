import React, { useEffect } from 'react';

import { getPrecisionOptions, roundBoundaries, getRollupPrecision } from 'src/helpers/metrics';
import { Select } from 'src/components/matchbox';
import moment from 'moment';

const PrecisionSelector = ({ from, to, changeTime, selectedPrecision, disabled }) => {
  const precisionOptions = getPrecisionOptions(moment(from), moment(to));

  useEffect(() => {
    const updatedPrecision = getRollupPrecision({ from, to, precision: selectedPrecision });
    if (updatedPrecision !== selectedPrecision) {
      changeTime({ precision: updatedPrecision });
    }
  }, [changeTime, from, precisionOptions, selectedPrecision, to]);

  const updatePrecision = ({ currentTarget: { value: precision } }) => {
    const { from: roundedFrom, to: roundedTo } = roundBoundaries({ from, to, precision });

    changeTime({ from: roundedFrom.toDate(), to: roundedTo.toDate(), precision });
  };

  return (
    <Select
      data-id="precision-selector"
      options={precisionOptions}
      onChange={updatePrecision}
      value={selectedPrecision}
      label="Precision"
      disabled={disabled}
    />
  );
};

export default PrecisionSelector;
