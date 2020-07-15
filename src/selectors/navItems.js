import { createSelector } from 'reselect';
import _ from 'lodash';
import defaultRoutes, { hibanaRoutes } from 'src/config/routes';
import { navItems, hibanaNavItems } from 'src/config/navItems';
import { accountNavItems, hibanaAccountNavItems } from 'src/config/navItems/account';
import selectAccessConditionState from './accessConditionState';
import { all } from 'src/helpers/conditions/compose';

export const mapNavToRoutes = _.memoize((items, routes = defaultRoutes) => {
  const routesByPath = _.keyBy(routes, 'path');
  return items.map(item => {
    item.route = routesByPath[item.to];
    if (item.children) {
      item.children = mapNavToRoutes(item.children);
    }
    return item;
  });
});

export function filterNavByAccess(items, accessConditionState) {
  const firstLevelFiltered = items.filter(item => {
    const allowed = () => true;
    const navCondition = _.get(item, 'condition', allowed);
    const routeCondition = _.get(item, 'route.condition', () => true);
    return all(navCondition, routeCondition)(accessConditionState);
  });

  const childrenFiltered = firstLevelFiltered.map(item => {
    if (item.children) {
      const filteredChildren = filterNavByAccess(item.children, accessConditionState);

      item = {
        ...item,
        children: filteredChildren,
        to: filteredChildren[0] ? filteredChildren[0].to : '/', // If the item has children, the first level item `to` becomes
      };
    }

    return item;
  });

  return childrenFiltered.filter(item => !item.children || item.children.length);
}

export function prepareNavItems(items, accessConditionState) {
  const mapped = mapNavToRoutes(items);
  return filterNavByAccess(mapped, accessConditionState);
}

export function prepareHibanaNavItems(items, accessConditionState) {
  const mapped = mapNavToRoutes(items, hibanaRoutes);
  return filterNavByAccess(mapped, accessConditionState);
}

// Navigation items selectors
export const selectNavItems = createSelector([selectAccessConditionState], accessConditionState =>
  prepareNavItems(navItems, accessConditionState),
);

export const selectHibanaNavItems = createSelector(
  [selectAccessConditionState],
  accessConditionState => {
    return prepareHibanaNavItems(hibanaNavItems, accessConditionState);
  },
);

export const selectAccountNavItems = createSelector(
  [selectAccessConditionState],
  accessConditionState => prepareNavItems(accountNavItems, accessConditionState),
);

// Account item selectors
export const selectHibanaAccountNavItems = createSelector(
  [selectAccessConditionState],
  accessConditionState => prepareHibanaNavItems(hibanaAccountNavItems, accessConditionState),
);
