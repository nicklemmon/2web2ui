import { useEffect, useReducer } from 'react';
import { usePrevious } from 'src/hooks';
import _ from 'lodash';

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_VALUES':
      if (action.value.length === 0) {
        return { ...state };
      }

      // This helps when the user pastes in values with spaces
      if (action.value.includes(' ')) {
        const additionalValues = action.value.split(' ');

        return {
          ...state,
          value: '',
          valueList: [...state.valueList, ...additionalValues],
        };
      }

      return {
        ...state,
        value: '',
        valueList: [...state.valueList, action.value],
      };

    case 'SET_VALUE_LIST': {
      return { ...state, valueList: action.valueList };
    }

    case 'REMOVE_VALUE': {
      // Filter out any values that match the target for removal
      const valueList = state.valueList.filter(item => {
        return !_.isEqual(action.value, item);
      });

      return { ...state, valueList };
    }

    case 'ERROR': {
      return { ...state, error: action.error };
    }

    case 'VALUE_CHANGE': {
      // Remove the minimum length error as the user's entry changes, but only when the problem is fixed
      if (
        state.minLength &&
        (action.value.length === 0 || action.value.length >= state.minLength)
      ) {
        return { ...state, value: action.value, error: undefined };
      }

      return { ...state, value: action.value };
    }

    default:
      throw new Error(`${action.type} is not supported by useMultiEntry.`);
  }
}

const defaultInitialState = {
  value: '',
  valueList: [],
  error: undefined, // TODO: If other error scenarios are introduced, this should be an object that contains each type of error
};

export default function useMultiEntry(initialState) {
  const prevInitialState = usePrevious(initialState);
  const [state, dispatch] = useReducer(reducer, { ...defaultInitialState, ...initialState });

  // If the initial state updates (i.e., through an external source of state),
  // update the value list accordingly
  useEffect(() => {
    if (!_.isEqual(prevInitialState, initialState)) {
      return dispatch({ type: 'SET_VALUE_LIST', valueList: initialState.valueList });
    }
  }, [prevInitialState, initialState]);

  function handleKeyDown(e) {
    // Spacebar or enter key
    if (e.keyCode === 32 || e.keyCode === 13) {
      e.preventDefault();

      // Configurable min length returns an error when attempting to update valueList before meeting the requirement
      if (state.minLength && e.target.value.length < state.minLength) {
        return dispatch({
          type: 'ERROR',
          error: `${state.minLength} or more characters required`,
        });
      }

      return dispatch({ type: 'UPDATE_VALUES', value: e.target.value });
    }
  }

  function handleRemove(target) {
    return dispatch({ type: 'REMOVE_VALUE', value: target });
  }

  function handleChange(e) {
    return dispatch({ type: 'VALUE_CHANGE', value: e.target.value });
  }

  function handleBlur(e) {
    return dispatch({ type: 'UPDATE_VALUES', value: e.target.value });
  }

  return {
    value: state.value,
    valueList: state.valueList,
    minLength: state.minLength,
    error: state.error,
    handleKeyDown,
    handleBlur,
    handleChange,
    handleRemove,
  };
}
