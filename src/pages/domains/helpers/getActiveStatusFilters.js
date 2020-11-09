const getActiveStatusFilters = function(filters) {
  const filterNames = Object.keys(filters);
  const activeStatusFilters = filterNames
    .filter(i => i !== 'domainName')
    .map(key => {
      if (Boolean(filters[key])) {
        return { name: key, value: filters[key] };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return activeStatusFilters;
};

export default getActiveStatusFilters;
