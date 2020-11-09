const customDomainStatusFilter = function(rows, columnIds, value) {
  if (!rows || !rows.length) {
    return rows;
  }

  const column = columnIds[0];
  const mappedRows = rows.map(row => (row.values[column] === value ? row : false)).filter(Boolean);
  return mappedRows;
};

export default customDomainStatusFilter;
