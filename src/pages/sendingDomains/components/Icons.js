import React from 'react';
import { CheckCircle, Error } from '@sparkpost/matchbox-icons';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import OGStyles from './Icons.module.scss';
import hibanaStyles from './IconsHibana.module.scss';

export function VerifiedIcon() {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  return <CheckCircle size={16} className={styles.GreenCheck} />;
}

VerifiedIcon.displayName = 'VerifiedIcon';

export function ErrorIcon() {
  const styles = useHibanaOverride(OGStyles, hibanaStyles);

  return <Error size={16} className={styles.RedError} />;
}

ErrorIcon.displayName = 'ErrorIcon';
