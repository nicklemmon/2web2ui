import React from 'react';
import { Banner } from 'src/components/matchbox';
import { LINKS } from 'src/constants';
import { ExternalLink } from 'src/components/links';

const UnverifiedBanner = ({ unverifiedDomains, cname }) => {
  const count = unverifiedDomains.length;

  if (!count) {
    return null;
  }

  const title =
    count > 1
      ? `You have ${count} unverified tracking domains`
      : 'You have an unverified tracking domain';

  return (
    <Banner status="warning" title={title} marginBottom="500">
      <p>
        To verify a tracking domain, edit its DNS settings to <strong>add a CNAME record</strong>{' '}
        with the value of <strong>{cname}</strong>.
      </p>

      <Banner.Actions>
        <ExternalLink to={LINKS.DOMAIN_VERIFICATION}>Learn more</ExternalLink>
      </Banner.Actions>
    </Banner>
  );
};

export default UnverifiedBanner;
