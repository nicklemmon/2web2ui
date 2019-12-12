export const initialState = {
  hacks: [],
  hacksDeux: { inbox: 0, spam: 0 },
  loadingHacks: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case 'HACK_PENDING':
      return { ...state, hacks: [], loadingHacks: true };
    case 'HACK_FAIL':
      return { ...state, loadingHacks: false };
    case 'HACK_SUCCESS':
      console.log(payload);
      return { ...state, hacks: payload, loadingHacks: false };
    case 'HACK_DEUX_SUCCESS':
      console.log(payload);
      return { ...state, hacksDeux: payload };
    default:
      return state;
  }
};
