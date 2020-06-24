import cases from 'jest-in-case';
import blocklistReducer, { initialState } from '../blocklist';

const TEST_CASES = {
  'list incidents pending': {
    type: 'LIST_INCIDENTS_PENDING',
  },
  'list incidents success': {
    payload: { fakeData: true },
    type: 'LIST_INCIDENTS_SUCCESS',
  },
  'list incidents fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_INCIDENTS_FAIL',
  },
  'get incident pending': {
    type: 'GET_INCIDENT_PENDING',
  },
  'get incident success': {
    payload: { fakeData: true },
    type: 'GET_INCIDENT_SUCCESS',
  },
  'get incident fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'GET_INCIDENT_FAIL',
  },
  'list incidents for resource pending': {
    type: 'LIST_INCIDENTS_FOR_RESOURCE_PENDING',
  },
  'list incidents for resource success': {
    payload: { fakeData: true },
    type: 'LIST_INCIDENTS_FOR_RESOURCE_SUCCESS',
  },
  'list incidents for resource fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_INCIDENTS_FOR_RESOURCE_FAIL',
  },
  'list incidents for blocklist pending': {
    type: 'LIST_INCIDENTS_FOR_BLOCKLIST_PENDING',
  },
  'list incidents for blocklist success': {
    payload: { fakeData: true },
    type: 'LIST_INCIDENTS_FOR_BLOCKLIST_SUCCESS',
  },
  'list incidents for blocklist fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_INCIDENTS_FOR_BLOCKLIST_FAIL',
  },
  'list historical incidents pending': {
    type: 'LIST_HISTORICAL_INCIDENTS_PENDING',
  },
  'list historical incidents success': {
    payload: { fakeData: true },
    type: 'LIST_HISTORICAL_INCIDENTS_SUCCESS',
  },
  'list historical incidents fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_HISTORICAL_INCIDENTS_FAIL',
  },
  'list monitors pending': {
    type: 'LIST_MONITORS_PENDING',
  },
  'list monitors success': {
    payload: { fakeData: true },
    type: 'LIST_MONITORS_SUCCESS',
  },
  'list monitors fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_MONITORS_FAIL',
  },
  'add watchlist pending': {
    type: 'ADD_WATCHLIST_PENDING',
  },
  'add watchlist success': {
    payload: { fakeData: true },
    type: 'ADD_WATCHLIST_SUCCESS',
  },
  'add watchlist fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'ADD_WATCHLIST_FAIL',
  },
  'delete monitor pending': {
    type: 'DELETE_MONITOR_PENDING',
  },
  'delete monitor fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'DELETE_MONITOR_FAIL',
  },
  'list blocklists pending': {
    type: 'LIST_BLOCKLISTS_PENDING',
  },
  'list blocklists success': {
    payload: { fakeData: true },
    type: 'LIST_BLOCKLISTS_SUCCESS',
  },
  'list blocklists fail': {
    payload: { errors: [{ message: 'Some error occurred' }] },
    type: 'LIST_BLOCKLISTS_FAIL',
  },
};

cases(
  'BlockList Reducer',
  action => {
    expect(blocklistReducer(initialState, action)).toMatchSnapshot();
  },
  TEST_CASES,
);

it('BlockList Reducer delete monitor success deletes the resource from redux store list', () => {
  const state = { ...initialState, monitors: [{ resource: '101.101' }, { resource: '101.102' }] };
  const action = {
    type: 'DELETE_MONITOR_SUCCESS',
    meta: {
      resource: '101.101',
    },
  };
  expect(blocklistReducer(state, action).monitors).toEqual([{ resource: '101.102' }]);
});
