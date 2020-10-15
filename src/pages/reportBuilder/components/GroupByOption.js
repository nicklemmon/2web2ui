import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './ReportTable.module.scss';
import useUniqueId from 'src/hooks/useUniqueId';
import { Box, Grid, Checkbox, Select } from 'src/components/matchbox';
import { GROUP_CONFIG } from '../constants/tableConfig';
import { useReportBuilderContext } from '../context/ReportBuilderContext';
import { selectCondition } from 'src/selectors/accessConditionState';
import { isAccountUiOptionSet } from 'src/helpers/conditions/account';

import { dehydrateFilters } from '../helpers';

export const GroupByOption = props => {
  const { groupBy, hasSubaccounts, tableLoading, _getTableData, isComparatorsEnabled } = props;
  const { state: reportOptions } = useReportBuilderContext();

  const selectId = useUniqueId('break-down-by');

  const [topDomainsOnly, setTopDomainsOnly] = useState(true);

  const handleGroupChange = e => {
    if (e.target.value !== 'placeholder') {
      if (isComparatorsEnabled) {
        const { filters, ...options } = reportOptions;
        _getTableData({
          groupBy: e.target.value,
          reportOptions: { ...options, filters: dehydrateFilters(filters) },
        });
      } else {
        _getTableData({ groupBy: e.target.value, reportOptions });
      }
    }
  };

  const handleDomainsCheckboxChange = () => {
    const newTopDomainsOnly = !topDomainsOnly;
    setTopDomainsOnly(newTopDomainsOnly);
    const groupBy = newTopDomainsOnly ? 'watched-domain' : 'domain';
    const { filters, ...options } = reportOptions;

    if (isComparatorsEnabled) {
      _getTableData({
        groupBy,
        reportOptions: { ...options, filters: dehydrateFilters(filters) },
      });
    } else {
      _getTableData({ groupBy, reportOptions });
    }
  };

  const getSelectOptions = () => {
    const filteredOptionsKeys = Object.keys(GROUP_CONFIG).filter(key => {
      return !(
        (key === 'subaccount' && !hasSubaccounts) ||
        (key === 'domain' && topDomainsOnly) ||
        (key === 'watched-domain' && !topDomainsOnly)
      );
    });

    const options = filteredOptionsKeys.map(key => ({
      value: key,
      label: GROUP_CONFIG[key].label,
    }));

    return options;
  };

  const renderDomainsCheckbox = () => {
    //Only show 'Top Domains Only' checkbox when on the recipient domains grouping
    if (groupBy !== 'watched-domain' && groupBy !== 'domain') {
      return null;
    }

    return (
      <Box marginTop="500" className={styles.TopDomainsCheckbox}>
        <Checkbox
          id="watchedDomains"
          label="Top Domains Only"
          checked={topDomainsOnly}
          onChange={handleDomainsCheckboxChange}
          disabled={tableLoading}
        />
      </Box>
    );
  };

  return (
    <Grid>
      <Grid.Column xs={12} md={5} lg={4}>
        <Select
          label="Break Down By"
          id={selectId}
          options={getSelectOptions()}
          value={groupBy}
          disabled={tableLoading}
          onChange={handleGroupChange}
          placeholder="Select Resource"
          placeholderValue="placeholder"
        />
      </Grid.Column>
      <Grid.Column xs={12} md={4} mdOffset={3} lg={3} lgOffset={5}>
        {renderDomainsCheckbox()}
      </Grid.Column>
    </Grid>
  );
};

export default connect(state => ({
  isComparatorsEnabled: selectCondition(isAccountUiOptionSet('allow_report_filters_v2'))(state),
}))(GroupByOption);
