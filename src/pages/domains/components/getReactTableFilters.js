export default (
  filters,
  filtersState,
  { domainName = null, targetName = undefined, targetChecked = undefined },
) => {
  const newFilters = Object.keys(filters).map(i => {
    if (domainName && 'domainName' === i) {
      return { id: 'domainName', value: domainName };
    } else if (targetName && targetChecked !== undefined && targetName === i) {
      return { id: i, value: targetChecked };
    }
    let index = filtersState.checkboxes.map(i => i.name).indexOf(i);
    let filter = filtersState.checkboxes[index];

    if (!filter) {
      return null;
    } else if (filter.isChecked) {
      return {
        id: i,
        value: true,
      };
    }

    return null;
  });

  return newFilters.filter(Boolean);
};
