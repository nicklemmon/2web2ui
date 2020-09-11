import React from 'react';
import { Button } from 'src/components/matchbox';
import { useHibana } from 'src/context/HibanaContext';
import { GUIDE_IDS } from 'src/constants';
import styles from './FeedbackButton.module.scss';

export default function FeedbackButton() {
  const [{ isHibanaEnabled }] = useHibana();

  if (!window.Appcues || !isHibanaEnabled) return null;

  const handleClick = () => {
    if (window.Appcues) {
      window.Appcues.show(GUIDE_IDS.GIVE_HIBANA_FEEDBACK);
    }
  };

  return (
    <Button onClick={handleClick} variant="primary" className={styles.FeedbackButton}>
      Give Feedback
    </Button>
  );
}
