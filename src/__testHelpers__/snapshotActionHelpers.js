/* eslint-disable no-undef */
/* eslint-disable jest/no-jasmine-globals */
import debugLog from 'src/__testHelpers__/debugLog';
import { createMockStore } from 'src/__testHelpers__/mockStore';
import cases from 'jest-in-case';

export async function snapshotAction({ actionCreator, state = {} }) {
  const store = createMockStore(state);
  const action = actionCreator();

  if (typeof action === 'object') {
    store.dispatch(action);
  } else if (typeof action === 'function') {
    try {
      const mockDispatchEvent = actionArg => Promise.resolve(store.dispatch(actionArg));
      const mockGetState = () => state;
      await action(mockDispatchEvent, mockGetState); // passing in state because the action pattern is: (dispatch, getState) => { // check state and dispatch event(s) }
    } catch (e) {
      expect(typeof e.message).toEqual('string'); // just to get jest to not yell about no assertions

      if (e.message === "Cannot read property 'loggedIn' of undefined") {
        fail(
          'sparkpostApiRequest is being called for real; if you are trying to mock it then it hasn\t picked up on it yet.',
        );
        return;
      }

      if (e.message === 'dispatch(...).then is not a function') {
        fail(
          'Error: The variable action is a function; what it returns needs to be mocked as a promise in your test that imports snapshotActionCases.',
        );
        return;
      }

      if (typeof e.message === 'string') debugLog(e.message);
      fail(e.message);
      return;
    }
  } else {
    expect(true).toEqual(true); // just to get jest to not yell about no assertions
    throw new Error(
      'Error: action should be an object (most likely returned from the sparkpostApiRequest) or a function that returns a chainable event.',
    );
  }

  expect(store.getActions()).toMatchSnapshot();
}

// testCases should be an object or array in the style of jest-in-case
// each case should be an object with keys:
// - name: test name
// - actionCreator: function that should be dispatched
// - state: optional initial redux state object
export function snapshotActionCases(title, testCases) {
  cases(
    title,
    options => {
      return snapshotAction(options);
    },
    testCases,
  );
}
