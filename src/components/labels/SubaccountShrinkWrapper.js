import React from 'react';

import { Subaccount } from 'src/components';
import { useResizeObserver } from 'src/components/matchbox';

function SubaccountShrinkWrapper({
  sharedWithSubaccounts,
  subaccountName,
  subaccountId,
  children,
}) {
  const [ref, entry] = useResizeObserver();
  const width = entry?.contentRect?.width || 500;
  let trim = Math.floor(width / 10) - 6;

  if (trim <= 7) {
    trim = 8;
  }

  return (
    <div ref={ref}>
      {children}
      <Subaccount
        all={sharedWithSubaccounts}
        id={subaccountId}
        name={subaccountName}
        shrinkLength={trim}
        title={subaccountName}
      />
    </div>
  );
}

export default SubaccountShrinkWrapper;
