import React from 'react';
import useHibanaOverride from 'src/hooks/useHibanaOverride';
import ScrollToTop from './components/ScrollToTop';
import OGStyles from './Layout.module.scss';
import HibanaStyles from './LayoutHibana.module.scss';

const LargeForm = ({ children }) => {
  const styles = useHibanaOverride(OGStyles, HibanaStyles);

  return (
    <div className={`${styles.wrapper} ${styles.largeForm}`}>
      <main role="main" className={styles.content}>
        <div className={styles.container}>{children}</div>
      </main>
      <ScrollToTop />
    </div>
  );
};

export default LargeForm;
