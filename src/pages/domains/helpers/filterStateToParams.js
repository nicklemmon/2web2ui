function filterStateToParams(filtersState) {
  let params = {};
  for (let checkbox of filtersState.checkboxes) {
    params[checkbox.name] = checkbox.isChecked;
  }
  params.domainName = filtersState.domainName;
  return params;
}

export default filterStateToParams;
