import { useCallback, useReducer, useRef, useEffect } from 'react';
import _ from 'lodash';
import { useLocation, useRouteMatch, useHistory } from 'react-router-dom';
import qs from 'qs';

const PAGE_FILTER_ACTIONS = {
  RESET: 'reset',
  SPREAD: 'spread',
};

const reducer = (state, action) => {
  switch (action.type) {
    case PAGE_FILTER_ACTIONS.RESET: {
      return action.payload;
    }
    default:
      return { ...state, ...action.payload };
  }
};

// Exported to test
export const flattenParameters = obj =>
  Object.keys(obj).reduce((acc, curr) => {
    if (_.isPlainObject(obj[curr])) {
      return { ...acc, ...obj[curr] };
    } else {
      acc[curr] = obj[curr];
    }
    return acc;
  }, {});

// Exported to test
export const unflattenParameters = (filters, allowedList) =>
  Object.keys(allowedList).reduce((unflattened, parameter) => {
    if (_.isPlainObject(allowedList[parameter].defaultValue)) {
      unflattened[parameter] = Object.keys(allowedList[parameter].defaultValue).reduce(
        (acc, val) => {
          acc[val] = filters[val];
          return acc;
        },
        {},
      );
    } else {
      unflattened[parameter] = filters[parameter];
    }
    return unflattened;
  }, {});

const noValidation = () => true;
const noNormalization = val => val;

const normalizeFilterState = (filters, allowedList) => {
  const validatedAndNormalizedFilters = Object.keys(filters).reduce((validated, key) => {
    if (allowedList[key]) {
      const {
        validate = noValidation,
        normalize = noNormalization,
        defaultValue = '',
      } = allowedList[key];
      try {
        const normalized = normalize(filters[key]);
        if (!validate(normalized, filters)) {
          validated[key] = defaultValue;
        } else {
          validated[key] = normalized;
        }
      } catch (e) {
        validated[key] = defaultValue;
      }
    }
    return validated;
  }, {});

  // Add missing keys from allowedList into filters
  Object.keys(allowedList).forEach(filter => {
    if (!validatedAndNormalizedFilters[filter]) {
      validatedAndNormalizedFilters[filter] = allowedList[filter].defaultValue;
    }
  });

  return validatedAndNormalizedFilters;
};

const omitFiltersExcludedFromRoute = (filters, allowedList) => {
  return Object.keys(filters).reduce((routeFilters, current) => {
    if (allowedList[current] && !allowedList[current].excludeFromRoute) {
      routeFilters[current] = filters[current];
    }
    return routeFilters;
  }, {});
};

/**
 * @typedef {object} UsePageFilterReturn
 * @property {object} filters - The filter values keyed by filter name
 * @property {object} prevFilters - The previous state of filter values
 * @property {function} updateFilters - Updater function for filter values
 * @property {function} resetFilters - Reset function to return to default filter values
 */

/**
 * Maintains state of page filters based on the URL.
 *
 * @param {object} allowedList - keys are the possible filter names and the value
 *        for each key is an object with a `validate` function, a `defaultValue` for the filter,
 *        an optional `excludeFromRoute` to exclude the parameter from being included in the route,
 *        and an optional `normalize` function to convert the string/array value from requestParams
 *        before the validation occurs
 *
 * @return {UsePageFilterReturn}
 *         The `filters`, `prevFilters`, `updateFilters`, and `resetFilters` in an object
 *
 * @example
 * const initFilters = {
 *   page: {
 *     validate: val => !isNaN(val) && val > 0 && val < 10,
 *     normalize: val => val * 1, // Convert from string to number
 *     defaultValue: 0,
 *     excludeFromRoute: false,
 *   }
 * };
 *
 * function FakeComponent(){
 * //remember to have initFilters outside the functional component or you will have a runaway useEffect
 * const { filters, prevFilters, updateFilters, resetFilters } = usePageFilters(initFilters);
 * }
 *
 */
const usePageFilters = allowedList => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch();
  const currOptions = useRef({});
  const requestParams = {
    ...qs.parse(location.search, { ignoreQueryPrefix: true }),
    ...match.params,
  };

  const defaultFilters = useRef(
    Object.keys(allowedList).reduce((acc, key) => {
      acc[key] = allowedList[key].defaultValue;
      return acc;
    }, {}),
  );

  const cleanReducer = (state, action) => {
    const { filters } = state;
    return {
      prevFilters: filters,
      filters: normalizeFilterState(reducer(filters, action), allowedList),
    };
  };

  const [{ filters, prevFilters }, dispatch] = useReducer(cleanReducer, {
    filters: normalizeFilterState(
      omitFiltersExcludedFromRoute(unflattenParameters(requestParams, allowedList), allowedList),
      allowedList,
    ),
  });

  const updateFilters = useCallback((filters, options) => {
    currOptions.current = options;
    return dispatch({ type: PAGE_FILTER_ACTIONS.SPREAD, payload: filters });
  }, []);
  const resetFilters = useCallback(
    () => dispatch({ type: PAGE_FILTER_ACTIONS.RESET, payload: defaultFilters.current }),
    [],
  );

  const updateRoute = useCallback(
    newParams => {
      const queryString = qs.stringify(newParams, {
        arrayFormat: 'repeat',
        ...currOptions.current,
      });
      history.push(`${location.pathname}?${queryString}`);
    },
    [history, location.pathname],
  );

  useEffect(() => {
    const nonRouteFilters = omitFiltersExcludedFromRoute(filters, allowedList);
    updateRoute(flattenParameters(nonRouteFilters));
  }, [filters, allowedList, history, location.pathname, updateRoute]);

  return { filters, prevFilters, updateFilters, resetFilters };
};

export default usePageFilters;
