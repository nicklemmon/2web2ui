import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteFocusHandler() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.querySelector('body').focus();
    window.scrollTo(0, 0);
  }, [pathname]);

  return <></>;
}
