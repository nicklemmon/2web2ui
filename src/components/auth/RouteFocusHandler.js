import React, { useEffect } from 'react';
import useRouter from 'src/hooks/useRouter';

export default function RouteFocusHandler() {
  const {
    location: { pathname },
  } = useRouter();

  useEffect(() => {
    document.querySelector('body').focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return <></>;
}
