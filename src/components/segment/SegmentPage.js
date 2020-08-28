import { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { segmentPage } from 'src/helpers/segment';

export const SegmentPage = ({ accessControlReady }) => {
  const history = useHistory();
  const prevPathname = useRef(history.location.pathname);

  // On URL path changes, inform segment via "PAGE" event
  useEffect(() => {
    if (accessControlReady) {
      const unlisten = history.listen(location => {
        if (prevPathname.current !== location.pathname) {
          prevPathname.current = location.pathname;
          segmentPage();
        }
      });
      return () => unlisten();
    }
  }, [accessControlReady, history]);

  // "PAGE" on app load
  useEffect(() => {
    segmentPage();
  }, []);

  return null;
};

const mapStateToProps = state => ({
  accessControlReady: state.accessControlReady,
});

export default connect(mapStateToProps, {})(SegmentPage);
