import React from 'react';
import { Banner } from 'src/components/matchbox';

const CongratsBanner = ({
  onDismiss,
  title = 'Congratulations! You are not currently on a Blocklist',
  content = 'Nice work keeping your sending reputation squeaky clean!',
}) => {
  return (
    <div data-id="congrats-banner">
      <Banner title={title} status="success" onDismiss={onDismiss} marginBottom="500">
        {content}
      </Banner>
    </div>
  );
};

export default CongratsBanner;
