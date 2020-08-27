/* eslint-disable max-lines */
import _ from 'lodash';
import React from 'react';
import { Panel } from 'src/components/matchbox';
import SummaryTable, { Column } from 'src/components/summaryTable';
import { setSubaccountQuery } from 'src/helpers/subaccounts';
import { DEFAULT_VIEW } from '../constants/summaryTables';
import FacetDataCell from './dataCells/FacetDataCell';
import NumericDataCell from './dataCells/NumericDataCell';
import SparklineDataCell from './dataCells/SparklineDataCell';
import WoWDataCell from './dataCells/WoWDataCell';
import WoWHeaderCell from './dataCells/WoWHeaderCell';
import moment from 'moment';
import { V2Date } from '../constants/healthScoreV2';

class HealthScoreOverview extends React.Component {
  componentDidMount() {
    this.resetTable();
  }

  // assumptions, signalOptions and summaryTable should never both change on the same update and
  // resetting signal options will trigger a summary table reset which calls getData
  componentDidUpdate(prevProps) {
    const { signalOptions, summaryTable } = this.props;

    if (prevProps.signalOptions !== signalOptions) {
      this.resetTable();
    } else if (prevProps.summaryTable !== summaryTable) {
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
    const { getHealthScore, signalOptions, summaryTable } = this.props;
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

    getHealthScore({
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

  handleClick = (facetId, subaccountId) => ({ date }) => {
    const { facet, history } = this.props;
    let search;

    if (facet.key === 'sid' && facetId === -1) {
      return; // ignore
    }

    if (subaccountId >= 0) {
      search = setSubaccountQuery(subaccountId);
    }

    history.push({
      pathname: `/signals/health-score/${facet.key}/${facetId}`,
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
      header,
    } = this.props;
    const { to } = signalOptions;

    const subaccountFilter = _.get(signalOptions, 'subaccount.id');
    const isCustomRange = signalOptions.relativeRange === 'custom';
    const noFacetSelected = facet.key === 'sid';
    const noSubaccountFilter = subaccountFilter === undefined;
    const afterNewModel = to && moment(V2Date, 'YYYY-MM-DD').diff(to) <= 0;

    // Filter out account aggregate, there is no way to do it via api
    // This is done here to preserve pagination functionality
    const filteredData = _.filter(data, ({ sid }) => sid !== -1);

    return (
      <Panel.LEGACY>
        {header && <Panel.LEGACY.Section>{header}</Panel.LEGACY.Section>}
        <SummaryTable
          data={filteredData}
          empty={filteredData.length === 0}
          error={error && error.message}
          loading={loading}
          tableName={tableName}
          totalCount={totalCount}
        >
          {(noSubaccountFilter || noFacetSelected) && (
            <Column
              dataKey="sid"
              label="Subaccount"
              sortable
              width={noFacetSelected ? '30%' : '15%'}
              component={({ sid }) => (
                <FacetDataCell
                  dimension="health-score"
                  facet="sid"
                  id={sid}
                  name={_.get(_.find(subaccounts, { id: sid }), 'name')}
                  truncate
                />
              )}
            />
          )}
          {!noFacetSelected && (
            <Column
              dataKey={facet.key}
              label={facet.label}
              sortable
              width={noSubaccountFilter ? '15%' : '30%'}
              component={props => (
                <FacetDataCell
                  dimension="health-score"
                  facet={facet.key}
                  id={props[facet.key]}
                  subaccountId={props.sid}
                  truncate
                />
              )}
            />
          )}
          <Column
            dataKey="history"
            label="Daily Health Score"
            width={afterNewModel ? '20%' : '30%'}
            component={({ history, ...filteredData }) => {
              const id = filteredData[facet.key];
              return (
                <SparklineDataCell
                  data={history}
                  dataKey="health_score"
                  label="Health Score"
                  onClick={this.handleClick(id, filteredData.sid)}
                  relative={false}
                />
              );
            }}
          />
          <Column
            align="right"
            dataKey="current_health_score"
            label={isCustomRange ? 'Score' : 'Current Score'}
            sortable
            width="12.5%"
            component={({ current_health_score }) => (
              <NumericDataCell value={current_health_score} />
            )}
          />
          {afterNewModel && (
            <Column
              align="right"
              dataKey="current_total_injection_count"
              label={isCustomRange ? 'Injections' : 'Current Injections'}
              sortable
              width="15%"
              component={({ current_total_injection_count }) => (
                <NumericDataCell value={current_total_injection_count} />
              )}
            />
          )}
          <Column
            align="right"
            dataKey="WoW"
            label={<WoWHeaderCell />}
            width={afterNewModel ? '12.5%' : '15%'}
            component={({ WoW }) => <WoWDataCell value={WoW} />}
          />
          <Column
            align="right"
            dataKey="average_health_score"
            label="Average Score"
            width={afterNewModel ? '12.5%' : '15%'}
            component={({ average_health_score }) => (
              <NumericDataCell value={average_health_score} />
            )}
          />
        </SummaryTable>
      </Panel.LEGACY>
    );
  }
}

export default HealthScoreOverview;
