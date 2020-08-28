/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel } from 'src/components/matchbox';
import SummaryTable, { Column } from 'src/components/summaryTable';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { DEFAULT_VIEW } from '../constants/summaryTables';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import PercentDataCell from './dataCells/PercentDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import WoWDataCell from './dataCells/WoWDataCell';
import WoWHeaderCell from './dataCells/WoWHeaderCell';
import Calculation from './viewControls/Calculation';
import styles from './SpamTrapOverview.module.scss';

class EngagementRecencyOverview extends React.Component {
  state = {
    calculation: 'relative',
  };

  componentDidMount() {
    this.resetTable();
  }

  // assumptions, signalOptions and summaryTable should never both change on the same update and
  // resetting signal options will trigger a summary table reset which calls getData
  componentDidUpdate(prevProps) {
    const { signalOptions, summaryTable } = this.props;

    if (prevProps.signalOptions !== signalOptions) {
      this.resetTable();
    }

    if (prevProps.summaryTable !== summaryTable) {
      this.getData();
    }
  }

  resetTable = () => {
    const { defaults = {}, facet, resetSummaryTable, tableName } = this.props;
    let options;

    if (facet.key === 'sid') {
      options = DEFAULT_VIEW;
    }

    resetSummaryTable(tableName, { ...options, ...defaults });
  };

  getData = () => {
    const { getEngagementRecency, signalOptions, summaryTable } = this.props;
    let { subaccount } = signalOptions;
    let order;
    let orderBy;

    if (summaryTable.order) {
      order = summaryTable.order.ascending ? 'asc' : 'desc';
      orderBy = summaryTable.order.dataKey;
    }

    if (subaccount && subaccount.id === undefined) {
      subaccount = undefined; // unset
    }

    getEngagementRecency({
      facet: signalOptions.facet,
      filter: signalOptions.facetSearchTerm,
      from: signalOptions.from,
      limit: summaryTable.perPage,
      offset: (summaryTable.currentPage - 1) * summaryTable.perPage,
      order,
      orderBy,
      relativeRange: signalOptions.relativeRange,
      subaccount,
      to: signalOptions.to,
    });
  };

  handleCalculationChange = calculation => {
    this.setState({ calculation });
  };

  handleClick = facetId => ({ date }) => {
    const { facet, history, signalOptions } = this.props;
    let search;

    if (signalOptions.subaccount) {
      search = setSubaccountQuery(signalOptions.subaccount.id);
    }

    history.push({
      pathname: `/signals/engagement/cohorts/${facet.key}/${facetId}`,
      search,
      state: {
        date,
      },
    });
  };

  render() {
    const {
      data,
      error,
      facet,
      loading,
      signalOptions,
      subaccounts,
      tableName,
      totalCount,
    } = this.props;
    const { calculation } = this.state;
    const isCustomRange = signalOptions.relativeRange === 'custom';

    return (
      <Panel.LEGACY>
        <Panel.LEGACY.Section>
          <div className={styles.Controls}>
            <Calculation initialSelected={calculation} onChange={this.handleCalculationChange} />
          </div>
        </Panel.LEGACY.Section>
        <SummaryTable
          data={data}
          empty={data.length === 0}
          error={error && error.message}
          loading={loading}
          tableName={tableName}
          totalCount={totalCount}
        >
          <Column
            dataKey={facet.key}
            label={facet.label}
            sortable
            width="30%"
            component={props => {
              const id = props[facet.key];

              return (
                <FacetDataCell
                  dimension="engagement/cohorts"
                  facet={facet.key}
                  id={id}
                  name={_.get(_.find(subaccounts, { id }), 'name')}
                  subaccountId={_.get(signalOptions, 'subaccount.id')}
                  truncate
                />
              );
            }}
          />
          <Column
            dataKey="history"
            label="Daily Recently Engaged Recipients"
            width="30%"
            component={({ history, ...data }) => {
              const id = data[facet.key];

              return (
                <SparklineDataCell
                  data={history}
                  dataKey={
                    calculation === 'relative'
                      ? 'relative_engaged_recipients'
                      : 'engaged_recipients'
                  }
                  label="Recently Engaged"
                  onClick={this.handleClick(id)}
                  relative={calculation === 'relative'}
                />
              );
            }}
          />
          {calculation === 'relative' ? (
            <Column
              align="right"
              dataKey="current_relative_engaged_recipients"
              label={isCustomRange ? 'Ratio' : 'Current Ratio'}
              sortable
              width="12.5%"
              component={({ current_relative_engaged_recipients }) => (
                <PercentDataCell value={current_relative_engaged_recipients} />
              )}
            />
          ) : (
            <Column
              align="right"
              dataKey="current_engaged_recipients"
              label={isCustomRange ? 'Count' : 'Current Count'}
              sortable
              width="12.5%"
              component={({ current_engaged_recipients }) => (
                <NumericDataCell value={current_engaged_recipients} />
              )}
            />
          )}
          <Column
            align="right"
            dataKey="WoW"
            label={<WoWHeaderCell />}
            width="12.5%"
            component={({ WoW }) => <WoWDataCell value={WoW} />}
          />
          <Column
            align="right"
            dataKey="c_total"
            label="Current Injections"
            sortable
            width="15%"
            component={({ current_c_total }) => <NumericDataCell value={current_c_total} />}
          />
        </SummaryTable>
      </Panel.LEGACY>
    );
  }
}

export default EngagementRecencyOverview;
