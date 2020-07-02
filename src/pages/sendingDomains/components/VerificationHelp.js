import React from 'react';
import { SubduedText } from 'src/components/text';
import { ExternalLink } from 'src/components/links';

const VerificationHelp = ({ status }) => {
  if (status === 'verified') {
    return null;
  }

  return (
    <SubduedText mt="300">
      <span>Need help verifying your domain? </span>

      <ExternalLink to="https://www.sparkpost.com/docs/getting-started/getting-started-sparkpost/#sending-domain-step-2-verifying-domain-ownership">
        Follow this guide.
      </ExternalLink>
    </SubduedText>
  );
};

export default VerificationHelp;
