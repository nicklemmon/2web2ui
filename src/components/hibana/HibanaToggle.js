import React from 'react';
import { Button } from '@sparkpost/matchbox-hibana';
import { useHibana } from 'src/context/HibanaContext';
import styles from './HibanaComponents.module.scss';

export default function HibanaToggle() {
  const [state, dispatch] = useHibana();
  const { isHibanaEnabled } = state;

  return (
    <Button
      color="blue"
      className={styles.HibanaToggle}
      onClick={() => dispatch({ type: isHibanaEnabled ? 'DISABLE' : 'ENABLE' })}
    >
      {isHibanaEnabled ? <>That&rsquo;s fine, take me back</> : <>Take a Look</>}
    </Button>
  );
}