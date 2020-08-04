import { fetch as fetchAccount } from './account';
import { get as getCurrentUser, getGrants } from './currentUser';
import { getPlans, getBundles, getSubscription } from './billing';
import { isHeroku, isAzure } from 'src/helpers/conditions/user';
import { isAws } from 'src/helpers/conditions/account';

// initialize some state used for access control
export function initializeAccessControl() {
  // These will fail if the auth token has expired
  // Hides global alerts when user is logged out and redirected to /auth
  const meta = { showErrorAlert: false };

  return (dispatch, getState) =>
    Promise.all([dispatch(getCurrentUser({ meta })), dispatch(fetchAccount({ meta }))]).then(
      ([currentUser]) => {
        const allInitialCalls = [
          dispatch(getGrants({ role: currentUser.access_level, meta })),
          dispatch(getPlans({ meta })),
          dispatch(getBundles({ meta })),
        ];
        if (isHeroku(getState()) || isAzure(getState()) || isAws(getState())) {
          return Promise.all([...allInitialCalls]).then(() =>
            dispatch({ type: 'ACCESS_CONTROL_READY' }),
          );
        }
        return Promise.all([...allInitialCalls, dispatch(getSubscription({ meta }))]).then(() =>
          dispatch({ type: 'ACCESS_CONTROL_READY' }),
        );
      },
    );
}
