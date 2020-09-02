import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { list as getSubaccounts } from 'src/actions/subaccounts';
import { getCurrentHealthScore } from 'src/actions/signals';
import { Grid, Panel } from 'src/components/matchbox';
import Page from '../components/SignalsPage';
import HealthScoreOverview from '../containers/HealthScoreOverviewContainer';
import FacetFilter from '../components/filters/FacetFilter';
import DateFilter from '../components/filters/DateFilter';
import SubaccountFilter from '../components/filters/SubaccountFilter';
import CurrentHealthGauge from './components/CurrentHealthGauge/CurrentHealthGauge';
import HealthScoreChart from './components/HealthScoreChart/HealthScoreChart';
import { changeSignalOptions } from 'src/actions/signalOptions';
import { getValidSignalsDateRange } from 'src/helpers/signals';
import { showAlert } from 'src/actions/globalAlert';
import useRouter from 'src/hooks/useRouter';
import facets from '../constants/facets';
import { HEALTH_SCORE_INFO } from '../constants/info';
import { PageDescription } from 'src/components/text';
import { hasSubaccounts } from 'src/selectors/subaccounts';

export function HealthScoreDashboard(props) {
  const {
    from,
    getCurrentHealthScore,
    getSubaccounts,
    hasSubaccounts,
    relativeRange,
    subaccounts,
    to,
    changeSignalOptions,
    showAlert,
  } = props;

  // Gets subaccount info on mount
  useEffect(() => {
    getSubaccounts();
  }, [getSubaccounts]);

  //If To and From are given as URL params, first update redux with the new date range and then remove
  //the params.
  const { requestParams, updateRoute } = useRouter();
  const { from: urlFrom, to: urlTo } = requestParams;

  const hasDeeplinkDateRange = Boolean(urlFrom && urlTo);

  useEffect(() => {
    if (hasDeeplinkDateRange) {
      try {
        const { to: validatedTo, from: validatedFrom } = getValidSignalsDateRange({
          from: moment(urlFrom),
          to: moment(urlTo),
        });
        changeSignalOptions({
          from: validatedFrom.toDate(),
          to: validatedTo.toDate(),
          relativeRange: 'custom',
        });
      } catch (e) {
        showAlert({ type: 'error', message: e.message });
      } finally {
        updateRoute();
      }
    }
  }, [
    changeSignalOptions,
    hasDeeplinkDateRange,
    props.history,
    showAlert,
    updateRoute,
    urlFrom,
    urlTo,
  ]);

  // Gets injections and current score for gauge and timeseries only when dates change
  useEffect(() => {
    // Ordered by ascending sid to guarantee account rollup (-1) is returned
    // order_by: 'sid' is the default behavior
    if (!hasDeeplinkDateRange) {
      //Only fetch when redux has been updated with to and from to prevent unnecessary fetch.
      getCurrentHealthScore({ relativeRange, order: 'asc', limit: 1, from, to });
    }
  }, [getCurrentHealthScore, relativeRange, from, to, hasDeeplinkDateRange]);

  return (
    <Page title="Health Score">
      <PageDescription>{HEALTH_SCORE_INFO}</PageDescription>
      <Panel.LEGACY title="Health Score Trends">
        <Panel.LEGACY.Section>
          <Grid>
            <Grid.Column xs={12} md={5}>
              <DateFilter label="Date Range" />
            </Grid.Column>
          </Grid>
        </Panel.LEGACY.Section>
      </Panel.LEGACY>

      <Grid>
        <Grid.Column xs={12} lg={5} xl={4}>
          <CurrentHealthGauge />
        </Grid.Column>
        <Grid.Column xs={12} lg={7} xl={8}>
          <HealthScoreChart />
        </Grid.Column>
      </Grid>
      <HealthScoreOverview
        defaults={{ perPage: 25 }}
        subaccounts={subaccounts}
        hideTitle
        header={
          <Grid>
            {hasSubaccounts && (
              <Grid.Column md={5} xs={12}>
                <SubaccountFilter label="Subaccount" />
              </Grid.Column>
            )}
            <FacetFilter facets={facets} />
          </Grid>
        }
      />
    </Page>
  );
}

const mapStateToProps = state => ({
  facet: state.signalOptions.facet,
  from: state.signalOptions.from,
  subaccounts: state.subaccounts.list,
  hasSubaccounts: hasSubaccounts(state),
  relativeRange: state.signalOptions.relativeRange,
  to: state.signalOptions.to,
});

const mapDispatchToProps = {
  getCurrentHealthScore,
  getSubaccounts,
  changeSignalOptions,
  showAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthScoreDashboard);
