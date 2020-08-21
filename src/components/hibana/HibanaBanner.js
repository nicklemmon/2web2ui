import React from 'react';
import { withRouter } from 'react-router-dom';
import { Close } from '@sparkpost/matchbox-icons';
import { ScreenReaderOnly } from 'src/components/matchbox';
import { ButtonLink } from 'src/components/links';
import { Heading } from 'src/components/text';
import { useHibana } from 'src/context/HibanaContext';
import styles from './HibanaComponents.module.scss';

const PROFILE_PAGE_PATH = '/account/profile';

function HibanaBanner(props) {
  const [{ isCurrentUserPending, isBannerVisible, dismissBanner }] = useHibana();
  const { history, location } = props;

  const handleClick = () => {
    history.push({ pathname: PROFILE_PAGE_PATH });
    dismissBanner();
  };

  if (
    isCurrentUserPending ||
    isBannerVisible === false ||
    location.pathname === PROFILE_PAGE_PATH
  ) {
    return null;
  }

  return (
    <div data-id="hibana-controls" className={styles.HibanaBanner}>
      <ScreenReaderOnly>
        <Heading as="h3">Theme Information</Heading>
      </ScreenReaderOnly>

      <div>
        <p className={styles.HibanaDescription}>
          <span>Your voice matters! We want your feedback on our new app design.&nbsp;</span>

          <ButtonLink className={styles.HibanaLink} onClick={handleClick}>
            Turn it on to see our new look!
          </ButtonLink>
        </p>

        <button className={styles.HibanaDismiss} onClick={dismissBanner}>
          <Close size={20} />

          <ScreenReaderOnly>Dismiss</ScreenReaderOnly>
        </button>
      </div>
    </div>
  );
}

export default withRouter(HibanaBanner);
