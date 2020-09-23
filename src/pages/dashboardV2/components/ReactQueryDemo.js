/* eslint-disable */
import React from 'react';
import _ from 'lodash';
import { useSparkPostQuery } from 'src/hooks';
// import { useSendingDomains } from 'src/hooks/api';
import { listSendingDomains, getSendingDomain } from 'src/helpers/api';

export default function ReactQueryDemo() {
  const { status, data } = useSparkPostQuery(listSendingDomains);
  // const { data } = useSparkPostQuery(() => getSendingDomain('josezamora.info'));

  console.log('data', data);

  if (status === 'loading') return 'Loading...';

  if (status === 'error') return 'Something went wrong, bro. :(';

  if (data.length === 0) return 'No results!';

  return (
    <div>
      {data.map((item, index) => {
        return <div key={`domain-${index}`}>{item.domain}</div>;
      })}
    </div>
  );
}
