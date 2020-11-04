export function getReactTableFilters(params) {
  return Object.entries(params)
    .map(x => {
      if (!x[1]) {
        return null;
      }

      return {
        id: x[0],
        value: x[1],
      };
    })
    .filter(Boolean);
}
