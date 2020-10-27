import React from 'react';
import { Subaccount } from 'src/components';

const SubaccountTableData = ({ shared_with_subaccounts, subaccount_id, subaccount_name }) => {
  if (!shared_with_subaccounts && !subaccount_id) {
    return null;
  }

  return (
    <Subaccount
      all={shared_with_subaccounts}
      id={subaccount_id}
      name={subaccount_name}
      shrinkLength={12}
    />
  );
};

export default SubaccountTableData;
