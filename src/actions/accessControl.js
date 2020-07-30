import { fetch as fetchAccount } from './account';
import { get as getCurrentUser, getGrants } from './currentUser';
import { getPlans, getBundles, getSubscription } from './billing';
import { isHeroku, isAzure } from 'src/helpers/conditions/user';

// initialize some state used for access control
export function initializeAccessControl() {
  // These will fail if the auth token has expired
  // Hides global alerts when user is logged out and redirected to /auth
  const meta = { showErrorAlert: false };

  return (dispatch, getState) => {
    dispatch(getCurrentUser({ meta })).then(({ access_level }) => {
      const allInitialCalls = [
        dispatch(getGrants({ role: access_level, meta })),
        dispatch(fetchAccount({ meta })),
        dispatch(getPlans({ meta })),
        dispatch(getBundles({ meta })),
      ];

      if (isHeroku(getState()) || isAzure(getState())) {
        return Promise.all([...allInitialCalls]).then(() =>
          dispatch({ type: 'ACCESS_CONTROL_READY' }),
        );
      } else {
        return Promise.all([...allInitialCalls, dispatch(getSubscription({ meta }))]).then(() =>
          dispatch({ type: 'ACCESS_CONTROL_READY' }),
        );
      }
    });
  };
}
