import { createSelector } from 'reselect';
import defaultRoutes, { hibanaRoutes } from 'src/config/routes';
import { isUserUiOptionSet } from 'src/helpers/conditions/user';
import { selectCondition } from 'src/selectors/accessConditionState';

export const selectRoutes = createSelector(
  [selectCondition(isUserUiOptionSet('isHibanaEnabled'))],
  isHibanaEnabled => (isHibanaEnabled ? hibanaRoutes : defaultRoutes),
);
